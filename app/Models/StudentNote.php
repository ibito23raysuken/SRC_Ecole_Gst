<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentNote extends Model
{
    protected $fillable = [
        'student_id',
        'teacher_id',
        'school_class_id',
        'subject_id',
        'period',
        'score',
        'max_score',
        'appreciation',
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'max_score' => 'decimal:2',
    ];

    public function student() { return $this->belongsTo(Student::class); }
    public function teacher() { return $this->belongsTo(Teacher::class); }
    public function schoolClass() { return $this->belongsTo(SchoolClass::class); }
    public function subject() { return $this->belongsTo(Subject::class); }
}
