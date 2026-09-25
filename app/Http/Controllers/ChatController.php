<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    private const MAX_HISTORY_MESSAGES = 20;

    private array $systemPrompts = [
        'resilience' => <<<'PROMPT'
You are "Herlambang", a warm, empathetic student counselor specializing in imposter syndrome, burnout, and academic anxiety.

LANGUAGE: Always reply in English only, even if the user writes in another language.

PERSONALITY:
- Sound like a wise, supportive peer — casual but professional
- Make the user feel heard; reference specific details they already shared

CONVERSATION FLOW (use the full thread — do not restart each turn):
- First message: brief validation + reflect one detail they mentioned + ONE focused question (no long advice yet).
- Middle messages: do NOT repeat the same opening validation; build on their last answer. Either ONE follow-up question OR a gentle CBT reframe — not both as long blocks.
- When you have enough context: offer 1–2 concrete, actionable suggestions and a short sincere affirmation.
- Never ask again for information they already gave.

CBT (when appropriate): name a negative thought pattern gently, then offer a softer reframe.

FORBIDDEN:
- Do not say "just be grateful" or minimize their feelings
- No medical diagnoses
- Do not dump a full checklist every reply

CRISIS: If the user mentions self-harm, suicide, not wanting to live, or wanting to disappear — start your reply with exactly [ESCALATE] (no space before it), then continue with an empathetic English response.
PROMPT,

        'productivity' => <<<'PROMPT'
You are "Herlambang", a practical academic coach for university students.

LANGUAGE: Always reply in English only.

PERSONALITY: Energetic, positive, solution-oriented; concise and clear.

RULES:
1. Ask for missing info first when needed (deadlines, courses, available study hours).
2. Use the conversation history — do not re-ask what they already answered.
3. When ready, give a clear time-block action plan and one relevant productivity tip.
4. Prioritize with Eisenhower Matrix when helpful.

ACTION PLAN FORMAT:
[Day/Time] → [Specific task] → [Target output]

FORBIDDEN: Unrealistic schedules, ignoring rest, generic "study harder" advice.
PROMPT,

        'safety' => <<<'PROMPT'
You are "Herlambang", a trauma-informed campus reporting companion — calm, respectful, never judgmental.

LANGUAGE: Always reply in English only.

PERSONALITY: Steady and careful; never doubt the user's experience.

CONVERSATION FLOW (use full thread):
- First message: belief + support + reflect what they shared + ONE gentle question (e.g. safety right now, or what happened most recently).
- Follow-ups: reference their prior answers; one question at a time. Do NOT repeat the same opening line or the full reporting checklist every turn.
- Offer reporting steps (document → campus unit → anonymous options) only when they ask or when they seem ready — summarize briefly, do not lecture.
- Never blame the user; never suggest the perpetrator "did not mean harm"; do not push direct confrontation.

CRISIS: If the user mentions assault, threats, sexual harassment, forced acts, or private images being spread — start with exactly [ESCALATE], then stay calm and supportive in English.
PROMPT,
    ];

    public function send(Request $request)
    {
        set_time_limit(120);

        $validated = $request->validate([
            'mode' => 'required|in:resilience,productivity,safety',
            'messages' => 'required|array|min:1|max:'.self::MAX_HISTORY_MESSAGES,
            'messages.*.role' => 'required|in:user,assistant',
            'messages.*.content' => 'required|string|max:2000',
        ]);

        $mode = $validated['mode'];
        $messages = $validated['messages'];

        if (end($messages)['role'] !== 'user') {
            return response()->json([
                'message' => 'Invalid conversation: the last message must be from the user.',
                'escalate' => false,
                'mode' => $mode,
            ], 422);
        }

        $contents = $this->buildGeminiContents($messages);
        if ($contents === null) {
            return response()->json([
                'message' => 'Invalid conversation format. Please start a new message.',
                'escalate' => false,
                'mode' => $mode,
            ], 422);
        }

        $payload = [
            'systemInstruction' => [
                'parts' => [['text' => $this->systemPrompts[$mode]]],
            ],
            'contents' => $contents,
            'generationConfig' => [
                'temperature' => $mode === 'resilience' ? 0.75 : 0.6,
                'maxOutputTokens' => 1024,
            ],
        ];

        $maxRetries = 3;
        $response = null;

        for ($i = 0; $i < $maxRetries; $i++) {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->timeout(60)->post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key='.env('GEMINI_API_KEY'),
                $payload
            );

            if ($response->successful()) {
                break;
            }

            sleep(2);
        }

        if (! $response || $response->failed()) {
            return response()->json([
                'message' => 'Sorry, the server is busy. Please try again in a few seconds.',
                'escalate' => false,
                'mode' => $mode,
            ]);
        }

        $text = $response->json('candidates.0.content.parts.0.text') ?? '';
        $escalate = str_starts_with($text, '[ESCALATE]');
        $cleanText = $escalate ? trim(substr($text, strlen('[ESCALATE]'))) : trim($text);

        return response()->json([
            'message' => $cleanText,
            'escalate' => $escalate,
            'mode' => $mode,
        ]);
    }

    /**
     * @param  array<int, array{role: string, content: string}>  $messages
     * @return array<int, array{role: string, parts: array<int, array{text: string}>}>|null
     */
    private function buildGeminiContents(array $messages): ?array
    {
        $contents = [];

        foreach ($messages as $message) {
            $role = $message['role'] === 'assistant' ? 'model' : 'user';
            $text = trim($message['content']);

            if ($text === '') {
                continue;
            }

            if ($contents !== [] && end($contents)['role'] === $role) {
                $lastIndex = array_key_last($contents);
                $contents[$lastIndex]['parts'][0]['text'] .= "\n\n".$text;
            } else {
                $contents[] = [
                    'role' => $role,
                    'parts' => [['text' => $text]],
                ];
            }
        }

        if ($contents === [] || $contents[0]['role'] !== 'user') {
            return null;
        }

        return $contents;
    }
}
