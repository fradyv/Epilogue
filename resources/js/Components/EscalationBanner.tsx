import { useState } from 'react';
import { explorerTxUrl } from '@/lib/botChain.ts';
import { hashAndLogSafetyReport } from '@/lib/safetyReport.ts';

type ModeId = 'resilience' | 'productivity' | 'safety';

interface Props {
    mode: ModeId;
    /** User messages combined for SHA-256 hashing (Safety mode only). */
    reportText?: string;
}

interface Contact {
    label: string;
    hotline: string;
    desc: string;
}

export default function EscalationBanner({ mode, reportText = '' }: Props) {
    const [logging, setLogging] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const contacts: Record<ModeId, Contact | null> = {
        resilience: {
            label: 'Mental health counselor',
            hotline: '119 ext 8',
            desc: 'Into The Light Indonesia — available 24/7',
        },
        safety: {
            label: 'Campus reporting unit',
            hotline: 'Contact student affairs or your academic advisor',
            desc: 'Reports can be submitted anonymously',
        },
        productivity: null,
    };

    const contact = contacts[mode];
    if (!contact) return null;

    const canLogOnChain = mode === 'safety' && reportText.trim().length > 0;

    const handleLogOnChain = async () => {
        setError(null);
        setLogging(true);
        try {
            const hash = await hashAndLogSafetyReport(reportText.trim());
            setTxHash(hash);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Transaction failed.');
        } finally {
            setLogging(false);
        }
    };

    return (
        <div style={{
            background: '#6B2D2D',
            borderLeft: '4px solid #E8C4A0',
            borderRadius: '8px',
            padding: '14px 18px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
        }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>⚠️</span>
            <div style={{ flex: 1 }}>
                <p style={{
                    color: '#F5ECD7',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600, fontSize: '13px', margin: '0 0 4px',
                }}>
                    We noticed you may need additional support.
                </p>
                <p style={{
                    color: '#E8C4A0',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '12px', margin: '0 0 6px',
                }}>
                    {contact.label} — <strong>{contact.hotline}</strong>
                </p>
                <p style={{
                    color: '#C4A882',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px', margin: '0 0 10px',
                }}>
                    {contact.desc}
                </p>

                {mode === 'safety' && (
                    <>
                        <button
                            type="button"
                            disabled={!canLogOnChain || logging || !!txHash}
                            onClick={handleLogOnChain}
                            style={{
                                background: '#E8C4A0',
                                color: '#4A2010',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 14px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: !canLogOnChain || logging || txHash ? 'not-allowed' : 'pointer',
                                opacity: !canLogOnChain ? 0.5 : 1,
                            }}
                        >
                            {logging ? 'Confirm in MetaMask…' : txHash ? 'Report logged on-chain' : 'Log report on-chain (anonymous)'}
                        </button>
                        <p style={{
                            color: '#C4A882',
                            fontSize: '10px',
                            margin: '8px 0 0',
                            lineHeight: 1.4,
                        }}>
                            Only a cryptographic hash is stored on BOT Chain — not your raw message text.
                        </p>
                        {error && (
                            <p style={{ color: '#FFB4B4', fontSize: '11px', marginTop: '8px' }}>{error}</p>
                        )}
                        {txHash && (
                            <a
                                href={explorerTxUrl(txHash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    marginTop: '8px',
                                    color: '#F5ECD7',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                }}
                            >
                                View transaction on explorer →
                            </a>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
