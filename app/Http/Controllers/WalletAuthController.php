<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class WalletAuthController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'wallet_address' => ['required', 'string', 'regex:/^0x[a-fA-F0-9]{40}$/'],
        ]);

        $address = strtolower($validated['wallet_address']);

        $user = User::firstOrCreate(
            ['wallet_address' => $address],
            [
                'name' => 'Epilogue User',
                'email' => $address.'@wallet.epilogue',
                'password' => Str::password(64),
            ]
        );

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return response()->json([
            'wallet_address' => $user->wallet_address,
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['ok' => true]);
    }
}
