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
        Schema::create('students', function (Blueprint $table) {
          $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('birth_date');
            $table->string('birth_place')->nullable();
            $table->enum('gender', ['male', 'female']);
            $table->string('nationality')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('phone');
            $table->string('previous_school')->nullable();
            $table->string('previous_class')->nullable();
            $table->integer('academic_year')->nullable();
            $table->enum('grade_level', [
                'PS', 'MS', 'GS', 'CP', 'CE1', 'CE2', 'CM1', 'CM2',
                '6e', '5e', '4e', '3e', '2nde', '1ère', 'Term'
            ]);
            $table->text('special_needs')->nullable();

            // Documents
            $table->boolean('birth_certificate')->default(false);
            $table->boolean('medical_certificate')->default(false);
            $table->boolean('report_card')->default(false);
            $table->boolean('photo')->default(false);
            $table->boolean('id_card')->default(false);

            // Paiement
            $table->enum('tuition_payment', ['half', 'full', 'not_paid']);
            $table->json('registration_months')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
