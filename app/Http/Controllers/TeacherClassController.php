<?php

namespace App\Http\Controllers;

use App\Services\TeacherAccessService;
use Illuminate\Http\Request;

class TeacherClassController extends Controller
{
    public function index(Request $request, TeacherAccessService $access)
    {
        $teacher = $access->profile($request->user());

        $classes = $teacher->assignments()
            ->with(['schoolClass' => fn ($query) => $query->withCount('students')->with('academicYear'), 'subject'])
            ->get()
            ->groupBy('school_class_id')
            ->map(function ($assignments) {
                $class = $assignments->first()->schoolClass;
                $class->setRelation('subjects', $assignments->pluck('subject')->filter()->unique('id')->values());
                return $class;
            })->values();

        return response()->json($classes);
    }

    public function show(Request $request, int $classId, TeacherAccessService $access)
    {
        $teacher = $access->profile($request->user());

        abort_unless($access->canAccessClass($teacher, $classId), 403);

        return response()->json(
            $teacher->assignedClasses()->withCount('students')->with(['academicYear', 'students'])->findOrFail($classId)
        );
    }
}
