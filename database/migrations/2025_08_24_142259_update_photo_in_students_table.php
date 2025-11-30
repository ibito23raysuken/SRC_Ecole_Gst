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
        Schema::table('students', function (Blueprint $table) {
            // supprimer l’ancien champ boolean
            $table->dropColumn('photo');
             // ajouter un champ string pour stocker le chemin
            $table->string('student_image')->nullable()->after('report_card');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->boolean('photo')->default(false);
           $table->dropColumn('student_image');
        });
    }
};
