<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Fee heads
        Schema::create('fee_heads', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('name_bn', 100)->nullable();
            $table->string('frequency', 30)->default('monthly');
            $table->boolean('is_optional')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Fee structure per class
        Schema::create('fee_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('fee_head_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('amount');
            $table->unique(['class_id', 'fee_head_id']);
            $table->timestamps();
        });

        // Enhanced fee_collections
        Schema::table('fee_collections', function (Blueprint $table) {
            $table->foreignId('fee_head_id')->nullable()->constrained('fee_heads')->nullOnDelete()->after('student_id');
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete()->after('fee_head_id');
            $table->text('remarks')->nullable()->after('payment_method');
        });
    }

    public function down(): void
    {
        Schema::table('fee_collections', function (Blueprint $table) {
            $table->dropForeign(['fee_head_id']);
            $table->dropForeign(['academic_year_id']);
            $table->dropColumn(['fee_head_id', 'academic_year_id', 'remarks']);
        });
        Schema::dropIfExists('fee_structures');
        Schema::dropIfExists('fee_heads');
    }
};
