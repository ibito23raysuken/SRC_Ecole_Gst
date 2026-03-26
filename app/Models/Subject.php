<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    // Colonnes qui peuvent être remplies via mass assignment
    protected $fillable = [
        'name',
        'coefficient',
        'class_id'
    ];

    /**
     * Relation : une matière appartient à une classe
     */
    public function classe()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }
}
