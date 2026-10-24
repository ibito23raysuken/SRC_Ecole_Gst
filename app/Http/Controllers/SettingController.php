<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use App\Models\AcademicYear;

class SettingController extends Controller
{
    /**
     * Récupérer les paramètres de l'école
     */
    public function getSettings()
    {
        $settings = Setting::first();

        return response()->json($settings);
    }

    /**
     * Enregistrer / mettre à jour les paramètres
     */
    public function saveSettings(Request $request)
    {
        $request->validate([
            'school_name' => 'nullable|string|max:255',
            'school_email' => 'nullable|email|max:255',
            'school_phone' => 'nullable|string|max:50',
            'school_address' => 'nullable|string|max:255',

            'academic_year' => 'nullable|string|max:20',

            // 💰 Paramètres financiers
            'registration_fee' => 'nullable|numeric|min:0',
            'monthly_fee' => 'nullable|numeric|min:0',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Sauvegarder les paramètres
        |--------------------------------------------------------------------------
        */

        $settings = Setting::firstOrNew([]);

        $settings->fill([
            'school_name' => $request->school_name,
            'school_email' => $request->school_email,
            'school_phone' => $request->school_phone,
            'school_address' => $request->school_address,
            'academic_year' => $request->academic_year,

            // 💰 Frais
            'registration_fee' => $request->registration_fee ?? 0,
            'monthly_fee' => $request->monthly_fee ?? 0,
        ]);

        $settings->save();

        /*
        |--------------------------------------------------------------------------
        | Gestion de l'année académique
        |--------------------------------------------------------------------------
        */

        if ($request->filled('academic_year')) {

            $yearName = $request->academic_year;

            // Créer l'année si elle n'existe pas
            // ou récupérer celle qui existe déjà
            $academicYear = AcademicYear::firstOrCreate(
                ['name' => $yearName],
                [
                    'start_date' => now(),
                    'end_date' => now()->addYear(),
                    'is_active' => true,
                ]
            );

            // Désactiver les autres années
            AcademicYear::where('id', '!=', $academicYear->id)
                ->update([
                    'is_active' => false
                ]);

            // S'assurer que l'année sélectionnée est active
            $academicYear->update([
                'is_active' => true
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Réponse
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'message' => 'Paramètres sauvegardés avec succès !',
            'settings' => $settings,
        ]);
    }
}
