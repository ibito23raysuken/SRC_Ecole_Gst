<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ecolages', function (Blueprint $table) {
            $table->id();

            // Relation principale (très important)
            $table->foreignId('inscription_id')
                  ->constrained()
                  ->onDelete('cascade');

            // Relation année académique
            $table->foreignId('academic_year_id')
                  ->constrained()
                  ->onDelete('cascade');

            // Données financières
            $table->unsignedTinyInteger('month'); // 1 à 12
            $table->decimal('amount_due', 10, 2);
            $table->date('due_date');

            // Statut facture
            $table->enum('status', [
                'unpaid',
                'partial',
                'paid',
                'overdue'
            ])->default('unpaid');

            $table->timestamps();

            // Empêche double facture même mois
            $table->unique([
                'inscription_id',
                'month',
                'academic_year_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ecolages');
    }
};
