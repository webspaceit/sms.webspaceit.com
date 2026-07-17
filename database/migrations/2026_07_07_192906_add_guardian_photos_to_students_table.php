<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('father_photo', 255)->nullable()->after('photo');
            $table->string('mother_photo', 255)->nullable()->after('father_photo');
            $table->string('guardian_photo', 255)->nullable()->after('mother_photo');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['father_photo', 'mother_photo', 'guardian_photo']);
        });
    }
};
