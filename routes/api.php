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
use App\Http\Controllers\TeacherAssignmentController;
use App\Http\Controllers\TeacherClassController;
use App\Http\Controllers\TeacherDashboardController;
use App\Http\Controllers\TeacherMessageController;
use App\Http\Controllers\TeacherNoteController;
use App\Http\Controllers\TeacherProfileController;
use App\Http\Controllers\TeacherStudentController;
use App\Models\AcademicYear;

/*
|--------------------------------------------------------------------------
| User connecté
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    $user = $request->user();
    $user->setAttribute('role', strtolower((string) $user->role));

    return $user;
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

Route::middleware(['auth:sanctum', 'role:teacher'])->get('/teacher/me', function (Request $request) {
    return $request->user()->load('teacher')->teacher?->makeHidden(['salary']);
});

Route::middleware(['auth:sanctum', 'role:teacher'])->prefix('teacher')->group(function () {
    Route::get('/dashboard', TeacherDashboardController::class);
    Route::get('/classes', [TeacherClassController::class, 'index']);
    Route::get('/classes/{classId}', [TeacherClassController::class, 'show']);
    Route::get('/students', [TeacherStudentController::class, 'index']);
    Route::get('/students/{studentId}', [TeacherStudentController::class, 'show']);
    Route::get('/notes', [TeacherNoteController::class, 'index']);
    Route::post('/notes', [TeacherNoteController::class, 'store']);
    Route::get('/messages', [TeacherMessageController::class, 'index']);
    Route::get('/message-recipients', [TeacherMessageController::class, 'contacts']);
    Route::get('/messages/unread-count', [TeacherMessageController::class, 'unreadCount']);
    Route::post('/messages', [TeacherMessageController::class, 'store']);
    Route::get('/messages/{conversation}', [TeacherMessageController::class, 'show']);
    Route::post('/messages/{conversation}/reply', [TeacherMessageController::class, 'reply']);
    Route::get('/messages/{message}/attachments/{attachment}', [TeacherMessageController::class, 'downloadAttachment']);
    Route::get('/profile', [TeacherProfileController::class, 'show']);
    Route::patch('/profile', [TeacherProfileController::class, 'update']);
});


/*
|--------------------------------------------------------------------------
| Élèves
|--------------------------------------------------------------------------
*/

Route::apiResource('students', StudentController::class)
    ->middleware(['auth:sanctum', 'role:admin']);

Route::get('/academic-years', function () {
    return AcademicYear::query()
        ->orderByDesc('start_date')
        ->orderByDesc('name')
        ->get(['id', 'name', 'start_date', 'end_date', 'is_active']);
})->middleware(['auth:sanctum', 'role:admin']);


/*
|--------------------------------------------------------------------------
| Enseignants
|--------------------------------------------------------------------------
*/

Route::apiResource('teachers', TeacherController::class)
    ->middleware(['auth:sanctum', 'role:admin']);


/*
|--------------------------------------------------------------------------
| Classes
|--------------------------------------------------------------------------
*/

// IMPORTANT : placer cette route avant apiResource
Route::get('/school-classes/free', [
    SchoolClassController::class,
    'getFreeClasses'
])->middleware(['auth:sanctum', 'role:admin']);

// Routes CRUD des classes
Route::apiResource('school-classes', SchoolClassController::class)
    ->middleware(['auth:sanctum', 'role:admin']);

/*
|--------------------------------------------------------------------------
| Matières
|--------------------------------------------------------------------------
*/

Route::apiResource('subjects', SubjectController::class)
    ->middleware(['auth:sanctum', 'role:admin']);


/*
|--------------------------------------------------------------------------
| Paramètres de l'école
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/messages', [TeacherMessageController::class, 'index']);
    Route::get('/admin/message-recipients', [TeacherMessageController::class, 'contacts']);
    Route::get('/admin/messages/unread-count', [TeacherMessageController::class, 'unreadCount']);
    Route::post('/admin/messages', [TeacherMessageController::class, 'store']);
    Route::get('/admin/messages/{conversation}', [TeacherMessageController::class, 'show']);
    Route::post('/admin/messages/{conversation}/reply', [TeacherMessageController::class, 'reply']);
    Route::get('/admin/messages/{message}/attachments/{attachment}', [TeacherMessageController::class, 'downloadAttachment']);

    Route::post('/teachers/{teacher}/assignments', [TeacherAssignmentController::class, 'store']);
    Route::delete('/teacher-assignments/{assignment}', [TeacherAssignmentController::class, 'destroy']);


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

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    Route::post('/schedules', [ScheduleController::class, 'store']);

    Route::get('/schedules/{id}', [ScheduleController::class, 'show']);
});
