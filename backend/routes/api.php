<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\BlogController;

Route::prefix('v1')->group(function () {

    // ── Auth ──────────────────────────────────────────────
    Route::post('/auth/login',   [AuthController::class, 'login']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // ── Public portfolio endpoints ─────────────────────────
    Route::get('/projects',           [ProjectController::class, 'index']);
    Route::get('/projects/{slug}',    [ProjectController::class, 'show']);
    Route::get('/skills',             [SkillController::class, 'index']);
    Route::get('/experiences',        [ExperienceController::class, 'index']);
    Route::get('/about',              [AboutController::class, 'show']);
    Route::get('/testimonials',       [TestimonialController::class, 'index']);
    Route::get('/settings',           [SettingsController::class, 'public']);
    Route::get('/blog',               [BlogController::class, 'index']);
    Route::get('/blog/{slug}',        [BlogController::class, 'show']);
    Route::post('/contact',           [ContactController::class, 'store']);

    // ── Protected admin routes ─────────────────────────────
    Route::middleware('auth:api')->group(function () {

        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me',      [AuthController::class, 'me']);

        // Profile
        Route::put('/admin/profile',          [\App\Http\Controllers\Admin\ProfileController::class, 'update']);
        Route::put('/admin/profile/password', [\App\Http\Controllers\Admin\ProfileController::class, 'changePassword']);

        // Projects
        Route::apiResource('admin/projects', \App\Http\Controllers\Admin\ProjectController::class);
        Route::patch('/admin/projects/{id}/toggle', [\App\Http\Controllers\Admin\ProjectController::class, 'toggleFeatured']);

        // Skills
        Route::apiResource('admin/skills', \App\Http\Controllers\Admin\SkillController::class);

        // Experiences
        Route::apiResource('admin/experiences', \App\Http\Controllers\Admin\ExperienceController::class);

        // Testimonials
        Route::apiResource('admin/testimonials', \App\Http\Controllers\Admin\TestimonialController::class);

        // Blog
        Route::apiResource('admin/blog', \App\Http\Controllers\Admin\BlogController::class);

        // About
        Route::get('/admin/about', [\App\Http\Controllers\Admin\AboutController::class, 'show']);
        Route::put('/admin/about', [\App\Http\Controllers\Admin\AboutController::class, 'update']);

        // Settings
        Route::get('/admin/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index']);
        Route::put('/admin/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update']);

        // Contacts
        Route::get('/admin/contacts',              [\App\Http\Controllers\Admin\ContactController::class, 'index']);
        Route::patch('/admin/contacts/{id}/read',  [\App\Http\Controllers\Admin\ContactController::class, 'markRead']);
        Route::delete('/admin/contacts/{id}',      [\App\Http\Controllers\Admin\ContactController::class, 'destroy']);

        // Dashboard stats
        Route::get('/admin/stats', [\App\Http\Controllers\Admin\DashboardController::class, 'stats']);

        // Media upload
        Route::post('/admin/upload', [\App\Http\Controllers\Admin\MediaController::class, 'upload']);
    });
});
