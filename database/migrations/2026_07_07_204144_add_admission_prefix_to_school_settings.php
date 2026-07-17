<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('school_settings')->updateOrInsert(
            ['key' => 'admission_prefix'],
            ['value' => 'STU', 'updated_at' => now()]
        );
    }

    public function down(): void
    {
        DB::table('school_settings')->where('key', 'admission_prefix')->delete();
    }
};
