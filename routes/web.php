<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn() => inertia('Chat'));

Route::get('/chat/{mode}', function ($mode) {
    $allowed = ['resilience', 'productivity', 'safety'];
    if (!in_array($mode, $allowed)) abort(404);
    return inertia('Chat', ['mode' => $mode]);
});