<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // School settings
        Schema::create('school_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Academic Years
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            $table->string('name', 20)->unique();
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_current')->default(false);
            $table->timestamps();
        });

        // Classes (1-10)
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->unsignedTinyInteger('numeric_level')->unique();
            $table->timestamps();
        });

        // Sections
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained()->cascadeOnDelete();
            $table->string('name', 20);
            $table->string('room_no', 20)->nullable();
            $table->unique(['class_id', 'name']);
            $table->timestamps();
        });

        // Subjects
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('name_bn', 100)->nullable();
            $table->string('code', 20)->nullable()->unique();
            $table->string('type', 30)->default('core');
            $table->timestamps();
        });

        // Class-Subject pivot with per-subject marks config
        Schema::create('class_subject', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('full_marks')->default(100);
            $table->unsignedSmallInteger('written_marks')->nullable();
            $table->unsignedSmallInteger('mcq_marks')->nullable();
            $table->unsignedSmallInteger('practical_marks')->nullable();
            $table->unsignedSmallInteger('ca_marks')->nullable();
            $table->unsignedTinyInteger('pass_marks')->default(33);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->unique(['class_id', 'subject_id']);
            $table->timestamps();
        });

        // Exams
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('type', 50);
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Exam Schedules
        Schema::create('exam_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->unique(['exam_id', 'subject_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_schedules');
        Schema::dropIfExists('exams');
        Schema::dropIfExists('class_subject');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('sections');
        Schema::dropIfExists('classes');
        Schema::dropIfExists('academic_years');
        Schema::dropIfExists('school_settings');
    }
};
