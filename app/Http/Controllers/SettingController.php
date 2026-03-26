<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use App\Models\AcademicYear;

class SettingController extends Controller
{
    public function getSettings()
    {
        return Setting::first();
    }

    public function saveSettings(Request $request)
    {
        $request->validate([
            'school_name' => 'nullable|string|max:255',
            'school_email' => 'nullable|email|max:255',
            'school_phone' => 'nullable|string|max:50',
            'school_address' => 'nullable|string|max:255',
            'academic_year' => 'nullable|string|max:20', // exemple "2025-2026"
        ]);

        // 🔹 Sauvegarder les settings
        $settings = Setting::firstOrNew([]);
        $settings->fill($request->only([
            'school_name', 'school_email', 'school_phone', 'school_address', 'academic_year'
        ]));
        $settings->save();

        // 🔹 Créer ou mettre à jour l'année académique
        if ($request->academic_year) {
            $yearName = $request->academic_year;

            // Vérifie si l'année existe déjà
            $academicYear = AcademicYear::firstOrCreate(
                ['name' => $yearName],
                [
                    'start_date' => now(), // tu peux adapter selon ton besoin
                    'end_date' => now()->addYear(),
                    'is_active' => true
                ]
            );

            // Optionnel : désactive les autres années
            AcademicYear::where('id', '!=', $academicYear->id)
                ->update(['is_active' => false]);
        }

        return response()->json([
            'message' => 'Paramètres sauvegardés et année académique mise à jour !',
            'settings' => $settings
        ]);
    }
}
