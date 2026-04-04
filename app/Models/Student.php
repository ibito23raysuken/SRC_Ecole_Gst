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
        'birth_certificate',
        'medical_certificate',
        'report_card',
        'student_image',
        'id_card',
        'tuition_payment',
        'registration_months',
        'school_class_id', // 🔥 nouvel ajout
    ];

    protected $casts = [
        'birth_date' => 'date',
        'birth_certificate' => 'boolean',
        'medical_certificate' => 'boolean',
        'report_card' => 'boolean',
        'id_card' => 'boolean',
        'registration_months' => 'array',
    ];

    // Relations
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

    // Supprimer les gardiens associés à la suppression
    protected static function booted()
    {
        static::deleting(function ($student) {
            $student->guardians()->delete();
        });
    }

    // URL complète pour l'image
    public function getProfilePhotoUrlAttribute()
    {
        return asset('storage/' . $this->student_image);
    }
}
