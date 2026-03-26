<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SchoolClassController extends Controller
{
    /**
     * Afficher toutes les classes
     */
    public function index()
    {
        $classes = SchoolClass::all();
        return response()->json($classes, 200);
    }

    /**
     * Créer une nouvelle classe
     */
        public function store(Request $request)
        {
            // Validation
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:school_classes,name',
                'level' => 'nullable|string|max:50',
                'capacity' => 'nullable|integer|min:1|max:100',
                'academic_year_id' => 'nullable|exists:academic_years,id', // Vérifie si l'année existe
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'errors' => $validator->errors(),
                    'academic_year_id' => $request->academic_year_id
                ], 422);
            }

            // Création de la classe
            $class = SchoolClass::create([
                'name' => $request->name,
                'level' => $request->level,
                'capacity' => $request->capacity ?? 30,
                'academic_year_id' => $request->academic_year_id ?? null,
            ]);

            return response()->json([
                'message' => 'Classe créée avec succès',
                'class' => $class
            ], 201);
        }

    /**
     * Afficher une seule classe
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
            'name' => 'sometimes|string|max:255|unique:school_classes,name,' . $class->id,
            'level' => 'nullable|string|max:50',
            'capacity' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $class->update($request->only(['name', 'level', 'capacity']));

        return response()->json([
            'message' => 'Classe mise à jour avec succès',
            'class' => $class
        ], 200);
    }

    /**
     * Supprimer une classe
     */
    public function destroy($id)
    {
        $class = SchoolClass::findOrFail($id);
        $class->delete();

        return response()->json([
            'message' => 'Classe supprimée avec succès'
        ], 200);
    }
}
