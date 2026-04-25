<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('school_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name');                   // Nom de la classe (ex: "6A")
            $table->string('level')->nullable();      // Niveau (ex: "6e") – nullable si tu veux laisser optionnel
            $table->integer('capacity')->default(30); // Capacité maximale
            $table->foreignId('academic_year_id')     // Année académique liée
                ->nullable()
                ->constrained('academic_years')
                ->onDelete('set null');
            $table->timestamps();
            $table->unsignedInteger('students_count')->default(0)->after('capacity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_classes');
    }
};
