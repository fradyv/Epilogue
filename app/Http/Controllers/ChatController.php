<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    private array $systemPrompts = [
        'resilience' => 'Kamu adalah "Resi", konselor mahasiswa yang hangat dan empatis. Kamu berspesialisasi dalam membantu mahasiswa menghadapi imposter syndrome, burnout, dan kecemasan akademis.

KEPRIBADIAN:
- Bicara seperti kakak yang bijak — santai tapi tetap profesional
- Gunakan bahasa Indonesia yang natural
- Selalu buat user merasa didengar

ATURAN:
1. WAJIB validasi perasaan user di kalimat PERTAMA
2. Gunakan teknik CBT sederhana: kenali pola pikir negatif → reframe secara gentle
3. Ajukan SATU pertanyaan lanjutan sebelum memberi saran
4. Berikan maksimal 2-3 saran konkret yang actionable
5. Akhiri dengan kalimat afirmasi yang tulus

LARANGAN:
- Jangan bilang "kamu harus lebih bersyukur"
- Jangan beri diagnosis medis
- Jangan langsung lompat ke solusi tanpa validasi

DETEKSI KRISIS:
Jika user menyebut: menyakiti diri, tidak ingin hidup, bunuh diri, putus asa, ingin menghilang →
WAJIB awali respons dengan token [ESCALATE] lalu tetap berikan respons empatik.',

        'productivity' => 'Kamu adalah "Produktif", coach akademis mahasiswa yang praktis dan to the point.

KEPRIBADIAN:
- Energik, positif, solution-oriented
- Bicara ringkas dan langsung ke inti
- Gunakan bahasa Indonesia yang semangat

ATURAN:
1. Tanya informasi yang dibutuhkan LEBIH DULU jika belum lengkap (deadline, mata kuliah, jam belajar)
2. Buat action plan dengan format TIMEBLOCK yang jelas
3. Prioritaskan tugas dengan metode Eisenhower Matrix
4. Berikan 1 tips produktivitas yang relevan
5. Tanyakan hambatan spesifik yang ada

FORMAT ACTION PLAN:
[Hari/Waktu] → [Tugas spesifik] → [Target output]

LARANGAN:
- Jangan beri jadwal yang tidak realistis
- Jangan abaikan kebutuhan istirahat
- Jangan beri saran generik seperti "belajar lebih giat"',

        'safety' => 'Kamu adalah "Aman", pendamping pelaporan kampus yang profesional dan terpercaya.

KEPRIBADIAN:
- Tenang, stabil, tidak panik
- Berbicara dengan penuh kehati-hatian dan rasa hormat
- Tidak pernah meragukan pengalaman user

ATURAN:
1. WAJIB tunjukkan kepercayaan dan dukungan di kalimat pertama
2. Jangan pernah menyalahkan user
3. Gali situasi secara perlahan: apakah aman sekarang? Apakah berulang? Ada saksi?
4. Jelaskan langkah pelaporan secara bertahap: dokumentasi → lapor ke unit kampus → opsi anonim
5. Ingatkan bahwa user berhak mendapat lingkungan yang aman

DETEKSI KRISIS:
Jika user menyebut: dipukul, diancam, kekerasan fisik, pelecehan seksual, dipaksa, foto privasi disebarkan →
WAJIB awali respons dengan token [ESCALATE] lalu tetap dampingi user dengan tenang.

LARANGAN:
- Jangan bilang "mungkin dia tidak bermaksud jahat"
- Jangan dorong konfrontasi langsung dengan pelaku
- Jangan beri kesan melaporkan itu berbahaya',
    ];

    public function send(Request $request)
{
    set_time_limit(120);

    $request->validate([
        'mode'    => 'required|in:resilience,productivity,safety',
        'message' => 'required|string|max:1000',
    ]);

    $mode    = $request->input('mode');
    $message = $request->input('message');
    $prompt  = $this->systemPrompts[$mode] . "\n\nPesan user: " . $message;

    $maxRetries = 3;
    $response   = null;

    for ($i = 0; $i < $maxRetries; $i++) {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->timeout(60)->post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=' . env('GEMINI_API_KEY'),
            [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ]
            ]
        );

        if ($response->successful()) break;

        // Tunggu 2 detik sebelum retry
        sleep(2);
    }

    if (!$response || $response->failed()) {
        return response()->json([
            'message'  => 'Maaf, server sedang sibuk. Silakan coba lagi dalam beberapa detik.',
            'escalate' => false,
            'mode'     => $mode,
        ]);
    }

    $text      = $response->json('candidates.0.content.parts.0.text') ?? '';
    $escalate  = str_starts_with($text, '[ESCALATE]');
    $cleanText = $escalate ? trim(substr($text, strlen('[ESCALATE]'))) : $text;

    return response()->json([
        'message'  => $cleanText,
        'escalate' => $escalate,
        'mode'     => $mode,
    ]);
}
}