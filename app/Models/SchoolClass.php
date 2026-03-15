<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'level',
        'capacity',
        'academic_year_id'
    ];

    // Relation avec les étudiants
    public function students()
    {
        return $this->hasMany(Student::class);
    }

    // Relation avec les emplois du temps
    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    // Relation avec l'année académique
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
