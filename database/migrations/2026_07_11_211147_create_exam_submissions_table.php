<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('online_exam_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->json('answers')->nullable();
            $table->integer('score')->nullable();
            $table->integer('total_marks')->default(0);
            $table->dateTime('submitted_at')->nullable();
            $table->timestamps();
            $table->unique(['online_exam_id', 'student_id'], 'exam_submission_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_submissions');
    }
};
