<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academic_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('exam_name', 100);
            $table->string('academic_year', 20);
            $table->unsignedInteger('class_position')->nullable();
            $table->unsignedInteger('working_days')->default(0);
            $table->unsignedInteger('present_days')->default(0);
            $table->unsignedInteger('absent_days')->default(0);
            $table->string('moral_evaluation', 50)->nullable();
            $table->text('co_curricular')->nullable(); // JSON or comma-separated string
            $table->text('comments')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'exam_name', 'academic_year']);
        });

        Schema::create('academic_report_marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_report_id')->constrained()->cascadeOnDelete();
            $table->string('subject_name', 100);
            $table->unsignedInteger('full_marks')->default(100);
            $table->unsignedInteger('highest_marks')->default(100);
            $table->unsignedInteger('written_marks')->nullable();
            $table->unsignedInteger('mcq_marks')->nullable();
            $table->unsignedInteger('practical_marks')->nullable();
            $table->unsignedInteger('ca_marks')->nullable(); // Continuous Assessment / Other
            $table->timestamps();

            $table->unique(['academic_report_id', 'subject_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_report_marks');
        Schema::dropIfExists('academic_reports');
    }
};
