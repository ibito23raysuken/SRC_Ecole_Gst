<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = ['ecolage_id', 'amount_paid', 'payment_method', 'payment_date', 'reference_number'];

    protected $casts = ['amount_paid' => 'decimal:2', 'payment_date' => 'date'];

    public function ecolage() { return $this->belongsTo(Ecolage::class); }
}
