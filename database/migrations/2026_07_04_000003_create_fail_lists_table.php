<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fail_lists', function (Blueprint $table) {
            $table->id();
            $table->string('class_name', 50);
            $table->string('section', 30);
            $table->string('exam_name', 50);
            $table->string('academic_year', 15);
            $table->timestamps();

            // Add unique index to prevent duplicate configurations (shorter lengths fit within MySQL index size limits)
            $table->unique(['class_name', 'section', 'exam_name', 'academic_year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fail_lists');
    }
};
