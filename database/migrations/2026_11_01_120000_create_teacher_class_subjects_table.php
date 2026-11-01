<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_class_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->foreignId('school_class_id')->constrained('school_classes')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();

            $table->unique(['teacher_id', 'school_class_id', 'subject_id', 'academic_year_id'], 'teacher_class_subject_unique');
            $table->index(['teacher_id', 'school_class_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_class_subjects');
    }
};
