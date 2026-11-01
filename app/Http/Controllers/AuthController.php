<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $fields = $request->validate([
            'firstName' => 'required|string|unique:users,firstName|max:255',
            'lastName' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'firstName' => $fields['firstName'],
            'lastName' => $fields['lastName'],
            'password' => Hash::make($fields['password']),
            'role' => 'user',
        ]);

        $token = $user->createToken('school-management');

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken,
        ], 201);
    }

    public function login(Request $request)
    {
        $fields = $request->validate([
            'firstName' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('firstName', $fields['firstName'])->first();
        $role = strtolower((string) ($user?->role ?? ''));

        if (!$user || !in_array($role, ['admin', 'teacher'], true) || !Hash::check($fields['password'], $user->password)) {
            return response()->json([
                'message' => 'Le prénom ou le mot de passe est incorrect.',
                'errors' => [
                    'firstName' => ['Le prénom ou le mot de passe est incorrect.'],
                ],
            ], 401);
        }

        $user->tokens()->delete();
        $user->setAttribute('role', $role);
        $token = $user->createToken('school-management');

        return response()->json([
            'user' => $user->load('teacher'),
            'token' => $token->plainTextToken,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return ['message' => 'Déconnexion réussie'];
    }
}
