<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'school_name',
        'school_email',
        'school_phone',
        'school_address',
        'academic_year',
        'registration_fee',
        'monthly_fee',
    ];

    protected $casts = [
        'registration_fee' => 'decimal:2',
        'monthly_fee' => 'decimal:2',
    ];
}
