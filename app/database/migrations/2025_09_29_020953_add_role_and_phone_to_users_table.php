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
        Schema::table('users', function (Blueprint $table) {
            // Add phone field
            $table->string('phone')->nullable();
            
            // Update role enum to include referee
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'coach', 'player', 'referee') DEFAULT 'player'");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('phone');
            
            // Revert role enum to original values
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'coach', 'player') DEFAULT 'player'");
        });
    }
};
