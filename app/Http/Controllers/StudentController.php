<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Models\Student;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
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

        $feeType = $validated['fee_type'] ?? 'all';
        $month = $validated['month'] ?? null;
        $academicYearId = $validated['academic_year_id'] ?? null;

        $monthlyDueQuery = DB::table('ecolages')
            ->join('inscriptions', 'inscriptions.id', '=', 'ecolages.inscription_id')
            ->whereColumn('inscriptions.student_id', 'students.id')
            ->when($academicYearId, fn ($query) => $query->where('inscriptions.academic_year_id', $academicYearId))
            ->when($month, fn ($query) => $query->where('ecolages.month', $month))
            ->selectRaw('COALESCE(SUM(ecolages.amount_due), 0)');

        $monthlyPaidQuery = DB::table('payments')
            ->join('ecolages', 'ecolages.id', '=', 'payments.ecolage_id')
            ->join('inscriptions', 'inscriptions.id', '=', 'ecolages.inscription_id')
            ->whereColumn('inscriptions.student_id', 'students.id')
            ->when($academicYearId, fn ($query) => $query->where('inscriptions.academic_year_id', $academicYearId))
            ->when($month, fn ($query) => $query->where('ecolages.month', $month))
            ->selectRaw('COALESCE(SUM(payments.amount_paid), 0)');

        $overdueCountQuery = DB::table('ecolages')
            ->join('inscriptions', 'inscriptions.id', '=', 'ecolages.inscription_id')
            ->whereColumn('inscriptions.student_id', 'students.id')
            ->where('ecolages.status', 'overdue')
            ->when($academicYearId, fn ($query) => $query->where('inscriptions.academic_year_id', $academicYearId))
            ->when($month, fn ($query) => $query->where('ecolages.month', $month))
            ->selectRaw('COUNT(*)');

        $paymentDataQuery = DB::table('students')
            ->select('students.*')
            ->selectSub($monthlyDueQuery, 'monthly_due_raw')
            ->selectSub($monthlyPaidQuery, 'monthly_paid_raw')
            ->selectSub($overdueCountQuery, 'overdue_count')
            ->selectSub(
                DB::table('settings')->select('registration_fee')->orderBy('id')->limit(1),
                'registration_fee'
            );

        if ($month) {
            $paymentDataQuery->selectRaw(
                "EXISTS (
                    SELECT 1
                    FROM jsonb_array_elements_text(
                        COALESCE(students.registration_months::jsonb, '[]'::jsonb)
                    ) AS registration_month(value)
                    WHERE registration_month.value ~ '^[0-9]+$'
                      AND registration_month.value::integer = ?
                ) AS registration_month_matches",
                [(int) $month]
            );
        } else {
            $paymentDataQuery->selectRaw('TRUE AS registration_month_matches');
        }

        $paymentSummaryBase = DB::query()
            ->fromSub($paymentDataQuery, 'payment_data')
            ->select('payment_data.*')
            ->selectRaw(
                'CASE WHEN ? = ? THEN 0 ELSE monthly_due_raw END AS monthly_due',
                [$feeType, 'registration']
            )
            ->selectRaw(
                'CASE WHEN ? = ? THEN 0 ELSE monthly_paid_raw END AS monthly_paid',
                [$feeType, 'registration']
            )
            ->selectRaw(
                'CASE WHEN ? = ? OR NOT registration_month_matches THEN 0 ELSE COALESCE(registration_fee, 0) END AS registration_due',
                [$feeType, 'monthly']
            );

        $paymentTotals = DB::query()
            ->fromSub($paymentSummaryBase, 'payment_summary_base')
            ->select('payment_summary_base.*')
            ->selectRaw(
                "CASE
                    WHEN tuition_payment = 'full' THEN registration_due
                    WHEN tuition_payment = 'half' THEN registration_due / 2
                    ELSE 0
                END AS registration_paid"
            );

        $amountTotals = DB::query()
            ->fromSub($paymentTotals, 'payment_totals')
            ->select('payment_totals.*')
            ->selectRaw('ROUND(monthly_due + registration_due, 2) AS amount_due')
            ->selectRaw('ROUND(monthly_paid + registration_paid, 2) AS amount_paid')
            ->selectRaw('GREATEST(ROUND(monthly_due + registration_due - monthly_paid - registration_paid, 2), 0) AS balance')
            ->selectRaw(
                "CASE
                    WHEN ? = 'registration' THEN registration_due
                    WHEN ? = 'monthly' THEN monthly_due
                    ELSE ROUND(monthly_due + registration_due, 2)
                END AS fee_type_due",
                [$feeType, $feeType]
            );

        $summaryQuery = DB::query()
            ->fromSub($amountTotals, 'amount_totals')
            ->select('amount_totals.*')
            ->selectRaw(
                "CASE
                    WHEN amount_due <= 0 THEN NULL
                    WHEN balance <= 0 THEN 'paid'
                    WHEN amount_paid <= 0 AND ? <> 'registration' AND overdue_count > 0 THEN 'overdue'
                    WHEN amount_paid <= 0 THEN 'unpaid'
                    WHEN ? <> 'registration' AND overdue_count > 0 THEN 'overdue'
                    ELSE 'partial'
                END AS payment_status",
                [$feeType, $feeType]
            );

        $query = Student::query()
            ->fromSub($summaryQuery, 'students')
            ->select('students.*')
            ->with([
                'guardians',
                'schoolClass.academicYear',
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

        if ($feeType !== 'all') {
            $query->where('students.fee_type_due', '>', 0);
        }

        if ($month) {
            $query->where('students.amount_due', '>', 0);
        }

        $eligibleQuery = clone $query;
        $stats = DB::query()
            ->fromSub($eligibleQuery->toBase(), 'filtered_students')
            ->selectRaw('COUNT(*) AS total')
            ->selectRaw("SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) AS paid")
            ->selectRaw("SUM(CASE WHEN payment_status = 'unpaid' THEN 1 ELSE 0 END) AS unpaid")
            ->selectRaw("SUM(CASE WHEN payment_status = 'partial' THEN 1 ELSE 0 END) AS partial")
            ->selectRaw('COALESCE(ROUND(SUM(balance), 2), 0) AS total_balance')
            ->first();

        if (!empty($validated['payment_status'])) {
            $query->where('students.payment_status', $validated['payment_status']);
        }

        if (!empty($validated['paid_state'])) {
            match ($validated['paid_state']) {
                'has_balance' => $query->where('students.balance', '>', 0),
                'paid' => $query->where('students.balance', '<=', 0)->where('students.amount_due', '>', 0),
                'nothing_paid' => $query->where('students.amount_paid', '<=', 0),
            };
        }

        if (array_key_exists('balance_min', $validated)) {
            $query->where('students.balance', '>=', (float) $validated['balance_min']);
        }

        if (array_key_exists('balance_max', $validated)) {
            $query->where('students.balance', '<=', (float) $validated['balance_max']);
        }

        $direction = $validated['direction'] ?? 'asc';
        $sort = $validated['sort'] ?? 'last_name';
        $sortColumn = match ($sort) {
            'first_name' => 'students.first_name',
            'school_class' => 'school_classes.name',
            'academic_year' => 'students.academic_year',
            'amount_paid' => 'students.amount_paid',
            'balance' => 'students.balance',
            'payment_status' => 'students.payment_status',
            default => 'students.last_name',
        };

        if ($sort === 'school_class') {
            $query->leftJoin('school_classes', 'school_classes.id', '=', 'students.school_class_id');
        }

        if ($sort === 'school_class') {
            $query->orderByRaw("COALESCE(school_classes.name, '') {$direction}");
        } else {
            $query->orderBy($sortColumn, $direction);
        }
        if ($sort !== 'last_name') {
            $query->orderBy('students.last_name')->orderBy('students.first_name');
        } elseif ($direction === 'asc') {
            $query->orderBy('students.first_name');
        }

        $perPage = min((int) ($validated['per_page'] ?? 8), 100);
        $paginator = $query->paginate($perPage)->withQueryString();

        $internalAttributes = [
            'monthly_due_raw',
            'monthly_paid_raw',
            'overdue_count',
            'registration_fee',
            'registration_month_matches',
            'monthly_due',
            'monthly_paid',
            'registration_due',
            'registration_paid',
            'fee_type_due',
        ];

        $paginator->getCollection()->transform(function (Student $student) use ($internalAttributes) {
            $amountDue = (float) $student->amount_due;
            $amountPaid = (float) $student->amount_paid;
            $student->setAttribute('payment_summary', [
                'status' => $student->payment_status,
                'amount_due' => round($amountDue, 2),
                'amount_paid' => round($amountPaid, 2),
                'balance' => round((float) $student->balance, 2),
                'fee_type_due' => round((float) $student->fee_type_due, 2),
                'has_payment_data' => $amountDue > 0,
                'supported_statuses' => ['paid', 'unpaid', 'partial', 'overdue'],
            ]);

            foreach (array_merge($internalAttributes, ['amount_due', 'amount_paid', 'balance', 'payment_status']) as $attribute) {
                unset($student->{$attribute});
            }

            return $student;
        });

        return response()->json([
            'data' => $paginator->items(),
            'meta' => array_merge($paginator->toArray(), [
                'stats' => [
                    'total' => (int) $stats->total,
                    'paid' => (int) $stats->paid,
                    'unpaid' => (int) $stats->unpaid,
                    'partial' => (int) $stats->partial,
                    'total_balance' => round((float) $stats->total_balance, 2),
                ],
            ]),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentRequest $request){
            $validated = $request->validated();

        /////////////////////////
        // Vérifier si un étudiant avec le même prénom et nom existe déjà
            $existingStudent = Student::where('first_name', $validated['first_name'])
                                    ->where('last_name', $validated['last_name'])
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
                    if (isset($validated['parents'])) {
                        foreach ($validated['parents'] as $parentData) {
                            if (!empty($parentData['name']) && !empty($parentData['phone'])) {
                                Guardian::create([
                                    'student_id' => $student->id,
                                    'name' => $parentData['name'] ?? null,
                                    'first_name' => $parentData['first_name'] ?? null,
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
public function update(UpdateStudentRequest $request, Student $student){
    $validated = $request->validated();

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
        $path = $request->file('student_image')->store('student_images', 'public');

        if ($student->student_image && $student->student_image !== 'profile_photo/noimage.png') {
            Storage::disk('public')->delete($student->student_image);
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

    // 9. Mise à jour de l'élève et des parents
    DB::transaction(function () use ($student, $updateData, $validated, &$modifiedSections) {
        $student->update($updateData);

        if (isset($validated['parents'])) {
            $student->guardians()->delete();
            foreach ($validated['parents'] as $parent) {
                $student->guardians()->create([
                    'name' => $parent['name'],
                    'first_name' => $parent['first_name'] ?? null,
                    'relationship' => $parent['relationship'],
                    'phone' => $parent['phone'],
                    'email' => $parent['email'] ?? null,
                    'profession' => $parent['profession'] ?? null,
                ]);
            }
            $modifiedSections['parents'] = true;
        }
    });

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
