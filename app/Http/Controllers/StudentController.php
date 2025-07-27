<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show'])
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Student::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'birthDate' => 'required|date|before:today',
            'gender' => 'required|in:male,female',

            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'postalCode' => 'nullable|string|max:10',
            'phone' => 'required|string|max:20',

            'academicYear' => 'nullable|integer|min:2020|max:2030',
            'gradeLevel' => 'nullable|in:PS,MS,GS,CP,CE1,CE2,CM1,CM2,6e,5e,4e,3e,2nde,1ère,Term',

            'payment.tuitionPayment' => 'required|in:half,full,not_paid',
            'payment.registrationMonths' => 'nullable|array',
            'payment.registrationMonths.*' => 'string',

            'parents' => 'nullable|array',
            'parents.*.name' => 'sometimes|nullable|string|max:255',
            'parents.*.phone' => 'sometimes|nullable|string|max:20',
            'parents.*.relationship' => 'sometimes|nullable|in:mother,father,guardian',

            'dossier' => 'nullable|array',
            'dossier.birthCertificate' => 'sometimes|boolean',
            'dossier.medicalCertificate' => 'sometimes|boolean',
            'dossier.reportCard' => 'sometimes|boolean',
            'dossier.photo' => 'sometimes|boolean',
            'dossier.idCard' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // Création de l'étudiant
        $student = Student::create([
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'birth_date' => $request->birthDate,
            'birth_place' => $request->birthPlace,
            'gender' => $request->gender,
            'nationality' => $request->nationality,
            'address' => $request->address,
            'city' => $request->city,
            'postal_code' => $request->postalCode,
            'phone' => $request->phone,
            'previous_school' => $request->previousSchool,
            'previous_class' => $request->previousClass,
            'academic_year' => $request->academicYear,
            'grade_level' => $request->gradeLevel,
            'special_needs' => $request->specialNeeds,

            // Documents
            'birth_certificate' => $request->dossier['birthCertificate'] ?? false,
            'medical_certificate' => $request->dossier['medicalCertificate'] ?? false,
            'report_card' => $request->dossier['reportCard'] ?? false,
            'photo' => $request->dossier['photo'] ?? false,
            'id_card' => $request->dossier['idCard'] ?? false,

            // Paiement
            'tuition_payment' => $request->payment['tuitionPayment'],
            'registration_months' => $request->payment['registrationMonths'] ?? [],
        ]);

        // Création des parents
  if ($request->has('parents') && is_array($request->parents)) {
    foreach ($request->parents as $parentData) {
        Guardian::create([
            'student_id' => $student->id,
            'name' => $parentData['name'] ?? null,
            'relationship' => $parentData['relationship'] ?? null,
            'phone' => $parentData['phone'] ?? null,
            'email' => $parentData['email'] ?? null,
            'profession' => $parentData['profession'] ?? null,
        ]);
    }
}


        return response()->json([
            'message' => 'Student created successfully',
            'student' => $student
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        return $student;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        Gate::authorize('modify', $student);

        $fields = $request->validate([
            'last_name' => 'required|max:255',
            'first_name' => 'required|max:255'
        ]);

        $student->update($fields);
        return $student;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        Gate::authorize('modify', $student);
        $student->delete();
        return ['message' => "La suppression de l'étudiant a été effectuée."];
    }
}
