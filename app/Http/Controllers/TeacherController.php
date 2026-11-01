<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class TeacherController extends Controller
{
    /**
     * Liste des enseignants
     */
    public function index()
    {
        $teachers = Teacher::with('user')->get();

        return response()->json($teachers);
    }

    /**
     * Créer un enseignant
     */

/**
 * Créer un enseignant et son compte utilisateur
 */
public function store(Request $request)
{
    $validated = $request->validate([
        'first_name' => [
            'required',
            'string',
            'max:191',
            'unique:users,firstName',
        ],

        'last_name' => [
            'required',
            'string',
            'max:191',
        ],

        'password' => [
            'required',
            'string',
            'min:8',
            'confirmed',
        ],

        'phone' => 'nullable|string|max:30',
        'country_code' => 'nullable|string|max:10',
        'subject' => 'nullable|string|max:255',
        'birth_date' => 'nullable|date|before:today',
        'salary' => 'nullable|numeric|min:0',
        'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $photo = null;

    try {
        $teacher = DB::transaction(function () use (
            $request,
            $validated,
            &$photo
        ) {
            // 1. Créer le compte utilisateur
            $user = User::create([
                'firstName' => $validated['first_name'],
                'lastName' => $validated['last_name'],
                'password' => Hash::make($validated['password']),
                'role' => 'teacher',
            ]);

            // 2. Enregistrer la photo
            if ($request->hasFile('photo')) {
                $photo = $request->file('photo')
                    ->store('teachers', 'public');
            }

            // 3. Créer le profil enseignant associé
            return Teacher::create([
                'user_id' => $user->id,
                'first_name' => $user->firstName,
                'last_name' => $user->lastName,
                'phone' => $validated['phone'] ?? null,
                'subject' => $validated['subject'] ?? null,
                'birth_date' => $validated['birth_date'] ?? null,
                'salary' => $validated['salary'] ?? null,
                'photo' => $photo,
            ])->load('user');
        });

        return response()->json([
            'message' => 'Enseignant créé avec succès.',
            'teacher' => $teacher,
        ], 201);

    } catch (\Throwable $e) {
        if ($photo) {
            Storage::disk('public')->delete($photo);
        }

        report($e);

        return response()->json([
            'message' => 'Erreur lors de la création de l’enseignant.',
            'error' => config('app.debug')
                ? $e->getMessage()
                : 'Une erreur interne est survenue.',
        ], 500);
    }
}


    /**
     * Afficher un enseignant
     */
    public function show(string $id)
    {
        $teacher = Teacher::with('user')->findOrFail($id);

        return response()->json($teacher);
    }

    /**
     * Modifier un enseignant
     */
    public function update(Request $request, string $id)
    {
        $teacher = Teacher::with('user')->findOrFail($id);

        $request->validate([
            'first_name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'firstName')
                    ->ignore($teacher->user_id),
            ],

            'last_name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'password' => [
                'nullable',
                'string',
                'min:8',
                'confirmed',
            ],

            'phone' => 'nullable|string|max:30',
            'country_code' => 'nullable|string|max:10',

            'subject' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'salary' => 'nullable|numeric|min:0',

            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | 1. Modifier User
            |--------------------------------------------------------------------------
            */

            $userData = [];

            if ($request->filled('first_name')) {
                $userData['firstName'] = $request->first_name;
            }

            if ($request->filled('last_name')) {
                $userData['lastName'] = $request->last_name;
            }

            if ($request->filled('password')) {
                $userData['password'] = Hash::make(
                    $request->password
                );
            }

            if (!empty($userData)) {
                $teacher->user->update($userData);
            }

            /*
            |--------------------------------------------------------------------------
            | 2. Modifier Teacher
            |--------------------------------------------------------------------------
            */

            $teacherData = [];

            if ($request->has('phone')) {
                $teacherData['phone'] = $request->phone;
            }

            if ($request->has('subject')) {
                $teacherData['subject'] = $request->subject;
            }

            if ($request->has('birth_date')) {
                $teacherData['birth_date'] = $request->birth_date;
            }

            if ($request->has('salary')) {
                $teacherData['salary'] = $request->salary;
            }

            /*
            |--------------------------------------------------------------------------
            | 3. Nouvelle photo
            |--------------------------------------------------------------------------
            */

            if ($request->hasFile('photo')) {

                if ($teacher->photo) {
                    Storage::disk('public')
                        ->delete($teacher->photo);
                }

                $teacherData['photo'] = $request->file('photo')
                    ->store('teachers', 'public');
            }

            if (!empty($teacherData)) {
                $teacher->update($teacherData);
            }

            DB::commit();

            return response()->json([
                'message' => 'Enseignant modifié avec succès.',

                'teacher' => $teacher->fresh()->load('user'),
            ]);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Erreur lors de la modification.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Supprimer un enseignant
     */
    public function destroy(string $id)
    {
        $teacher = Teacher::with('user')->findOrFail($id);

        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | Supprimer la photo
            |--------------------------------------------------------------------------
            */

            if ($teacher->photo) {
                Storage::disk('public')
                    ->delete($teacher->photo);
            }

            /*
            |--------------------------------------------------------------------------
            | Récupérer le User
            |--------------------------------------------------------------------------
            */

            $user = $teacher->user;

            /*
            |--------------------------------------------------------------------------
            | Supprimer Teacher
            |--------------------------------------------------------------------------
            */

            $teacher->delete();

            /*
            |--------------------------------------------------------------------------
            | Supprimer User
            |--------------------------------------------------------------------------
            */

            if ($user) {
                $user->delete();
            }

            DB::commit();

            return response()->json([
                'message' => 'Enseignant supprimé avec succès.',
            ]);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Erreur lors de la suppression.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

