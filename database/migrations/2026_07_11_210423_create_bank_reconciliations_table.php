<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_reconciliations', function (Blueprint $table) {
            $table->id();
            $table->string('account_name');
            $table->string('account_number')->nullable();
            $table->date('statement_date');
            $table->decimal('ending_balance', 12, 2);
            $table->decimal('cleared_balance', 12, 2);
            $table->decimal('difference', 12, 2);
            $table->enum('status', ['pending', 'cleared', 'discrepancy'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_reconciliations');
    }
};
