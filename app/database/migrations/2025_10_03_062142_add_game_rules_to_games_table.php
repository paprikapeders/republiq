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
            $table->integer('total_quarters')->default(4);
            $table->integer('minutes_per_quarter')->default(12);
            $table->integer('timeouts_per_quarter')->default(2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['total_quarters', 'minutes_per_quarter', 'timeouts_per_quarter']);
        });
    }
};
