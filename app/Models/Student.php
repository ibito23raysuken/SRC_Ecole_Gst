<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'birth_date',
        'birth_place',
        'gender',
        'nationality',
        'address',
        'city',
        'postal_code',
        'phone',
        'previous_school',
        'previous_class',
        'academic_year',
        'special_needs',

        // Documents physiques
        'birth_certificate',
        'medical_certificate',
        'residence_certificate',
        'report_card',

        'student_image',

        'tuition_payment',
        'registration_months',

        'school_class_id',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'birth_certificate' => 'boolean',
        'medical_certificate' => 'boolean',
        'residence_certificate' => 'boolean',
        'report_card' => 'boolean',
        'registration_months' => 'array',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function guardians()
    {
        return $this->hasMany(Guardian::class);
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    /*
    |--------------------------------------------------------------------------
    | BOOT - suppression cascade
    |--------------------------------------------------------------------------
    */

    protected static function booted()
    {
        static::deleting(function ($student) {

            // supprimer les guardians liés
            $student->guardians()->delete();

            // (optionnel) supprimer fichiers si tu veux
            // Storage::disk('public')->delete($student->birth_certificate);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | ACCESSORS
    |--------------------------------------------------------------------------
    */

    public function getProfilePhotoUrlAttribute()
    {
        return $this->student_image
            ? asset('storage/' . $this->student_image)
            : null;
    }

    /*
    |--------------------------------------------------------------------------
    | HELPERS (optionnel mais utile)
    |--------------------------------------------------------------------------
    */

    public function hasBirthCertificate()
    {
        return $this->birth_certificate;
    }

    public function hasMedicalCertificate()
    {
        return $this->medical_certificate;
    }

    public function hasResidenceCertificate()
    {
        return $this->residence_certificate;
    }

    public function hasReportCard()
    {
        return $this->report_card;
    }
}
