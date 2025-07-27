<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;  // <-- Ajoute cette ligne
use Illuminate\Database\Eloquent\Model;

class Guardian extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'name',
        'relationship',
        'phone',
        'email',
        'profession'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
