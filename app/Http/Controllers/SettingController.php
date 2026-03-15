<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Setting;

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
            'academic_year' => 'nullable|string|max:20',
        ]);

        $settings = Setting::firstOrNew([]);
        $settings->fill($request->only([
            'school_name', 'school_email', 'school_phone', 'school_address', 'academic_year'
        ]));
        $settings->save();

        return response()->json(['message' => 'Paramètres sauvegardés !', 'settings' => $settings]);
    }
}
