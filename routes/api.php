<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SchoolClassController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\ScheduleController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route::get('/', function () {
//     return "API";
// });

Route::apiResource('students',StudentController::class)->middleware('auth:sanctum');
Route::apiResource('teachers', TeacherController::class)->middleware('auth:sanctum');
Route::apiResource('school-classes', SchoolClassController::class)->middleware('auth:sanctum');
Route::apiResource('subjects', SubjectController::class)->middleware('auth:sanctum');
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/settings', [SettingController::class, 'getSettings']);
    Route::post('/settings', [SettingController::class, 'saveSettings']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/schedules', [ScheduleController::class, 'store']);
    Route::get('/schedules/{id}', [ScheduleController::class, 'show']);
});
