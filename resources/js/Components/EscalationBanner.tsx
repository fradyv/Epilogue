type ModeId = 'resilience' | 'productivity' | 'safety';

interface Props {
    mode: ModeId;
}

interface Contact {
    label: string;
    hotline: string;
    desc: string;
}

export default function EscalationBanner({ mode }: Props) {
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
            <div>
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
                    fontSize: '11px', margin: 0,
                }}>
                    {contact.desc}
                </p>
            </div>
        </div>
    );
}
