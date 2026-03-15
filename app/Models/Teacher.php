<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Teacher extends Model
{
        use HasFactory;

protected $fillable = [
    'first_name', 'last_name', 'email', 'phone', 'subject', 'birth_date', 'salary', 'photo'
];

}
