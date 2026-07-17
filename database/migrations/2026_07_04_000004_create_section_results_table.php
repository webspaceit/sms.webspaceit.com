<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('section_results', function (Blueprint $table) {
            $table->id();
            $table->string('class_name', 50);
            $table->string('section', 30);
            $table->string('exam_name', 50);
            $table->string('academic_year', 15);
            $table->timestamps();

            // Unique index compound key to prevent duplicates (with a custom short index name to avoid MySQL name limits)
            $table->unique(['class_name', 'section', 'exam_name', 'academic_year'], 'section_results_uq');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('section_results');
    }
};
