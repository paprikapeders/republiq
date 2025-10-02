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
        Schema::table('leagues', function (Blueprint $table) {
            if (!Schema::hasColumn('leagues', 'start_date')) {
                $table->date('start_date')->nullable()->after('year');
            }
            if (!Schema::hasColumn('leagues', 'end_date')) {
                $table->date('end_date')->nullable()->after('start_date');
            }
            if (!Schema::hasColumn('leagues', 'description')) {
                $table->text('description')->nullable()->after('end_date');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leagues', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'end_date', 'description']);
        });
    }
};
