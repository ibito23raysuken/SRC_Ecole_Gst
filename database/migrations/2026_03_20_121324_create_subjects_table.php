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
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name');                     // Nom de la matière
            $table->decimal('coefficient', 5, 2)->default(1); // Coefficient par défaut = 1
            $table->foreignId('class_id')              // Relation avec une classe
                  ->constrained('school_classes')    // Table liée
                  ->cascadeOnDelete();               // Si la classe est supprimée, la matière aussi
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
