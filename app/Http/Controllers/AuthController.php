<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
            $fields=$request->validate([
                'firstName' => 'required|unique:users|max:255',
                'lastName' => 'required|max:255',
                'password' => 'required|confirmed',
            ]);
        $user= User::create($fields);
        $token = $user->createToken($request->firstName);
        return ["user" =>$user,"token" => $token->plainTextToken];
    }

    public function login(Request $request)
    {
        $fields=$request->validate([
                'firstName' => 'required|exists:users',
                'password' => 'required',
        ]);
        $user=User::where('firstName', $fields['firstName'])->first();
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return [
                'message' => 'Identifiants incorrects'
            ];
        }
        $token = $user->createToken($user->firstName);
        return ["user" =>$user,"token" => $token->plainTextToken];
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return ['message' => 'Déconnexion réussie'];
    }
}
