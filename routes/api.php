<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SchoolClassController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\ScheduleController;

/*
|--------------------------------------------------------------------------
| User connecté
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


/*
|--------------------------------------------------------------------------
| Authentification
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');


/*
|--------------------------------------------------------------------------
| Élèves
|--------------------------------------------------------------------------
*/

Route::apiResource('students', StudentController::class)
    ->middleware('auth:sanctum');


/*
|--------------------------------------------------------------------------
| Enseignants
|--------------------------------------------------------------------------
*/

Route::apiResource('teachers', TeacherController::class)
    ->middleware('auth:sanctum');


/*
|--------------------------------------------------------------------------
| Classes
|--------------------------------------------------------------------------
*/

// IMPORTANT : placer cette route avant apiResource
Route::get('/school-classes/free', [
    SchoolClassController::class,
    'getFreeClasses'
])->middleware('auth:sanctum');

// Routes CRUD des classes
Route::apiResource('school-classes', SchoolClassController::class)
    ->middleware('auth:sanctum');

/*
|--------------------------------------------------------------------------
| Matières
|--------------------------------------------------------------------------
*/

Route::apiResource('subjects', SubjectController::class)
    ->middleware('auth:sanctum');


/*
|--------------------------------------------------------------------------
| Paramètres de l'école
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Récupérer les paramètres
    Route::get('/settings', [SettingController::class, 'getSettings']);

    // Enregistrer / modifier les paramètres
    Route::post('/settings', [SettingController::class, 'saveSettings']);
});


/*
|--------------------------------------------------------------------------
| Emploi du temps
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/schedules', [ScheduleController::class, 'store']);

    Route::get('/schedules/{id}', [ScheduleController::class, 'show']);
});
