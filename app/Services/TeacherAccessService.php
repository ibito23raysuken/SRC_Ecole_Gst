<?php

namespace App\Services;

use App\Models\Teacher;
use App\Models\User;

class TeacherAccessService
{
    public function profile(User $user): Teacher
    {
        return Teacher::where('user_id', $user->id)->firstOrFail();
    }

    public function canAccessClass(Teacher $teacher, int $classId): bool
    {
        return $teacher->assignments()->where('school_class_id', $classId)->exists();
    }

    public function canAccessSubject(Teacher $teacher, int $classId, int $subjectId): bool
    {
        return $teacher->assignments()
            ->where('school_class_id', $classId)
            ->where('subject_id', $subjectId)
            ->exists();
    }
}
