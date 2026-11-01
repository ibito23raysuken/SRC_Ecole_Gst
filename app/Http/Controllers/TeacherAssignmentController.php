<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\TeacherClassSubject;
use Illuminate\Http\Request;

class TeacherAssignmentController extends Controller
{
    public function store(Request $request, Teacher $teacher)
    {
        $data = $request->validate([
            'school_class_id' => 'required|integer|exists:school_classes,id',
            'subject_id' => 'nullable|integer|exists:subjects,id',
            'academic_year_id' => 'nullable|integer|exists:academic_years,id',
        ]);

        if (!empty($data['subject_id'])) {
            abort_unless(
                \App\Models\Subject::whereKey($data['subject_id'])->where('class_id', $data['school_class_id'])->exists(),
                422,
                'La matière doit appartenir à la classe sélectionnée.'
            );
        }

        $assignment = TeacherClassSubject::firstOrCreate([
            'teacher_id' => $teacher->id,
            ...$data,
        ]);

        return response()->json($assignment->load(['schoolClass', 'subject', 'academicYear']), 201);
    }

    public function destroy(TeacherClassSubject $assignment)
    {
        $assignment->delete();

        return response()->json(['message' => 'Affectation supprimée.']);
    }
}
