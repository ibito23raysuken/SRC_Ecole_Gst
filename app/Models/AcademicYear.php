<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory;

    // Colonnes assignables en mass assignment
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'is_active',
    ];

    // Une année académique peut avoir plusieurs classes
    public function schoolClasses()
    {
        return $this->hasMany(SchoolClass::class, 'academic_year_id');
    }

    // Optionnel : scope pour récupérer l'année active
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
