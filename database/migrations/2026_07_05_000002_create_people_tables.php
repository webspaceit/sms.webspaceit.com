<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add role to users
        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 30)->default('admin')->after('email');
            $table->string('phone', 20)->nullable()->after('role');
            $table->boolean('is_active')->default(true)->after('phone');
        });

        // Guardians / Parents
        Schema::create('guardians', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('name_bn', 255)->nullable();
            $table->string('phone', 20);
            $table->string('email', 255)->nullable();
            $table->string('occupation', 100)->nullable();
            $table->string('relation', 50);
            $table->text('address')->nullable();
            $table->string('district', 100)->nullable();
            $table->string('nid', 50)->nullable();
            $table->timestamps();
        });

        // Student-Guardian pivot
        Schema::create('student_guardian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('guardian_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->unique(['student_id', 'guardian_id']);
            $table->timestamps();
        });

        // Enhance students table
        Schema::table('students', function (Blueprint $table) {
            $table->foreignId('class_id')->nullable()->constrained('classes')->nullOnDelete()->after('class_name');
            $table->foreignId('section_id')->nullable()->constrained('sections')->nullOnDelete()->after('class_id');
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete()->after('section_id');
            $table->string('mother_name', 255)->nullable()->after('name_bn');
            $table->string('mother_phone', 20)->nullable()->after('guardian_phone');
            $table->string('email', 255)->nullable()->after('mother_phone');
            $table->string('religion', 50)->nullable()->after('gender');
            $table->string('nationality', 50)->default('Bangladeshi')->after('religion');
            $table->string('birth_certificate_no', 50)->nullable()->after('nationality');
            $table->string('previous_school', 255)->nullable()->after('birth_certificate_no');
            $table->date('admission_date')->nullable()->after('previous_school');
            $table->string('photo', 255)->nullable()->after('admission_date');
        });

        // Teacher assignments
        Schema::create('teacher_subject', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_class_teacher')->default(false);
            $table->unique(['teacher_id', 'class_id', 'subject_id']);
            $table->timestamps();
        });

        // Enhance teachers
        Schema::table('teachers', function (Blueprint $table) {
            $table->string('gender', 20)->nullable()->after('district');
            $table->date('date_of_birth')->nullable()->after('gender');
            $table->string('blood_group', 5)->nullable()->after('date_of_birth');
            $table->string('address', 255)->nullable()->after('blood_group');
            $table->text('qualification')->nullable()->after('address');
            $table->unsignedInteger('experience_years')->default(0)->after('qualification');
            $table->string('photo', 255)->nullable()->after('experience_years');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete()->after('photo');
        });

        // Teacher attendance
        Schema::create('teacher_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->string('status', 20);
            $table->string('remarks', 255)->nullable();
            $table->unique(['teacher_id', 'date']);
            $table->timestamps();
        });

        // Leave requests
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->string('type', 50);
            $table->date('start_date');
            $table->date('end_date');
            $table->text('reason')->nullable();
            $table->string('status', 20)->default('pending');
            $table->text('admin_remarks')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
        Schema::dropIfExists('teacher_attendances');
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['gender', 'date_of_birth', 'blood_group', 'address', 'qualification', 'experience_years', 'photo', 'user_id']);
        });
        Schema::dropIfExists('teacher_subject');
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
            $table->dropForeign(['section_id']);
            $table->dropForeign(['academic_year_id']);
            $table->dropColumn(['class_id', 'section_id', 'academic_year_id', 'mother_name', 'mother_phone', 'email', 'religion', 'nationality', 'birth_certificate_no', 'previous_school', 'admission_date', 'photo']);
        });
        Schema::dropIfExists('student_guardian');
        Schema::dropIfExists('guardians');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone', 'is_active']);
        });
    }
};
