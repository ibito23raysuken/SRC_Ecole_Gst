<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->foreignId('school_class_id')->constrained('school_classes')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->string('period', 50);
            $table->decimal('score', 5, 2);
            $table->decimal('max_score', 5, 2)->default(20);
            $table->text('appreciation')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'subject_id', 'period'], 'student_subject_period_unique');
            $table->index(['teacher_id', 'school_class_id', 'period']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_notes');
    }
};
