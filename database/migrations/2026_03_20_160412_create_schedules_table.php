<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('school_class_id');
            $table->string('day'); // Lundi, Mardi...
            $table->string('subject'); // Nom de la matière
            $table->time('start'); // Heure de début
            $table->time('end');   // Heure de fin
            $table->timestamps();

            $table->foreign('school_class_id')
                  ->references('id')
                  ->on('school_classes')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
