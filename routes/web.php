<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\SafetyReportController;
use App\Http\Controllers\WalletAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => inertia('Landing'));

Route::post('/auth/wallet', [WalletAuthController::class, 'store']);
Route::post('/auth/logout', [WalletAuthController::class, 'destroy'])->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::get('/chat', fn () => inertia('Chat'));

    Route::get('/chat/{mode}', function ($mode) {
        $allowed = ['resilience', 'productivity', 'safety'];
        if (! in_array($mode, $allowed)) {
            abort(404);
        }

        return inertia('Chat', ['mode' => $mode]);
    });

    Route::post('/chat/send', [ChatController::class, 'send']);
    Route::post('/safety/hash', [SafetyReportController::class, 'hash']);
});
