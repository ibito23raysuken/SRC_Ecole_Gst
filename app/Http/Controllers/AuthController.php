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
            'first_name' => 'required|string|unique:users,first_name|max:255',
            'last_name' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'first_name' => $fields['first_name'],
            'last_name' => $fields['last_name'],
            'password' => Hash::make($fields['password']),
        ]);
        $user->role = 'user';
        $user->save();

        $token = $user->createToken('school-management');

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken,
        ], 201);
    }

    public function login(Request $request)
    {
        $fields = $request->validate([
            'first_name' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('first_name', $fields['first_name'])->first();
        $role = strtolower((string) ($user?->role ?? ''));

        if (!$user || !in_array($role, ['admin', 'teacher'], true) || !Hash::check($fields['password'], $user->password)) {
            return response()->json([
                'message' => 'Le prénom ou le mot de passe est incorrect.',
                'errors' => [
                    'first_name' => ['Le prénom ou le mot de passe est incorrect.'],
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
