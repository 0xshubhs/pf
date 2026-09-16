import { ImageResponse } from 'next/og'

// Rendered once at build time and served as the site's OG card, so links
// shared on X / Discord / Telegram unfurl with a real preview.
export const alt = 'Shubham Tiwari — Blockchain Engineer & Security Researcher'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const RULE = '2px solid #0a0a0a'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          color: '#0a0a0a',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: RULE,
            padding: '24px 56px',
            fontSize: 20,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          <div>0xshubhs.eth</div>
          <div>blockchain engineer / security researcher</div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            padding: '0 56px',
          }}
        >
          {/* Satori needs an explicit display on any node with >1 child, and it
              has no <br> — so each line is its own flex row. */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 132,
              fontWeight: 700,
              lineHeight: 0.88,
              letterSpacing: -6,
              textTransform: 'uppercase',
            }}
          >
            <div style={{ display: 'flex' }}>Shubham</div>
            <div style={{ display: 'flex' }}>Tiwari</div>
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 32,
              fontSize: 24,
              color: '#565656',
              maxWidth: 820,
            }}
          >
            FHE &amp; ZK privacy engineering, custom EVM chains, smart-contract security.
          </div>
        </div>

        <div style={{ display: 'flex', borderTop: RULE }}>
          {[
            ['148', 'merged oss prs'],
            ['700+', 'commits'],
            ['6', 'hackathon wins'],
            ['22', 'languages shipped'],
          ].map(([value, label], i) => (
            <div
              key={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: '24px 32px',
                borderLeft: i === 0 ? 'none' : RULE,
              }}
            >
              <div style={{ fontSize: 46, fontWeight: 700 }}>{value}</div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 15,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: '#565656',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
