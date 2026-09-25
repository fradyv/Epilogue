<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SafetyReportController extends Controller
{
    public function hash(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'report_text' => 'required|string|min:1|max:8000',
        ]);

        $reportHash = hash('sha256', $validated['report_text']);

        return response()->json([
            'reportHash' => $reportHash,
        ]);
    }
}
