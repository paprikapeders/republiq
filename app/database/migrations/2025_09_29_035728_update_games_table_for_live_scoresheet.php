<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            // Add live scoresheet columns
            $table->integer('current_quarter')->default(1)->after('away_score');
            $table->integer('time_remaining')->default(12 * 60)->after('current_quarter'); // in seconds
            $table->integer('team_a_fouls')->default(0)->after('time_remaining');
            $table->integer('team_b_fouls')->default(0)->after('team_a_fouls');
            $table->integer('team_a_timeouts')->default(6)->after('team_b_fouls');
            $table->integer('team_b_timeouts')->default(6)->after('team_a_timeouts');
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])->default('scheduled')->after('team_b_timeouts');
            
            // Rename columns to match new structure if they don't exist
            if (!Schema::hasColumn('games', 'team_a_id')) {
                $table->renameColumn('home_team_id', 'team_a_id');
            }
            if (!Schema::hasColumn('games', 'team_b_id')) {
                $table->renameColumn('away_team_id', 'team_b_id');
            }
            if (!Schema::hasColumn('games', 'team_a_score')) {
                $table->renameColumn('home_score', 'team_a_score');
            }
            if (!Schema::hasColumn('games', 'team_b_score')) {
                $table->renameColumn('away_score', 'team_b_score');
            }
            if (!Schema::hasColumn('games', 'date')) {
                $table->renameColumn('game_date', 'date');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn([
                'current_quarter',
                'time_remaining', 
                'team_a_fouls',
                'team_b_fouls',
                'team_a_timeouts',
                'team_b_timeouts',
                'status'
            ]);
        });
    }
};
