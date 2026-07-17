<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['bank_account_number', 'bank_name', 'ifsc_code', 'rte']);
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('bank_account_number', 50)->nullable();
            $table->string('bank_name', 100)->nullable();
            $table->string('ifsc_code', 20)->nullable();
            $table->boolean('rte')->default(false);
        });
    }
};
