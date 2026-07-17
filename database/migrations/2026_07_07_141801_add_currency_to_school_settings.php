<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('school_settings')->updateOrInsert(
            ['key' => 'currency'],
            ['value' => 'BDT', 'updated_at' => now()]
        );
    }

    public function down(): void
    {
        DB::table('school_settings')->where('key', 'currency')->delete();
    }
};
