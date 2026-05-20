<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BidController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\JobCategoryController;
use App\Http\Controllers\Api\JobController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public auth — throttled to slow down brute-force attempts.
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('auth/register', [AuthController::class, 'register']);
        Route::post('auth/login',    [AuthController::class, 'login']);
    });

    // Public catalog
    Route::get('categories', [JobCategoryController::class, 'index']);
    Route::get('jobs',           [JobController::class, 'index'])->name('jobs.index');
    Route::get('jobs/{slug}',    [JobController::class, 'show'])->name('jobs.show');

    // Protected
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('auth/me',     [AuthController::class, 'me']);
        Route::post('auth/logout', [AuthController::class, 'logout']);

        Route::post('jobs/{slug}/bids', [BidController::class, 'store'])->name('bids.store');

        Route::get('me/bids',        [BidController::class, 'myBids'])->name('bids.mine');
        Route::get('me/bids/{bid}',  [BidController::class, 'show']);
        Route::delete('me/bids/{bid}', [BidController::class, 'destroy']);

        Route::get('me/dashboard',    [DashboardController::class, 'stats']);
    });
});
