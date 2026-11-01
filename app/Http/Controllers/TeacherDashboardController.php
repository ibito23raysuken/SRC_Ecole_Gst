<?php

namespace App\Http\Controllers;

use App\Models\StudentNote;
use App\Services\TeacherAccessService;
use Illuminate\Http\Request;

class TeacherDashboardController extends Controller
{
    public function __invoke(Request $request, TeacherAccessService $access)
    {
        $teacher = $access->profile($request->user());
        $classes = $teacher->assignedClasses()->withCount('students')->get()->unique('id')->values();

        $unreadMessages = \App\Models\TeacherMessage::where('sender_id', '!=', $request->user()->id)
            ->whereNull('read_at')
            ->whereHas('conversation.participants', fn ($query) => $query->whereKey($request->user()->id))
            ->count();

        return response()->json([
            'teacher' => $teacher->makeHidden(['salary'])->load('user'),
            'classes' => $classes,
            'students_count' => $classes->sum('students_count'),
            'classes_count' => $classes->count(),
            'notes_count' => StudentNote::where('teacher_id', $teacher->id)->count(),
            'unread_messages' => $unreadMessages,
        ]);
    }
}
