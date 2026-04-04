<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SchoolClassController extends Controller
{
    /**
     * Afficher toutes les classes (paginées)
     */
    public function index(Request $request)
    {
        $classes = SchoolClass::query()
            ->when($request->level, fn($q, $l) => $q->where('level', $l))
            ->when($request->academic_year_id, fn($q, $id) => $q->where('academic_year_id', $id))
            ->paginate(25);

        return response()->json($classes, 200);
    }

    /**
     * Créer une nouvelle classe
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'             => 'required|string|max:255|unique:school_classes,name',
            'level'            => 'nullable|string|max:50',
            'capacity'         => 'nullable|integer|min:1|max:100',
            'academic_year_id' => 'nullable|exists:academic_years,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $class = SchoolClass::create([
            'name'             => $request->name,
            'level'            => $request->level,
            'capacity'         => $request->capacity ?? 30,
            'academic_year_id' => $request->academic_year_id ?? null,
        ]);

        return response()->json([
            'message' => 'Classe créée avec succès.',
            'class'   => $class,
        ], 201);
    }

    /**
     * Afficher une seule classe avec ses relations
     */
    public function show($id)
    {
        $class = SchoolClass::with(['students', 'schedules'])->findOrFail($id);

        return response()->json($class, 200);
    }

    /**
     * Mettre à jour une classe existante
     */
    public function update(Request $request, $id)
    {
        $class = SchoolClass::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name'             => 'sometimes|string|max:255|unique:school_classes,name,' . $class->id,
            'level'            => 'nullable|string|max:50',
            'capacity'         => 'nullable|integer|min:1|max:100',
            'academic_year_id' => 'nullable|exists:academic_years,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $class->update($request->only(['name', 'level', 'capacity', 'academic_year_id']));

        return response()->json([
            'message' => 'Classe mise à jour avec succès.',
            'class'   => $class,
        ], 200);
    }

    /**
     * Supprimer une classe (bloqué si des élèves y sont inscrits)
     */
    public function destroy($id)
    {
        $class = SchoolClass::withCount('students')->findOrFail($id);

        if ($class->students_count > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer cette classe : elle contient encore ' . $class->students_count . ' élève(s).',
            ], 409);
        }

        $class->delete();

        return response()->json([
            'message' => 'Classe supprimée avec succès.',
        ], 200);
    }

    /**
     * Retourner toutes les classes ayant encore de la place disponible.
     *
     * Paramètres de filtre (query string, tous optionnels) :
     *   - level            : filtre par niveau (ex: "6ème", "Terminale")
     *   - academic_year_id : filtre par année scolaire
     *
     * Exemple d'appel :
     *   GET /api/classes/libres
     *   GET /api/classes/libres?level=6ème
     *   GET /api/classes/libres?academic_year_id=3
     *   GET /api/classes/libres?level=Terminale&academic_year_id=3
     */
    public function getFreeClasses(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'level'            => 'nullable|string|max:50',
            'academic_year_id' => 'nullable|integer|exists:academic_years,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $classes = SchoolClass::withCount('students')
            // Filtre optionnel par niveau
            ->when($request->level, fn($q, $l) => $q->where('level', $l))
            // Filtre optionnel par année scolaire
            ->when($request->academic_year_id, fn($q, $id) => $q->where('academic_year_id', $id))
            // On délègue le calcul de disponibilité à la base de données
            ->having('students_count', '<', DB::raw('capacity'))
            ->orderBy('level')
            ->orderBy('name')
            ->get()
            // On ajoute une colonne virtuelle pour afficher les places restantes
            ->map(function ($class) {
                $class->places_disponibles = $class->capacity - $class->students_count;
                return $class;
            });

        if ($classes->isEmpty()) {
            return response()->json([
                'message' => 'Aucune classe disponible pour les critères sélectionnés.',
                'classes' => [],
            ], 200);
        }

        return response()->json([
            'message'        => $classes->count() . ' classe(s) disponible(s) trouvée(s).',
            'total'          => $classes->count(),
            'classes'        => $classes,
        ], 200);
    }
}
