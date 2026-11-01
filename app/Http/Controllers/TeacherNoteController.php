<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentNote;
use App\Services\TeacherAccessService;
use Illuminate\Http\Request;

class TeacherNoteController extends Controller
{
    public function index(Request $request, TeacherAccessService $access)
    {
        $data = $request->validate([
            'class_id' => 'required|integer|exists:school_classes,id',
            'subject_id' => 'required|integer|exists:subjects,id',
            'period' => 'required|string|max:50',
            'academic_year_id' => 'nullable|integer|exists:academic_years,id',
        ]);
        $teacher = $access->profile($request->user());
        $schoolClass = \App\Models\SchoolClass::findOrFail($data['class_id']);
        $academicYearId = $data['academic_year_id'] ?? $schoolClass->academic_year_id;

        abort_unless($access->canAccessSubject($teacher, $data['class_id'], $data['subject_id']), 403);

        $students = Student::where('school_class_id', $data['class_id'])->orderBy('last_name')->orderBy('first_name')->get();
        $notes = StudentNote::where('teacher_id', $teacher->id)
            ->where('school_class_id', $data['class_id'])
            ->where('subject_id', $data['subject_id'])
            ->where('period', $data['period'])
            ->when($academicYearId, fn ($query) => $query->where('academic_year_id', $academicYearId))
            ->get()->keyBy('student_id');
        $averages = StudentNote::where('teacher_id', $teacher->id)
            ->where('school_class_id', $data['class_id'])
            ->where('subject_id', $data['subject_id'])
            ->when($academicYearId, fn ($query) => $query->where('academic_year_id', $academicYearId))
            ->get()->groupBy('student_id')
            ->map(fn ($studentNotes) => round((float) $studentNotes->avg('score'), 2));

        return response()->json($students->map(fn ($student) => [
            'student' => $student,
            'note' => $notes->get($student->id),
            'average' => $averages->get($student->id),
        ]));
    }

    public function store(Request $request, TeacherAccessService $access)
    {
        $data = $request->validate([
            'student_id' => 'required|integer|exists:students,id',
            'class_id' => 'required|integer|exists:school_classes,id',
            'subject_id' => 'required|integer|exists:subjects,id',
            'period' => 'required|string|max:50',
            'academic_year_id' => 'nullable|integer|exists:academic_years,id',
            'score' => 'required|numeric|min:0|max:20',
            'appreciation' => 'nullable|string|max:5000',
        ]);
        $teacher = $access->profile($request->user());
        $student = Student::findOrFail($data['student_id']);
        $schoolClass = \App\Models\SchoolClass::findOrFail($data['class_id']);
        $academicYearId = $data['academic_year_id'] ?? $schoolClass->academic_year_id;

        abort_unless($student->school_class_id === (int) $data['class_id'], 403);
        abort_unless($access->canAccessSubject($teacher, $data['class_id'], $data['subject_id']), 403);

        $note = StudentNote::updateOrCreate(
            ['student_id' => $student->id, 'subject_id' => $data['subject_id'], 'period' => $data['period'], 'academic_year_id' => $academicYearId],
            [
                'teacher_id' => $teacher->id,
                'school_class_id' => $data['class_id'],
                'academic_year_id' => $academicYearId,
                'score' => $data['score'],
                'max_score' => 20,
                'appreciation' => $data['appreciation'] ?? null,
            ]
        );

        return response()->json($note->load(['student', 'subject']), 201);
    }
}
