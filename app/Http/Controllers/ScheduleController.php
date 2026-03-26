<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;

class ScheduleController extends Controller
{
    // Sauvegarder plusieurs créneaux en même temps
    public function store(Request $request)
    {
        $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'schedules' => 'required|array',
            'schedules.*.day' => 'required|string',
            'schedules.*.subject' => 'required|string',
            'schedules.*.start' => 'required|date_format:H:i',
            'schedules.*.end' => 'required|date_format:H:i|after:schedules.*.start',
        ]);

        $schoolClassId = $request->school_class_id;

        // Supprimer les anciens créneaux
        Schedule::where('school_class_id', $schoolClassId)->delete();

        // Créer les nouveaux créneaux
        foreach ($request->schedules as $slot) {
            Schedule::create([
                'school_class_id' => $schoolClassId,
                'day' => $slot['day'],
                'subject' => $slot['subject'],
                'start' => $slot['start'],
                'end' => $slot['end'],
            ]);
        }

        return response()->json([
            'message' => 'Emploi du temps enregistré avec succès !'
        ]);
    }

    // Récupérer les créneaux pour une classe
    public function show($id)
    {
        $schedules = Schedule::where('school_class_id', $id)->get();
        return response()->json($schedules);
    }
}
