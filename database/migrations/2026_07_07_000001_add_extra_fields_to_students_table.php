<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('category', 50)->nullable()->after('gender');
            $table->string('caste', 100)->nullable()->after('category');
            $table->string('mobile_number', 20)->nullable()->after('caste');
            $table->string('house', 50)->nullable()->after('blood_group');
            $table->decimal('height', 5, 2)->nullable()->after('house');
            $table->decimal('weight', 5, 2)->nullable()->after('height');
            $table->date('measurement_date')->nullable()->after('weight');
            $table->string('national_id', 50)->nullable()->after('medical_history');
            $table->string('local_id', 50)->nullable()->after('national_id');
            $table->string('note', 500)->nullable()->after('local_id');
            // Transport
            $table->foreignId('transport_route_id')->nullable()->constrained('transport_routes')->nullOnDelete()->after('note');
            $table->foreignId('transport_stop_id')->nullable()->constrained('transport_stops')->nullOnDelete()->after('transport_route_id');
            $table->string('fees_month', 20)->nullable()->after('transport_stop_id');
            // Hostel
            $table->foreignId('hostel_room_id')->nullable()->constrained('hostel_rooms')->nullOnDelete()->after('fees_month');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['transport_route_id']);
            $table->dropForeign(['transport_stop_id']);
            $table->dropForeign(['hostel_room_id']);
            $table->dropColumn([
                'category', 'caste', 'mobile_number', 'house', 'height', 'weight',
                'measurement_date', 'medical_history', 'national_id', 'local_id', 'note',
                'transport_route_id', 'transport_stop_id', 'fees_month', 'hostel_room_id',
            ]);
        });
    }
};
