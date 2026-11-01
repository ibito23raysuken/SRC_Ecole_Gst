<?php

namespace App\Http\Controllers;

use App\Models\StudentNote;
use App\Models\TeacherConversation;
use App\Services\TeacherAccessService;
use Illuminate\Http\Request;

class TeacherDashboardController extends Controller
{
    public function __invoke(Request $request, TeacherAccessService $access)
    {
        $teacher = $access->profile($request->user());
        $classes = $teacher->assignedClasses()->withCount('students')->get()->unique('id')->values();

        $unreadMessages = TeacherConversation::whereHas('participants', function ($query) use ($request) {
            $query->where('users.id', $request->user()->id);
        })->whereHas('messages', function ($query) use ($request) {
            $query->where('sender_id', '!=', $request->user()->id)->whereNull('read_at');
        })->count();

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
