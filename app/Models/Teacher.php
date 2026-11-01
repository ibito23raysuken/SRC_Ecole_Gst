<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'phone',
        'subject',
        'birth_date',
        'salary',
        'photo',
    ];

    public function assignments()
    {
        return $this->hasMany(TeacherClassSubject::class);
    }

    public function assignedClasses()
    {
        return $this->belongsToMany(
            SchoolClass::class,
            'teacher_class_subjects',
            'teacher_id',
            'school_class_id'
        )->withPivot(['subject_id', 'academic_year_id'])->withTimestamps();
    }

    public function notes()
    {
        return $this->hasMany(StudentNote::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
