<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();

            // Relations
            $table->foreignId('student_id')
                  ->constrained()
                  ->onDelete('cascade');

            $table->foreignId('class_id')
                  ->constrained('school_classes')
                  ->onDelete('cascade');

            $table->foreignId('academic_year_id')
                  ->constrained()
                  ->onDelete('cascade');

            // Données inscription
            $table->date('inscription_date');

            $table->enum('status', [
                'active',
                'transferred',
                'completed'
            ])->default('active');

            $table->timestamps();

            // Empêche double inscription même année
            $table->unique(['student_id', 'academic_year_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
