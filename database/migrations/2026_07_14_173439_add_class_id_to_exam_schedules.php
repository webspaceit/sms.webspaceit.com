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
        Schema::table('exam_schedules', function (Blueprint $table) {
            $table->dropUnique(['exam_id', 'subject_id']);
        });

        Schema::table('exam_schedules', function (Blueprint $table) {
            $table->foreignId('class_id')->nullable()->constrained()->cascadeOnDelete()->after('exam_id');
            $table->unique(['exam_id', 'class_id', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::table('exam_schedules', function (Blueprint $table) {
            $table->dropUnique(['exam_id', 'class_id', 'subject_id']);
        });

        Schema::table('exam_schedules', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
            $table->dropColumn('class_id');
            $table->unique(['exam_id', 'subject_id']);
        });
    }
};
