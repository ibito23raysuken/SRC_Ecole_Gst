<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();

            // Relations
            $table->foreignId('class_id')
                ->constrained('school_classes') // <- mettre le vrai nom
                ->onDelete('cascade');

           $table->foreignId('subject_id')
                ->constrained('matieres')
                ->onDelete('cascade');

            $table->foreignId('teacher_id')
                  ->constrained()
                  ->onDelete('cascade');

            $table->foreignId('academic_year_id')
                  ->constrained()
                  ->onDelete('cascade');

            // Données emploi du temps
            $table->enum('day_of_week', [
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday'
            ]);

            $table->time('start_time');
            $table->time('end_time');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
