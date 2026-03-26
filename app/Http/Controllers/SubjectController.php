<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;

class SubjectController extends Controller
{
    // 🔹 Liste toutes les matières avec classe et année académique
    public function index()
    {
        $subjects = Subject::with(['classe', 'classe.academicYear'])->get();
        return response()->json($subjects);
    }

    // 🔹 Créer une nouvelle matière
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'coefficient' => 'required|numeric|min:1|max:10',
            'class_id' => 'required|exists:school_classes,id',
        ]);

        $subject = Subject::create($validated);

        // Charger les relations pour le retour
        $subject->load(['classe', 'classe.academicYear']);

        return response()->json($subject, 201);
    }

    // 🔹 Afficher une matière spécifique
    public function show($id)
    {
        $subject = Subject::with(['classe', 'classe.academicYear'])->findOrFail($id);
        return response()->json($subject);
    }

    // 🔹 Mettre à jour une matière
    public function update(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'coefficient' => 'sometimes|required|numeric|min:1|max:10',
            'class_id' => 'sometimes|required|exists:school_classes,id',
        ]);

        $subject->update($validated);

        $subject->load(['classe', 'classe.academicYear']);

        return response()->json($subject);
    }

    // 🔹 Supprimer une matière
    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return response()->json([
            'message' => 'Matière supprimée avec succès'
        ]);
    }
}
