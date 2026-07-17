<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->boolean('present')->default(false);
            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->unique(['exam_id', 'student_id', 'subject_id'], 'exam_attendance_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_attendances');
    }
};
