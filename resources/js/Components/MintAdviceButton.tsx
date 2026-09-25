import { useState } from 'react';
import { explorerTxUrl } from '@/lib/botChain.ts';
import { mintAdviceOnChain } from '@/lib/epilogueContract.ts';

interface Props {
    category: 'resilience' | 'productivity';
    content: string;
}

async function sha256Hex(text: string): Promise<string> {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export default function MintAdviceButton({ category, content }: Props) {
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!content.trim()) return null;

    const handleMint = async () => {
        setError(null);
        setLoading(true);
        try {
            const contentHash = await sha256Hex(content.trim());
            const hash = await mintAdviceOnChain(category, contentHash);
            setTxHash(hash);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Mint failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '8px' }}>
            <button
                type="button"
                disabled={loading || !!txHash}
                onClick={handleMint}
                style={{
                    background: 'transparent',
                    border: '1px solid rgba(74,97,40,0.35)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#4A6128',
                    cursor: loading || txHash ? 'default' : 'pointer',
                }}
            >
                {loading ? 'Minting…' : txHash ? 'Minted on-chain' : 'Mint this advice on-chain'}
            </button>
            {error && <p style={{ fontSize: '10px', color: '#8B4513', marginTop: '4px' }}>{error}</p>}
            {txHash && (
                <a
                    href={explorerTxUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', fontSize: '10px', marginTop: '4px', color: '#4A6128' }}
                >
                    View on explorer →
                </a>
            )}
        </div>
    );
}
