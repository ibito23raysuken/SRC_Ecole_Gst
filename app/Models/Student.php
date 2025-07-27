<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
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
        'grade_level',
        'special_needs',
        'birth_certificate',
        'medical_certificate',
        'report_card',
        'photo',
        'id_card',
        'tuition_payment',
        'registration_months',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'birth_certificate' => 'boolean',
        'medical_certificate' => 'boolean',
        'report_card' => 'boolean',
        'photo' => 'boolean',
        'id_card' => 'boolean',
        'registration_months' => 'array',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
        public function guardians()
    {
        return $this->hasMany(Guardian::class);
    }

}
