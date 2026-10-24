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
        Schema::table('settings', function (Blueprint $table) {
            $table->decimal('registration_fee', 12, 2)
                ->default(0)
                ->after('academic_year');

            $table->decimal('monthly_fee', 12, 2)
                ->default(0)
                ->after('registration_fee');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn([
                'registration_fee',
                'monthly_fee',
            ]);
        });
    }
};
