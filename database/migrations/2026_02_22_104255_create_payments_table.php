<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // Relation avec la facture
            $table->foreignId('ecolage_id')
                  ->constrained()
                  ->onDelete('cascade');

            // Données du paiement
            $table->decimal('amount_paid', 10, 2);

            $table->enum('payment_method', [
                'cash',
                'mobile_money',
                'bank_transfer'
            ]);

            $table->date('payment_date');

            $table->string('reference_number')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
