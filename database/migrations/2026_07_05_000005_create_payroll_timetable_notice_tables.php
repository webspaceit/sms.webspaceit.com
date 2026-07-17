<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Salary Structures
        Schema::create('salary_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('basic_salary')->default(0);
            $table->unsignedInteger('house_rent')->default(0);
            $table->unsignedInteger('medical')->default(0);
            $table->unsignedInteger('transport_allowance')->default(0);
            $table->unsignedInteger('other_allowances')->default(0);
            $table->unsignedInteger('deductions')->default(0);
            $table->text('notes')->nullable();
            $table->date('effective_from');
            $table->unique(['teacher_id', 'effective_from']);
            $table->timestamps();
        });

        // Salary Payments
        Schema::create('salary_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->string('month', 20);
            $table->string('year', 10);
            $table->unsignedInteger('gross_salary');
            $table->unsignedInteger('deductions')->default(0);
            $table->unsignedInteger('net_pay');
            $table->date('paid_date');
            $table->string('payment_method', 50)->nullable();
            $table->string('reference_no', 50)->nullable();
            $table->text('notes')->nullable();
            $table->unique(['teacher_id', 'month', 'year']);
            $table->timestamps();
        });

        // Class Routines (Timetable)
        Schema::create('class_routines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('section_id')->nullable()->constrained('sections')->cascadeOnDelete();
            $table->string('day_of_week', 20);
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->time('start_time');
            $table->time('end_time');
            $table->string('room', 50)->nullable();
            $table->timestamps();
        });

        // Notices / Notice Board
        Schema::create('notices', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->text('content');
            $table->string('type', 50)->default('general');
            $table->string('target_roles', 255)->nullable();
            $table->date('published_date');
            $table->date('expires_date')->nullable();
            $table->boolean('is_published')->default(true);
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        // Certificates
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('type', 50);
            $table->string('certificate_no', 50)->unique();
            $table->date('issue_date');
            $table->text('content')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });

        // Student Documents (photos, files)
        Schema::create('student_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('type', 50);
            $table->string('original_name', 255);
            $table->string('path', 255);
            $table->unsignedInteger('size')->default(0);
            $table->string('mime_type', 100)->nullable();
            $table->timestamps();
        });

        // Communication logs
        Schema::create('communication_logs', function (Blueprint $table) {
            $table->id();
            $table->string('channel', 20);
            $table->string('recipient', 255);
            $table->string('subject', 255)->nullable();
            $table->text('message');
            $table->string('status', 30)->default('pending');
            $table->text('response')->nullable();
            $table->nullableMorphs('sendable');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communication_logs');
        Schema::dropIfExists('student_documents');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('notices');
        Schema::dropIfExists('class_routines');
        Schema::dropIfExists('salary_payments');
        Schema::dropIfExists('salary_structures');
    }
};
