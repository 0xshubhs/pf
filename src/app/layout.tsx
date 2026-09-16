import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import ClientShell from '@/components/client-shell'
import './assets/favicon.ico'

// One face for the whole site. 400 for body, 500 for labels, 700 for headings.
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.0xshubhs.com'),
  title: 'Shubham Tiwari — Blockchain Engineer & Security Researcher',
  description:
    'FHE & ZK privacy engineering, custom EVM chains, and smart-contract security. Lead engineer on a production RWA exchange · 148 merged OSS PRs · 6 hackathon wins.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.jpg',
    shortcut: '/icon.jpg',
    apple: '/icon.jpg',
  },
  openGraph: {
    title: 'Shubham Tiwari — Blockchain Engineer & Security Researcher',
    description:
      'FHE & ZK privacy engineering, custom EVM chains, and smart-contract security research.',
    url: 'https://www.0xshubhs.com',
    siteName: '0xshubhs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@shubhamtwtt',
    title: 'Shubham Tiwari — Blockchain Engineer & Security Researcher',
    description:
      'FHE & ZK privacy engineering, custom EVM chains, and smart-contract security research.',
  },
}

// Declaring both schemes opts the page out of Chromium/Brave "Auto Dark Mode",
// which otherwise force-darkens backgrounds and ignores our own theme toggle.
export const viewport: Viewport = {
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          The theme must follow the OS on every load, not just the first visit.
          next-themes persists whatever you last picked and replays it, so the
          stored value is dropped here — in <head>, before next-themes' own
          blocking script reads it. Clearing it later (in an effect) would mean
          painting the stale theme first and visibly snapping to the system one.
          Toggling still works; it just doesn't outlive the page.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{localStorage.removeItem('theme')}catch(e){}`,
          }}
        />
      </head>
      <body className={`${mono.variable} font-mono antialiased`}>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
