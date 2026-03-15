<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('matieres', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nom de la matière
            $table->decimal('coefficient', 5, 2)->default(1.0); // Coefficient pour calcul des notes
            $table->text('description')->nullable(); // Description de la matière
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('matieres');
    }
};
