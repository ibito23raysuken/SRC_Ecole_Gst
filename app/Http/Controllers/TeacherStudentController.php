<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Services\TeacherAccessService;
use Illuminate\Http\Request;

class TeacherStudentController extends Controller
{
    public function index(Request $request, TeacherAccessService $access)
    {
        $teacher = $access->profile($request->user());
        $classIds = $teacher->assignments()->pluck('school_class_id')->unique();

        $students = Student::with('schoolClass')
            ->whereIn('school_class_id', $classIds)
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = $request->string('search');
                $query->where(function ($query) use ($term) {
                    $query->where('first_name', 'ilike', "%{$term}%")
                        ->orWhere('last_name', 'ilike', "%{$term}%");
                });
            })
            ->when($request->filled('class_id'), fn ($query) => $query->where('school_class_id', $request->integer('class_id')))
            ->paginate(25);

        return response()->json($students);
    }

    public function show(Request $request, int $studentId, TeacherAccessService $access)
    {
        $teacher = $access->profile($request->user());
        $student = Student::with(['schoolClass', 'guardians'])->findOrFail($studentId);

        abort_unless($student->school_class_id && $access->canAccessClass($teacher, $student->school_class_id), 403);

        return response()->json($student);
    }
}
