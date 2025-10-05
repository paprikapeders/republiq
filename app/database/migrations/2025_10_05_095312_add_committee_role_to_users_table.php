<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add committee to the role enum
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'coach', 'player', 'referee', 'committee') DEFAULT 'player'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove committee from the role enum
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'coach', 'player', 'referee') DEFAULT 'player'");
    }
};
