<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('class_subject_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->unique(['class_id', 'subject_id']);
            $table->timestamps();
        });

        // Migrate existing class_id data into pivot
        DB::insert('
            INSERT IGNORE INTO class_subject_assignments (class_id, subject_id, created_at, updated_at)
            SELECT class_id, id, NOW(), NOW() FROM subjects WHERE class_id IS NOT NULL
        ');

        Schema::table('subjects', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
            $table->dropColumn('class_id');
        });
    }

    public function down(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $table->foreignId('class_id')->nullable()->constrained('classes')->nullOnDelete()->after('id');
        });

        Schema::dropIfExists('class_subject_assignments');
    }
};
