<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tabulation_sheets', function (Blueprint $table) {
            $table->id();
            $table->string('class_name', 50);
            $table->string('section', 30);
            $table->string('exam_name', 50);
            $table->string('academic_year', 15);
            $table->timestamps();

            // Compound unique index to prevent duplicate configs
            $table->unique(['class_name', 'section', 'exam_name', 'academic_year'], 'tabulation_sheets_uq');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tabulation_sheets');
    }
};
