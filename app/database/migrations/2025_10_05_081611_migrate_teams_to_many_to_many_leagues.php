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
        // First, migrate existing team-league relationships to the pivot table
        $teams = DB::table('teams')->whereNotNull('league_id')->get();
        
        foreach ($teams as $team) {
            DB::table('league_team')->insert([
                'league_id' => $team->league_id,
                'team_id' => $team->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        
        // Remove the league_id foreign key constraint and column from teams table
        Schema::table('teams', function (Blueprint $table) {
            $table->dropForeign(['league_id']);
            $table->dropColumn('league_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Re-add league_id column to teams table
        Schema::table('teams', function (Blueprint $table) {
            $table->foreignId('league_id')->nullable()->constrained('leagues')->onDelete('set null');
        });
        
        // Migrate data back from pivot table to teams table (take first league for each team)
        $pivotData = DB::table('league_team')->get();
        
        foreach ($pivotData as $pivot) {
            // Only update if the team doesn't already have a league_id
            DB::table('teams')
                ->where('id', $pivot->team_id)
                ->whereNull('league_id')
                ->update(['league_id' => $pivot->league_id]);
        }
        
        // Clear the pivot table
        DB::table('league_team')->truncate();
    }
};
