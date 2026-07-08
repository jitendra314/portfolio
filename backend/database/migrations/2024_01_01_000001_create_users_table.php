<?php
// =========================================================
// Run: php artisan migrate --seed
// Each migration is a separate file in database/migrations/
// Shown here combined for reference — split them per the
// naming convention: YYYY_MM_DD_HHMMSS_create_xxx_table.php
// =========================================================

// --- 2024_01_01_000001_create_users_table.php ---
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('avatar')->nullable();
            $table->boolean('is_admin')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('users'); }
};
