<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_notes', function (Blueprint $table) {
            $table->foreignId('academic_year_id')->nullable()->after('school_class_id')->constrained()->nullOnDelete();
            $table->dropUnique('student_subject_period_unique');
            $table->unique(['student_id', 'subject_id', 'period', 'academic_year_id'], 'student_subject_period_year_unique');
            $table->index(['student_id', 'academic_year_id']);
        });
    }

    public function down(): void
    {
        Schema::table('student_notes', function (Blueprint $table) {
            $table->dropUnique('student_subject_period_year_unique');
            $table->dropIndex(['student_id', 'academic_year_id']);
            $table->dropForeign(['academic_year_id']);
            $table->dropColumn('academic_year_id');
            $table->unique(['student_id', 'subject_id', 'period'], 'student_subject_period_unique');
        });
    }
};
