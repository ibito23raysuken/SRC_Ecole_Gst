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

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
