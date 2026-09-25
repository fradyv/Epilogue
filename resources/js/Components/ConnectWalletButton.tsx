import { Link, usePage } from '@inertiajs/react';
import { useState, type CSSProperties } from 'react';
import { connectWalletAndLogin } from '@/lib/walletAuth.ts';

type Variant = 'nav' | 'cta';

interface PageProps {
    auth: {
        wallet: string | null;
    };
}

interface Props {
    variant?: Variant;
    redirectTo?: string;
    label?: string;
}

export default function ConnectWalletButton({
    variant = 'nav',
    redirectTo = '/chat',
    label,
}: Props) {
    const { auth } = usePage<{ auth: PageProps['auth'] }>().props;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConnect = async () => {
        setError(null);
        setLoading(true);
        try {
            await connectWalletAndLogin(redirectTo);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Connection failed.');
        } finally {
            setLoading(false);
        }
    };

    if (auth.wallet) {
        if (variant === 'cta') {
            return (
                <Link
                    href="/chat"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: '#FCECD8',
                        color: '#6E3511',
                        border: '3px solid #6E3511',
                        borderRadius: '999px',
                        padding: '18px 56px',
                        fontFamily: "'Baloo 2', sans-serif",
                        fontSize: '20px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '5px 7px 0 0 #6E3511',
                    }}
                >
                    Open Chat
                    <img src="/images/logo-2.png" alt="" style={{ width: 26, height: 26 }} />
                </Link>
            );
        }

        return (
            <Link
                href="/chat"
                style={{
                    borderRadius: '999px',
                    padding: '10px 26px',
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '14px',
                    fontWeight: 800,
                    background: '#6E3511',
                    border: '2px solid #FCECD8',
                    color: '#FCECD8',
                    textDecoration: 'none',
                    display: 'inline-block',
                }}
            >
                Open Chat
            </Link>
        );
    }

    const navStyle: CSSProperties = {
        borderRadius: '999px',
        padding: '10px 26px',
        fontFamily: "'Nunito', sans-serif",
        fontSize: '14px',
        fontWeight: 800,
        cursor: loading ? 'wait' : 'pointer',
        background: '#6E3511',
        border: '2px solid #FCECD8',
        color: '#FCECD8',
    };

    const ctaStyle: CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        background: '#FCECD8',
        color: '#6E3511',
        border: '3px solid #6E3511',
        borderRadius: '999px',
        padding: '18px 56px',
        fontFamily: "'Baloo 2', sans-serif",
        fontSize: '20px',
        fontWeight: 700,
        cursor: loading ? 'wait' : 'pointer',
        boxShadow: '5px 7px 0 0 #6E3511',
    };

    return (
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: variant === 'cta' ? 'center' : 'flex-end', gap: 6 }}>
            <button
                type="button"
                onClick={handleConnect}
                disabled={loading}
                style={variant === 'cta' ? ctaStyle : navStyle}
            >
                {loading ? 'Connecting…' : (label ?? (variant === 'cta' ? 'Connect Wallet' : 'Connect Wallet'))}
            </button>
            {error && (
                <span style={{
                    fontSize: '12px',
                    color: variant === 'cta' ? '#6E3511' : '#FCECD8',
                    maxWidth: 280,
                    textAlign: variant === 'cta' ? 'center' : 'right',
                }}>
                    {error}
                </span>
            )}
        </div>
    );
}
