import { ImageResponse } from 'next/og'

// Rendered once at build time and served as the site's OG card, so links
// shared on X / Discord / Telegram unfurl with a real preview.
export const alt = 'Shubham Tiwari — Blockchain Engineer & Security Researcher'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #121218 0%, #1a1a24 60%, #241a14 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: '#FD9745',
            }}
          />
          <div style={{ fontSize: 30, color: '#FD9745', letterSpacing: 2 }}>
            0xshubhs.com
          </div>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          Shubham Tiwari
        </div>
        <div style={{ marginTop: 18, fontSize: 38, color: '#d1d5db' }}>
          Blockchain Engineer &amp; Security Researcher
        </div>
        <div
          style={{
            marginTop: 44,
            display: 'flex',
            gap: 14,
            fontSize: 26,
            color: '#e5e7eb',
          }}
        >
          {['FHE', 'ZK', 'EVM Chains', 'Audits', 'DeFi'].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '10px 26px',
                borderRadius: 999,
                border: '1px solid rgba(253,151,69,0.45)',
                background: 'rgba(253,151,69,0.10)',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 44, fontSize: 26, color: '#9ca3af' }}>
          Lead engineer on a production RWA exchange · 148 merged OSS PRs · 6 hackathon wins
        </div>
      </div>
    ),
    { ...size }
  )
}
