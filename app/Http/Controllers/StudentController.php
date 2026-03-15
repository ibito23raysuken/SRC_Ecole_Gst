<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use SebastianBergmann\Environment\Console;

class StudentController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['index'])
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(){
         return Student::with('guardians')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request){

            // Si le front envoie des JSON stringifiés, on les décode avant validation
            if ($request->has('parents') && is_string($request->parents)) {
                $request->merge(['parents' => json_decode($request->parents, true)]);
            }

            if ($request->has('payment') && is_string($request->payment)) {
                $request->merge(['payment' => json_decode($request->payment, true)]);
            }

            if ($request->has('dossier') && is_string($request->dossier)) {
                $request->merge(['dossier' => json_decode($request->dossier, true)]);
            }

            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'birth_date' => 'required|date|before:today',
                'gender' => 'required|in:male,female',

                'student_image'=>'image|nullable|max:1999',

                'address' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:255',
                'postal_code' => 'nullable|string|max:10',
                'phone' => 'required|string|max:20',

                'academic_year' => 'nullable|integer|min:2020|max:2030',
                'grade_level' => 'nullable|in:PS,MS,GS,CP,CE1,CE2,CM1,CM2,6e,5e,4e,3e,2nde,1ère,Term',

                'registration_status' => 'required|in:not_paid,half,full',
                'paid_months' => 'array',
                'paid_months.*' => 'integer|min:1|max:12',
            ]);

        /////////////////////////
        // Vérifier si un étudiant avec le même prénom et nom existe déjà
            $existingStudent = Student::where('first_name', $request->first_name)
                                    ->where('last_name', $request->last_name)
                                    ->first();

            if ($existingStudent) {
                return response()->json([
                    'message' => 'Un étudiant avec ce nom et prénom existe déjà.'
                ], 409); // 409 = conflit
            }
        // Gestion de l’image
        if ($request->hasFile('profile_photo')) {
            $fileNameWithExt = $request->file('profile_photo')->getClientOriginalName();
            $fileName = pathinfo($fileNameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('profile_photo')->getClientOriginalExtension();
            $fileNameToStore = $fileName.'_'.time().'.'.$extension;
            $path = $request->file('profile_photo')->storeAs('profile_photo', $fileNameToStore);
        } else {
            $path = 'profile_photo/noimage.png';
        }

        // Vérification des règles
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ,'data'=>$request->request], 422);
        }

        // Création de l'étudiant
                $student = Student::create([
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'birth_date' => $request->birth_date,
                    'birth_place' => $request->birth_place,
                    'gender' => $request->gender,
                    'nationality' => $request->nationality,
                    'address' => $request->address,
                    'city' => $request->city,
                    'postal_code' => $request->postal_code,
                    'phone' => $request->phone,
                    'previous_school' => $request->previous_school,
                    'previous_class' => $request->previous_class,
                    'academic_year' => $request->academic_year,
                    'grade_level' => $request->grade_level,
                    'special_needs' => $request->special_needs,

                    // Ajout du chemin de la photo
                    'student_image' => $path,

                    // Documents
                    'birth_certificate' => $request->boolean('birth_certificate'),
                    'medical_certificate' => $request->boolean('medical_certificate'),
                    'report_card' => $request->boolean('report_card'),
                    'id_card' => $request->boolean('id_card'),


                    // Paiement
                    'tuition_payment' => $request->registration_status ,
                    'registration_months' => $request->paid_months ?? [],
                ]);
                                    // Parents
                    if ($request->has('parents') && is_array($request->parents)) {
                        foreach ($request->parents as $parentData) {
                            if (!empty($parentData['name']) && !empty($parentData['phone'])) {
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
                    }

                        return response()->json([
                            'message' => 'Student created successfully',
                            'student' => $student
                        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student){
        $student = Student::with('guardians')->findOrFail($student->id);
        return $student;
    }

    /**
     * Update the specified resource in storage.
     */
public function update(Request $request, Student $student){
    Gate::authorize('modify', $student);

    // 1. Décodage JSON si nécessaire
    if ($request->has('parents') && is_string($request->parents)) {
        $request->merge(['parents' => json_decode($request->parents, true)]);
    }
    if ($request->has('payment') && is_string($request->payment)) {
        $request->merge(['payment' => json_decode($request->payment, true)]);
    }
    if ($request->has('dossier') && is_string($request->dossier)) {
        $request->merge(['dossier' => json_decode($request->dossier, true)]);
    }

    // 2. Validation
    $validator = Validator::make($request->all(), [
        'first_name' => 'sometimes|string|max:255',
        'last_name' => 'sometimes|string|max:255',
        'birth_date' => 'sometimes|date|before:today',
        'gender' => 'sometimes|in:male,female',
        'address' => 'nullable|string|max:255',
        'city' => 'nullable|string|max:255',
        'postalCode' => 'nullable|string|max:10',
        'phone' => 'sometimes|string|max:20',
        'academicYear' => 'nullable|integer|min:2020|max:2030',
        'gradeLevel' => 'nullable|in:PS,MS,GS,CP,CE1,CE2,CM1,CM2,6e,5e,4e,3e,2nde,1ère,Term',
        'payment' => 'sometimes|array',
        'payment.tuitionPayment' => 'sometimes|required_with:payment|in:half,full,not_paid',
        'payment.registrationMonths' => 'sometimes|array',
        'payment.registrationMonths.*' => 'string',
        'parents' => 'sometimes|array',
        'parents.*.name' => 'sometimes|required_with:parents|string|max:255',
        'parents.*.phone' => 'sometimes|required_with:parents|string|max:20',
        'parents.*.relationship' => 'sometimes|required_with:parents|in:mother,father,guardian',
        'dossier' => 'sometimes|array',
        'dossier.birthCertificate' => 'sometimes|required_with:dossier|boolean',
        'dossier.medicalCertificate' => 'sometimes|required_with:dossier|boolean',
        'dossier.reportCard' => 'sometimes|required_with:dossier|boolean',
        'dossier.photo' => 'sometimes|required_with:dossier|boolean',
        'dossier.idCard' => 'sometimes|required_with:dossier|boolean',
        'student_image' => 'nullable|image|max:1999',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // 3. Vérification conflit nom/prénom
    $conflict = Student::where('first_name', $request->input('first_name'))
        ->where('last_name', $request->input('last_name'))
        ->where('id', '!=', $student->id)
        ->first();

    if ($conflict) {
        return response()->json(['message' => 'Un étudiant avec ce nom et prénom existe déjà.'], 409);
    }

    // 4. Initialisation des sections modifiées
    $modifiedSections = [
        'personal_info' => [],
        'dossier' => [],
        'payment' => [],
        'parents' => false,
        'student_image' => false
    ];

    // 5. Gestion de l’image
    if ($request->hasFile('student_image')) {
        $fileNameWithExt = $request->file('student_image')->getClientOriginalName();
        $fileName = pathinfo($fileNameWithExt, PATHINFO_FILENAME);
        $extension = $request->file('student_image')->getClientOriginalExtension();
        $fileNameToStore = $fileName . '_' . time() . '.' . $extension;

        $path = $request->file('student_image')->storeAs('profile_photo', $fileNameToStore);

        if ($student->student_image && $student->student_image !== 'profile_photo/noimage.png') {
            Storage::delete($student->student_image);
        }

        $student->student_image = $path;
        $modifiedSections['student_image'] = true;
    } else {
        if (!$student->student_image) {
            $student->student_image = 'profile_photo/noimage.png';
        }
    }

    // 6. Préparation des données pour mise à jour
    $updateData = [];
    $fields = [
        'first_name', 'last_name', 'birth_date', 'birth_place', 'gender',
        'nationality', 'address', 'city', 'postal_code', 'phone',
        'previous_school', 'previous_class', 'academic_year', 'grade_level', 'special_needs',
    ];

    foreach ($fields as $field) {
        if ($request->has($field) && $request->input($field) != $student->$field) {
            $updateData[$field] = $request->input($field);
            $modifiedSections['personal_info'][] = $field;
        }
    }

    // 7. Dossier
    $dossierMap = [
        'birthCertificate' => 'birth_certificate',
        'medicalCertificate' => 'medical_certificate',
        'reportCard' => 'report_card',
        'idCard' => 'id_card',
    ];

    foreach ($dossierMap as $reqKey => $dbField) {
        $newValue = $request->dossier[$reqKey] ?? $student->$dbField;
        if ($newValue != $student->$dbField) {
            $updateData[$dbField] = $newValue;
            $modifiedSections['dossier'][] = $reqKey;
        }
    }

    // 8. Paiement
    if ($request->has('payment')) {
        if (($tp = $request->payment['tuitionPayment'] ?? null) !== null && $tp != $student->tuition_payment) {
            $updateData['tuition_payment'] = $tp;
            $modifiedSections['payment'][] = 'tuitionPayment';
        }
        if (($months = $request->payment['registrationMonths'] ?? null) !== null && $months != $student->registration_months) {
            $updateData['registration_months'] = $months;
            $modifiedSections['payment'][] = 'registrationMonths';
        }
    }

    $student->update($updateData);

    // 9. Mise à jour des parents
    if ($request->has('parents') && is_array($request->parents)) {
        Guardian::where('student_id', $student->id)->delete();
        foreach ($request->parents as $p) {
            Guardian::create([
                'student_id' => $student->id,
                'name' => $p['name'] ?? null,
                'relationship' => $p['relationship'] ?? null,
                'phone' => $p['phone'] ?? null,
                'email' => $p['email'] ?? null,
                'profession' => $p['profession'] ?? null,
            ]);
        }
        $modifiedSections['parents'] = true;
    }

    // 10. Retour JSON
    return response()->json([
        'message' => 'Student updated successfully',
        'student' => $student->fresh(),
        'guardians' => $student->guardians()->get(),
        'modifiedSections' => $modifiedSections
    ], 200);
}






    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student){
        Gate::authorize('modify', $student); // Vérifie l'autorisation
        $student->delete();                  // Supprime le student
        return ['message' => "La suppression de l'étudiant a été effectuée."];
    }

}
