<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inscription extends Model
{
    protected $fillable = ['student_id', 'class_id', 'academic_year_id', 'inscription_date', 'status'];

    protected $casts = ['inscription_date' => 'date'];

    public function student() { return $this->belongsTo(Student::class); }
    public function schoolClass() { return $this->belongsTo(SchoolClass::class, 'class_id'); }
    public function academicYear() { return $this->belongsTo(AcademicYear::class); }
    public function ecolages() { return $this->hasMany(Ecolage::class); }
}
