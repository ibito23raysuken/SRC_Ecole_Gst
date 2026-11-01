<?php

namespace App\Http\Controllers;

use App\Services\TeacherAccessService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TeacherProfileController extends Controller
{
    public function show(Request $request, TeacherAccessService $access)
    {
        $teacher = $access->profile($request->user());

        return response()->json($teacher->makeHidden(['salary'])->load(['user', 'assignedClasses']));
    }

    public function update(Request $request, TeacherAccessService $access)
    {
        $data = $request->validate([
            'lastName' => 'sometimes|required|string|max:191',
            'firstName' => 'sometimes|required|string|max:191',
            'phone' => 'sometimes|nullable|string|max:30',
            'password' => 'sometimes|nullable|string|min:8|confirmed',
        ]);
        $teacher = $access->profile($request->user());

        $userData = array_filter([
            'firstName' => $data['firstName'] ?? null,
            'lastName' => $data['lastName'] ?? null,
            'password' => isset($data['password']) ? Hash::make($data['password']) : null,
        ], fn ($value) => $value !== null);

        if ($userData) {
            $teacher->user->update($userData);
        }
        if (array_key_exists('phone', $data)) {
            $teacher->update(['phone' => $data['phone']]);
        }

        return response()->json($teacher->fresh()->makeHidden(['salary'])->load(['user', 'assignedClasses']));
    }
}
