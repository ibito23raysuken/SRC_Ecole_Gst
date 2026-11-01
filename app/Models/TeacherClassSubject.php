<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherClassSubject extends Model
{
    protected $table = 'teacher_class_subjects';

    protected $fillable = [
        'teacher_id',
        'school_class_id',
        'subject_id',
        'academic_year_id',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
