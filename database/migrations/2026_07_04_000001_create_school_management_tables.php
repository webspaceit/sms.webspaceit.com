<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_id')->unique();
            $table->string('name');
            $table->string('name_bn')->nullable();
            $table->string('class_name');
            $table->string('section', 10);
            $table->unsignedSmallInteger('roll_no');
            $table->date('date_of_birth');
            $table->string('gender', 20);
            $table->string('guardian_name');
            $table->string('guardian_phone', 20);
            $table->string('district');
            $table->text('address')->nullable();
            $table->string('blood_group', 5)->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique();
            $table->string('name');
            $table->string('department');
            $table->string('designation');
            $table->string('phone', 20);
            $table->string('email')->nullable();
            $table->string('district');
            $table->date('joining_date');
            $table->timestamps();
        });

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->string('status', 20);
            $table->string('marked_by')->default('Class Teacher');
            $table->timestamps();
            $table->unique(['student_id', 'date']);
        });

        Schema::create('fee_collections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('invoice_no')->unique();
            $table->string('month');
            $table->unsignedInteger('amount');
            $table->string('status', 20);
            $table->date('due_date');
            $table->date('paid_on')->nullable();
            $table->string('payment_method')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fee_collections');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('teachers');
        Schema::dropIfExists('students');
    }
};
