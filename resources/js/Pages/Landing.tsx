import { Link } from '@inertiajs/react';
import ConnectWalletButton from '@/Components/ConnectWalletButton.tsx';

const C = {
    cream:     '#FCECD8',
    sage:      '#91AC67',
    olive:     '#597928',
    brown:     '#6E3511',
};

const FONT_HEAD = "'Baloo 2', sans-serif";
const FONT_BODY = "'Nunito', sans-serif";

const STEPS = [
    {
        num: '1.',
        title: 'Set Up Your Web3 Identity',
        body: "Epilogue doesn't ask for your email or password. Your privacy is our top priority! Simply use a Web3 Wallet like MetaMask as your 100% secure ad anonymous gateway.",
        img: '/images/herlambang-1.png',
        imgLeft: false,
        imgH: 360,
    },
    {
        num: '2.',
        title: 'Connect to BOT Chain',
        body: 'To ensure our Smart Contracts run seamlessly, make sure your wallet is connected to the BOT Chain network. This step guarantees that your chat room is fully decentralized and belongs solely to you.',
        img: '/images/herlambang-2.png',
        imgLeft: true,
        imgH: 360,
    },
    {
        num: '3.',
        title: 'Verify & Meet Herlambang!',
        body: "Click the register or login button and approve the signature request in your wallet. It's fast and requires zero gas fees. Once verified, you'll instantly enter your private space to start chatting with Herlambang!",
        img: '/images/herlambang-3.png',
        imgLeft: false,
        imgH: 460,
    },
];

function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/** Cream-fill / brown-outline "sticker" text used on colored panels. */
function outlinedText(strokeColor: string, fillColor: string, strokeWidth = '1.5px') {
    return {
        color: fillColor,
        WebkitTextStroke: `${strokeWidth} ${strokeColor}`,
        paintOrder: 'stroke fill' as const,
    };
}

function NavPill({
    label,
    onClick,
    href,
    variant = 'outline',
}: {
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: 'outline' | 'solid';
}) {
    const style: React.CSSProperties = {
        borderRadius: '999px',
        padding: '10px 26px',
        fontFamily: FONT_BODY,
        fontSize: '14px',
        fontWeight: 800,
        cursor: 'pointer',
        transition: 'transform 0.12s, opacity 0.15s',
        textDecoration: 'none',
        display: 'inline-block',
        ...(variant === 'outline'
            ? { background: C.cream, border: `2px solid ${C.brown}`, color: C.brown }
            : { background: C.brown, border: `2px solid ${C.cream}`, color: C.cream }),
    };
    const handlers = {
        onMouseEnter: (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.transform = 'translateY(-1px)'),
        onMouseLeave: (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.transform = 'translateY(0)'),
    };
    if (href) {
        return <Link href={href} style={style} {...handlers}>{label}</Link>;
    }
    return <button onClick={onClick} style={style} {...handlers}>{label}</button>;
}

function CharacterImg({ src, alt, maxH = 280 }: { src: string; alt: string; maxH?: number }) {
    return (
        <img
            src={src}
            alt={alt}
            style={{
                maxHeight: maxH,
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.2))',
                display: 'block',
            }}
        />
    );
}

export default function Landing() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                html { scroll-behavior: smooth; }
                body { background: ${C.cream}; }
            `}</style>

            <div style={{ background: C.cream, minHeight: '100vh', fontFamily: FONT_BODY, overflowX: 'hidden' }}>

                {/* ── Header + Hero (full-bleed olive panel with wave transition) ── */}
                <div style={{ position: 'relative' }}>
                    {/* decorative wave shapes forming the curved bottom edge */}
                    <img
                        src="/images/wave-1.png"
                        alt=""
                        aria-hidden
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'bottom', zIndex: 0, pointerEvents: 'none' }}
                    />
                    <img
                        src="/images/wave-2.png"
                        alt=""
                        aria-hidden
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '96%', objectFit: 'cover', objectPosition: 'bottom', zIndex: 1, pointerEvents: 'none' }}
                    />

                    <div style={{ position: 'relative', zIndex: 2 }}>
                        {/* ── Navbar ── */}
                        <header style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '24px 56px', flexWrap: 'wrap', gap: '16px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img src="/images/logo.png" alt="Epilogue" style={{ height: 52, width: 'auto' }} />
                                <img src="/images/epilogue.png" alt="epilogue" style={{ height: 30 }} />
                            </div>

                            <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <NavPill label="about us" onClick={() => scrollTo('about')} />
                                <NavPill label="how it works" onClick={() => scrollTo('how-it-works')} />
                                <ConnectWalletButton variant="nav" />
                            </nav>
                        </header>

                        {/* ── Hero content ── */}
                        <section style={{ padding: '10px 56px 170px' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '40px',
                                maxWidth: 1100, margin: '0 auto', flexWrap: 'wrap',
                            }}>
                                <div style={{ flex: '0 0 38%', display: 'flex', justifyContent: 'center', minWidth: 240 }}>
                                    <CharacterImg src="/images/herlambang-tree.png" alt="Herlambang peeking from a tree" maxH={340} />
                                </div>

                                <div style={{ flex: 1, minWidth: 280 }}>
                                    <h1 style={{
                                        fontFamily: FONT_HEAD,
                                        fontSize: 'clamp(34px, 4.5vw, 50px)',
                                        fontWeight: 800,
                                        lineHeight: 1.1,
                                        marginBottom: '20px',
                                        ...outlinedText(C.brown, C.cream, '2px'),
                                    }}>
                                        Your <span style={{ color: C.brown, WebkitTextStroke: 0 }}>AI</span> Companion
                                    </h1>

                                    <p style={{
                                        color: C.cream, fontSize: '16px', fontWeight: 600, lineHeight: 1.75,
                                        maxWidth: 440, marginBottom: '32px', opacity: 0.95,
                                    }}>
                                        Epilogue is here to accompany your journey. Powered by Gemini AI
                                        and secured by Smart Contract technology,{' '}
                                        <span style={{ color: C.brown, fontWeight: 800 }}>Herlambang</span>
                                        {' '}is ready to support you anytime.
                                    </p>

                                    <button
                                        onClick={() => scrollTo('about')}
                                        style={{
                                            background: C.cream,
                                            color: C.brown,
                                            border: `3px solid ${C.brown}`,
                                            borderRadius: '999px',
                                            padding: '16px 36px',
                                            fontFamily: FONT_HEAD,
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            boxShadow: `5px 7px 0 0 ${C.brown}`,
                                            transition: 'transform 0.1s',
                                        }}
                                        onMouseDown={e => (e.currentTarget.style.transform = 'translate(3px, 4px)')}
                                        onMouseUp={e => (e.currentTarget.style.transform = 'translate(0,0)')}
                                    >
                                        get to know us more
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* ── About Us ── */}
                <section id="about" style={{ padding: '70px 48px 120px', maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ background: C.sage, borderRadius: '28px', padding: '36px 48px 48px 28px' }}>
                        <h2 style={{
                            fontFamily: FONT_HEAD, fontSize: '32px', fontWeight: 800,
                            marginBottom: '24px',
                            ...outlinedText(C.brown, C.cream, '1.5px'),
                        }}>
                            About Us
                        </h2>

                        <div style={{
                            background: C.brown,
                            borderRadius: '22px',
                            padding: '44px 44px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '32px',
                            flexWrap: 'wrap',
                        }}>
                            <div style={{
                                flex: '0 0 30%', minWidth: 200, display: 'flex', justifyContent: 'center',
                                marginTop: '-56px', marginBottom: '-30px',
                            }}>
                                <CharacterImg src="/images/herlambang-hi.png" alt="Herlambang waving" maxH={320} />
                            </div>

                            <div style={{ flex: 1, minWidth: 260 }}>
                                <h3 style={{
                                    fontFamily: FONT_HEAD, fontSize: '28px', fontWeight: 800,
                                    marginBottom: '16px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px',
                                }}>
                                    <span style={{ color: C.olive }}>Meet</span>
                                    <span style={{
                                        background: C.olive, color: C.cream,
                                        padding: '4px 18px', borderRadius: '12px', display: 'inline-block',
                                    }}>
                                        Herlambang!
                                    </span>
                                </h3>
                                <p style={{ color: C.cream, fontSize: '15px', fontWeight: 600, lineHeight: 1.75, opacity: 0.95 }}>
                                    We are a Decentralized App (DApp) personal assistant focused entirely
                                    on your well-being. Together with Herlambang, the little fox who is
                                    always ready to listen, Epilogue is designed to build your mental
                                    resilience, boost your productivity, and keep your personal stories
                                    strictly confidential using blockchain technology.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── How it Works ── */}
                <section id="how-it-works" style={{ padding: '40px 48px 130px', maxWidth: 1100, margin: '0 auto' }}>
                    <h2 style={{
                        fontFamily: FONT_HEAD, fontSize: '34px', fontWeight: 800,
                        color: C.brown, textAlign: 'center', marginBottom: '70px',
                    }}>
                        How it Works
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
                        {STEPS.map(step => (
                            <div key={step.num} style={{ position: 'relative' }}>
                                <span style={{
                                    position: 'absolute',
                                    top: '-34px',
                                    [step.imgLeft ? 'right' : 'left']: '20px',
                                    fontFamily: FONT_HEAD,
                                    fontSize: '58px',
                                    fontWeight: 800,
                                    transform: `rotate(${step.imgLeft ? 6 : -6}deg)`,
                                    zIndex: 3,
                                    ...outlinedText(C.brown, C.cream, '2.5px'),
                                }}>
                                    {step.num}
                                </span>

                                <div style={{
                                    background: C.olive,
                                    borderRadius: '22px',
                                    padding: '40px 44px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '28px',
                                    flexWrap: 'wrap',
                                    flexDirection: step.imgLeft ? 'row-reverse' : 'row',
                                    boxShadow: `0 14px 0 0 ${C.brown}`,
                                }}>
                                    <div style={{ flex: 1, minWidth: 260 }}>
                                        <h4 style={{
                                            fontFamily: FONT_HEAD, fontSize: '24px', fontWeight: 800,
                                            color: C.cream, marginBottom: '12px',
                                        }}>
                                            {step.title}
                                        </h4>
                                        <p style={{
                                            color: C.cream, fontSize: '15px', fontWeight: 600,
                                            lineHeight: 1.7, opacity: 0.95, maxWidth: 440,
                                        }}>
                                            {step.body}
                                        </p>
                                    </div>

                                    <div style={{
                                        flex: `0 0 ${step.imgH + 20}px`, display: 'flex', justifyContent: 'center',
                                        alignSelf: 'flex-end', marginBottom: `${-Math.round(step.imgH * 0.2)}px`,
                                    }}>
                                        <CharacterImg src={step.img} alt={step.title} maxH={step.imgH} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA ── */}
                <section style={{ padding: '0 48px 100px', maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{
                        background: C.sage,
                        borderRadius: '28px',
                        padding: '52px 44px',
                        textAlign: 'center',
                        boxShadow: `10px 12px 0 0 ${C.olive}`,
                    }}>
                        <h2 style={{
                            fontFamily: FONT_HEAD,
                            fontSize: 'clamp(24px, 3.5vw, 34px)',
                            fontWeight: 800, marginBottom: '14px',
                            ...outlinedText(C.cream, C.brown, '2px'),
                        }}>
                            Ready to start a better new chapter?
                        </h2>
                        <p style={{
                            color: C.cream, fontSize: '15px', fontWeight: 700, opacity: 0.95,
                            marginBottom: '32px', lineHeight: 1.6,
                        }}>
                            Connect your wallet now and let Herlambang be your trusted companion today.
                        </p>

                        <ConnectWalletButton variant="cta" label="Get Started" />
                    </div>
                </section>

                {/* ── Footer (blur glow sits below the CTA card, moderately sized) ── */}
                <footer style={{ position: 'relative', padding: '50px 48px 110px', overflow: 'hidden' }}>
                    <img
                        src="/images/blur-background.png"
                        alt=""
                        aria-hidden
                        style={{
                            position: 'absolute',
                            top: '0px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '640px',
                            maxWidth: '85%',
                            zIndex: 0,
                            pointerEvents: 'none',
                        }}
                    />

                    <div style={{
                        position: 'relative', zIndex: 1,
                        maxWidth: 1100, margin: '0 auto',
                        paddingTop: '60px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: '20px',
                    }}>
                        <a
                            href="https://botchain.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: C.brown,
                                borderRadius: '999px',
                                padding: '10px 22px',
                                display: 'flex', alignItems: 'center',
                                textDecoration: 'none',
                            }}
                        >
                            <img src="/images/scan-bot-chain-logo.png" alt="BOT" style={{ height: 22 }} />
                        </a>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src="/images/logo.png" alt="" style={{ height: 40 }} />
                            <img src="/images/epilogue.png" alt="epilogue" style={{ height: 32 }} />
                        </div>

                        <a
                            href="https://scan.botchain.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: C.brown,
                                borderRadius: '999px',
                                padding: '10px 22px',
                                display: 'flex', alignItems: 'center',
                                textDecoration: 'none',
                            }}
                        >
                            <img src="/images/bot-chain-logo.png" alt="BOT Chain" style={{ height: 22 }} />
                        </a>
                    </div>
                </footer>
            </div>
        </>
    );
}
