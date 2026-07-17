<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('teacher_subject', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
        });

        Schema::table('teacher_subject', function (Blueprint $table) {
            $table->unsignedBigInteger('class_id')->nullable()->change();
        });

        Schema::table('teacher_subject', function (Blueprint $table) {
            $table->foreign('class_id')->references('id')->on('classes')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('teacher_subject', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
        });

        Schema::table('teacher_subject', function (Blueprint $table) {
            $table->unsignedBigInteger('class_id')->nullable(false)->change();
        });

        Schema::table('teacher_subject', function (Blueprint $table) {
            $table->foreign('class_id')->references('id')->on('classes')->cascadeOnDelete();
        });
    }
};
