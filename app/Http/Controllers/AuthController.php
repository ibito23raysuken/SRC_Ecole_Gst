<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

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
        return ["user" =>$user,"token" => $token];
    }

    public function login(Request $request)
    {
        return 'login';
    }

    public function logout(Request $request)
    {
        return 'login';
    }
}
