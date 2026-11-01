<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ecolage extends Model
{
    protected $fillable = ['inscription_id', 'academic_year_id', 'month', 'amount_due', 'due_date', 'status'];

    protected $casts = ['amount_due' => 'decimal:2', 'due_date' => 'date'];

    public function inscription() { return $this->belongsTo(Inscription::class); }
    public function academicYear() { return $this->belongsTo(AcademicYear::class); }
    public function payments() { return $this->hasMany(Payment::class); }
}
