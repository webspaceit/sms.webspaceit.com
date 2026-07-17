<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Library - Books
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->string('author', 255)->nullable();
            $table->string('publisher', 255)->nullable();
            $table->string('isbn', 50)->nullable()->unique();
            $table->string('edition', 50)->nullable();
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedInteger('available')->default(1);
            $table->string('shelf_location', 50)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Book Issues
        Schema::create('book_issues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();
            $table->morphs('issuable');
            $table->date('issue_date');
            $table->date('due_date');
            $table->date('return_date')->nullable();
            $table->unsignedInteger('fine')->default(0);
            $table->string('status', 30)->default('issued');
            $table->timestamps();
        });

        // Transport Routes
        Schema::create('transport_routes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('driver_name', 255)->nullable();
            $table->string('driver_phone', 20)->nullable();
            $table->string('vehicle_no', 50)->nullable();
            $table->unsignedInteger('fare')->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Transport Stops
        Schema::create('transport_stops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transport_route_id')->constrained('transport_routes')->cascadeOnDelete();
            $table->string('name', 255);
            $table->time('pickup_time')->nullable();
            $table->time('drop_time')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Student Transport Assignments
        Schema::create('student_transport', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('transport_route_id')->constrained('transport_routes')->cascadeOnDelete();
            $table->foreignId('transport_stop_id')->nullable()->constrained('transport_stops')->nullOnDelete();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unique(['student_id', 'transport_route_id']);
            $table->timestamps();
        });

        // Hostel Rooms
        Schema::create('hostel_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_no', 20)->unique();
            $table->string('type', 50);
            $table->unsignedTinyInteger('capacity')->default(4);
            $table->unsignedInteger('rent_per_bed');
            $table->text('facilities')->nullable();
            $table->timestamps();
        });

        // Hostel Allocations
        Schema::create('hostel_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('hostel_room_id')->constrained('hostel_rooms')->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unique(['student_id', 'hostel_room_id', 'start_date']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hostel_allocations');
        Schema::dropIfExists('hostel_rooms');
        Schema::dropIfExists('student_transport');
        Schema::dropIfExists('transport_stops');
        Schema::dropIfExists('transport_routes');
        Schema::dropIfExists('book_issues');
        Schema::dropIfExists('books');
    }
};
