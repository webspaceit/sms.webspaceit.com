<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Students - most frequently queried table
        Schema::table('students', function (Blueprint $table) {
            $table->index('class_id');
            $table->index('section_id');
            $table->index('academic_year_id');
            $table->index('guardian_phone');
            $table->index('status');
            $table->index(['class_id', 'section_id', 'roll_no']);
        });

        // Academic reports - result lookup
        Schema::table('academic_reports', function (Blueprint $table) {
            $table->index('exam_name');
            $table->index('academic_year');
        });

        // Fee collections
        Schema::table('fee_collections', function (Blueprint $table) {
            $table->index('student_id');
            $table->index('month');
            $table->index('status');
            $table->index(['student_id', 'month']);
        });

        // Attendances
        Schema::table('attendances', function (Blueprint $table) {
            $table->index('date');
            $table->index('status');
        });

        // Teachers
        Schema::table('teachers', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('department');
        });

        // Exams
        Schema::table('exams', function (Blueprint $table) {
            $table->index('academic_year_id');
            $table->index('name');
        });

        // Exam schedules
        Schema::table('exam_schedules', function (Blueprint $table) {
            $table->index('date');
        });

        // Notices
        Schema::table('notices', function (Blueprint $table) {
            $table->index('is_published');
            $table->index('published_date');
        });

        // Leave requests
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->index('teacher_id');
            $table->index('status');
        });

        // Book issues
        Schema::table('book_issues', function (Blueprint $table) {
            $table->index('book_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropIndex(['class_id']);
            $table->dropIndex(['section_id']);
            $table->dropIndex(['academic_year_id']);
            $table->dropIndex(['guardian_phone']);
            $table->dropIndex(['status']);
            $table->dropIndex(['class_id', 'section_id', 'roll_no']);
        });

        Schema::table('academic_reports', function (Blueprint $table) {
            $table->dropIndex(['exam_name']);
            $table->dropIndex(['academic_year']);
        });

        Schema::table('fee_collections', function (Blueprint $table) {
            $table->dropIndex(['student_id']);
            $table->dropIndex(['month']);
            $table->dropIndex(['status']);
            $table->dropIndex(['student_id', 'month']);
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->dropIndex(['date']);
            $table->dropIndex(['status']);
        });

        Schema::table('teachers', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['department']);
        });

        Schema::table('exams', function (Blueprint $table) {
            $table->dropIndex(['academic_year_id']);
            $table->dropIndex(['name']);
        });

        Schema::table('exam_schedules', function (Blueprint $table) {
            $table->dropIndex(['date']);
        });

        Schema::table('notices', function (Blueprint $table) {
            $table->dropIndex(['is_published']);
            $table->dropIndex(['published_date']);
        });

        Schema::table('leave_requests', function (Blueprint $table) {
            $table->dropIndex(['teacher_id']);
            $table->dropIndex(['status']);
        });

        Schema::table('book_issues', function (Blueprint $table) {
            $table->dropIndex(['book_id']);
            $table->dropIndex(['status']);
        });
    }
};
