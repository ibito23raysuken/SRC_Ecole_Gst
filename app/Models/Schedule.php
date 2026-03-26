<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'school_class_id',
        'day',
        'subject',
        'start',
        'end',
    ];

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }
}
