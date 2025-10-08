<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('leagues', function (Blueprint $table) {
            $table->json('mvp_settings')->nullable()->after('description');
        });
    }

    public function down(): void {
        Schema::table('leagues', function (Blueprint $table) {
            $table->dropColumn('mvp_settings');
        });
    }
};