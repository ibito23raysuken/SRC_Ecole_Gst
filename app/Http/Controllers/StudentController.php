<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Models\Setting;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
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
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'school_class_id' => ['nullable', 'integer', 'exists:school_classes,id'],
            'academic_year_id' => ['nullable', 'integer', 'exists:academic_years,id'],
            'academic_year' => ['nullable', 'integer'],
            'month' => ['nullable', 'integer', 'between:1,12'],
            'payment_status' => ['nullable', 'in:paid,unpaid,partial,overdue'],
            'fee_type' => ['nullable', 'in:all,registration,monthly'],
            'balance_min' => ['nullable', 'numeric', 'min:0'],
            'balance_max' => ['nullable', 'numeric', 'min:0'],
            'paid_state' => ['nullable', 'in:has_balance,paid,nothing_paid'],
            'sort' => ['nullable', 'in:last_name,first_name,school_class,academic_year,amount_paid,balance,payment_status'],
            'direction' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'between:1,100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = Student::query()
            ->with([
                'guardians',
                'schoolClass.academicYear',
                'inscriptions.ecolages.payments',
            ])
            ->with(['schoolClass' => fn ($classQuery) => $classQuery->withCount('students')]);

        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($studentQuery) use ($search) {
                $studentQuery
                    ->whereRaw('LOWER(first_name) LIKE ?', ['%' . mb_strtolower($search) . '%'])
                    ->orWhereRaw('LOWER(last_name) LIKE ?', ['%' . mb_strtolower($search) . '%'])
                    ->orWhereHas('schoolClass', fn ($classQuery) =>
                        $classQuery->whereRaw('LOWER(name) LIKE ?', ['%' . mb_strtolower($search) . '%']))
                    ->orWhereHas('guardians', fn ($guardianQuery) =>
                        $guardianQuery->where('phone', 'like', "%{$search}%"));
            });
        }

        if (!empty($validated['school_class_id'])) {
            $query->where('school_class_id', $validated['school_class_id']);
        }

        if (!empty($validated['academic_year_id'])) {
            $academicYearId = $validated['academic_year_id'];
            $query->where(function ($studentQuery) use ($academicYearId) {
                $studentQuery
                    ->whereHas('schoolClass', fn ($classQuery) =>
                        $classQuery->where('academic_year_id', $academicYearId))
                    ->orWhereHas('inscriptions', fn ($inscriptionQuery) =>
                        $inscriptionQuery->where('academic_year_id', $academicYearId));
            });
        }

        if (array_key_exists('academic_year', $validated)) {
            $query->where('academic_year', $validated['academic_year']);
        }

        $students = $query->get();
        $settings = Setting::query()->first();
        $feeType = $validated['fee_type'] ?? 'all';

        $rows = $students->map(function (Student $student) use ($validated, $settings, $feeType) {
            $summary = $this->paymentSummary($student, $validated, $settings, $feeType);
            $student->setAttribute('payment_summary', $summary);
            return $student;
        });

        // Ces filtres dépendent de montants agrégés provenant de plusieurs tables.
        // Ils sont appliqués après l'agrégation afin de ne jamais inventer un statut.
        if ($feeType !== 'all') {
            $rows = $rows->filter(fn (Student $student) =>
                $student->payment_summary['fee_type_due'] > 0);
        }

        // Avec un mois sélectionné, ne conserver que les élèves qui ont une
        // échéance d'inscription ou d'écolage sur ce mois.
        if (!empty($validated['month'])) {
            $rows = $rows->filter(fn (Student $student) =>
                $student->payment_summary['amount_due'] > 0);
        }

        $stats = $this->paymentStats($rows);

        if (!empty($validated['payment_status'])) {
            $rows = $rows->filter(fn (Student $student) =>
                ($student->payment_summary['status'] ?? null) === $validated['payment_status']);
        }

        if (!empty($validated['paid_state'])) {
            $rows = $rows->filter(function (Student $student) use ($validated) {
                $summary = $student->payment_summary;
                return match ($validated['paid_state']) {
                    'has_balance' => $summary['balance'] > 0,
                    'paid' => $summary['balance'] <= 0 && $summary['amount_due'] > 0,
                    'nothing_paid' => $summary['amount_paid'] <= 0,
                };
            });
        }

        if (array_key_exists('balance_min', $validated)) {
            $rows = $rows->filter(fn (Student $student) =>
                $student->payment_summary['balance'] >= (float) $validated['balance_min']);
        }

        if (array_key_exists('balance_max', $validated)) {
            $rows = $rows->filter(fn (Student $student) =>
                $student->payment_summary['balance'] <= (float) $validated['balance_max']);
        }

        $sort = $validated['sort'] ?? 'last_name';
        $direction = ($validated['direction'] ?? 'asc') === 'desc' ? -1 : 1;
        $rows = $rows->sort(function (Student $left, Student $right) use ($sort, $direction) {
            $leftValue = match ($sort) {
                'first_name' => $left->first_name,
                'school_class' => $left->schoolClass?->name,
                'academic_year' => $left->academic_year,
                'amount_paid' => $left->payment_summary['amount_paid'],
                'balance' => $left->payment_summary['balance'],
                'payment_status' => $left->payment_summary['status'] ?? '',
                default => $left->last_name,
            };
            $rightValue = match ($sort) {
                'first_name' => $right->first_name,
                'school_class' => $right->schoolClass?->name,
                'academic_year' => $right->academic_year,
                'amount_paid' => $right->payment_summary['amount_paid'],
                'balance' => $right->payment_summary['balance'],
                'payment_status' => $right->payment_summary['status'] ?? '',
                default => $right->last_name,
            };
            return $direction * strnatcasecmp((string) $leftValue, (string) $rightValue);
        })->values();

        $perPage = (int) ($validated['per_page'] ?? 8);
        $page = (int) ($validated['page'] ?? 1);
        $paginator = new LengthAwarePaginator(
            $rows->forPage($page, $perPage)->values(),
            $rows->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return response()->json([
            'data' => $paginator->items(),
            'meta' => array_merge($paginator->toArray(), ['stats' => $stats]),
        ]);
    }

    private function paymentSummary(Student $student, array $filters, ?Setting $settings, string $feeType): array
    {
        $inscriptions = $student->inscriptions;
        if (!empty($filters['academic_year_id'])) {
            $inscriptions = $inscriptions->where('academic_year_id', $filters['academic_year_id']);
        }

        $ecolages = $inscriptions->flatMap->ecolages;
        if (!empty($filters['month'])) {
            $ecolages = $ecolages->where('month', (int) $filters['month']);
        }

        $monthlyDue = $feeType === 'registration' ? 0.0 : (float) $ecolages->sum('amount_due');
        $monthlyPaid = $feeType === 'registration'
            ? 0.0
            : (float) $ecolages->flatMap->payments->sum('amount_paid');

        $registrationDue = 0.0;
        $registrationPaid = 0.0;
        if ($feeType !== 'monthly') {
            $registrationMonths = collect($student->registration_months ?? [])->map(fn ($month) => (int) $month);
            $monthMatchesRegistration = empty($filters['month'])
                || $registrationMonths->contains((int) $filters['month']);
            if ($monthMatchesRegistration) {
                $registrationDue = (float) ($settings?->registration_fee ?? 0);
                $registrationPaid = match ($student->tuition_payment) {
                    'full' => $registrationDue,
                    'half' => $registrationDue / 2,
                    default => 0.0,
                };
            }
        }

        $amountDue = round($monthlyDue + $registrationDue, 2);
        $amountPaid = round($monthlyPaid + $registrationPaid, 2);
        $balance = max(round($amountDue - $amountPaid, 2), 0);
        $hasOverdue = $feeType === 'registration'
            ? false
            : $ecolages->contains(fn ($ecolage) => $ecolage->status === 'overdue');
        $status = $amountDue <= 0 ? null : ($balance <= 0 ? 'paid' : ($amountPaid <= 0 ? ($hasOverdue ? 'overdue' : 'unpaid') : ($hasOverdue ? 'overdue' : 'partial')));

        return [
            'status' => $status,
            'amount_due' => $amountDue,
            'amount_paid' => $amountPaid,
            'balance' => $balance,
            'fee_type_due' => $feeType === 'registration' ? $registrationDue
                : ($feeType === 'monthly' ? $monthlyDue : $amountDue),
            'has_payment_data' => $amountDue > 0,
            'supported_statuses' => ['paid', 'unpaid', 'partial', 'overdue'],
        ];
    }

    private function paymentStats($rows): array
    {
        return [
            'total' => $rows->count(),
            'paid' => $rows->filter(fn (Student $student) => $student->payment_summary['status'] === 'paid')->count(),
            'unpaid' => $rows->filter(fn (Student $student) => $student->payment_summary['status'] === 'unpaid')->count(),
            'partial' => $rows->filter(fn (Student $student) => $student->payment_summary['status'] === 'partial')->count(),
            'total_balance' => round($rows->sum(fn (Student $student) => $student->payment_summary['balance']), 2),
        ];
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

            if ($request->has('paid_months') && is_string($request->paid_months)) {
                $request->merge(['paid_months' => json_decode($request->paid_months, true)]);
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
                'school_class_id' => 'required|integer|exists:school_classes,id',

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
        if ($request->hasFile('student_image')) {
            $fileNameWithExt = $request->file('student_image')->getClientOriginalName();
            $fileName = pathinfo($fileNameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('student_image')->getClientOriginalExtension();
            $fileNameToStore = $fileName.'_'.time().'.'.$extension;
            $path = $request->file('student_image')->storeAs('student_images', $fileNameToStore);
        } else {
            $path = 'profile_photo/noimage.png';
        }

        // Vérification des règles
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
                'data' => $request->all()
            ], 422);
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
                    'school_class_id' => $request->school_class_id,
                    'special_needs' => $request->special_needs,

                    // Ajout du chemin de la photo
                    'student_image' => $path,

                    // Documents
                    'birth_certificate' => $request->boolean('birth_certificate'),
                    'medical_certificate' => $request->boolean('medical_certificate'),
                    'residence_certificate' => $request->boolean('residence_certificate'),
                    'report_card' => $request->boolean('report_card'),


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
        $student = Student::with(['guardians', 'schoolClass' => function($query) {
            $query->withCount('students');
        }])->findOrFail($student->id);
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
        'school_class_id' => 'sometimes|integer|exists:school_classes,id',
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
        'dossier.residenceCertificate' => 'sometimes|required_with:dossier|boolean',
        'dossier.reportCard' => 'sometimes|required_with:dossier|boolean',
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
        'previous_school', 'previous_class', 'academic_year', 'grade_level', 'school_class_id', 'special_needs',
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
        'residenceCertificate' => 'residence_certificate',
        'reportCard' => 'report_card',
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
        'data' => $student->fresh()->load(['guardians', 'schoolClass' => function($query) {
            $query->withCount('students');
        }]),
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
