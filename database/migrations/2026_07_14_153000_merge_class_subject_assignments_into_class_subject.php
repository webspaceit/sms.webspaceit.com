<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Merge class_subject_assignments into class_subject (with default marks)
        DB::insert('
            INSERT IGNORE INTO class_subject (class_id, subject_id, full_marks, pass_marks, sort_order, created_at, updated_at)
            SELECT csa.class_id, csa.subject_id, 100, 33, 0, NOW(), NOW()
            FROM class_subject_assignments csa
        ');

        Schema::dropIfExists('class_subject_assignments');
    }

    public function down(): void
    {
        Schema::create('class_subject_assignments', function ($table) {
            $table->id();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->unique(['class_id', 'subject_id']);
            $table->timestamps();
        });

        // Restore data from class_subject (only class_id + subject_id pairs)
        DB::insert('
            INSERT IGNORE INTO class_subject_assignments (class_id, subject_id, created_at, updated_at)
            SELECT cs.class_id, cs.subject_id, NOW(), NOW()
            FROM class_subject cs
        ');
    }
};
