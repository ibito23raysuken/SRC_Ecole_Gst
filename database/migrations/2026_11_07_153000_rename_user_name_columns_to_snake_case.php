<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'firstName')) {
                $table->renameColumn('firstName', 'first_name');
            }

            if (Schema::hasColumn('users', 'lastName')) {
                $table->renameColumn('lastName', 'last_name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'first_name')) {
                $table->renameColumn('first_name', 'firstName');
            }

            if (Schema::hasColumn('users', 'last_name')) {
                $table->renameColumn('last_name', 'lastName');
            }
        });
    }
};
