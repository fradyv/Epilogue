import { postJson } from '@/lib/http.ts';
import { logSafetyReportOnChain } from '@/lib/epilogueContract.ts';

export async function hashAndLogSafetyReport(reportText: string): Promise<string> {
    const response = await postJson('/safety/hash', { report_text: reportText });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
            typeof data.message === 'string' ? data.message : 'Could not hash report on server.',
        );
    }

    const { reportHash } = await response.json() as { reportHash: string };

    return logSafetyReportOnChain(reportHash, true);
}
