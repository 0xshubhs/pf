import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import ClientShell from '@/components/client-shell'
import './assets/favicon.ico'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })

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
};

// Declaring both schemes opts the page out of Chromium/Brave "Auto Dark Mode",
// which otherwise force-darkens backgrounds and ignores our own theme toggle.
export const viewport: Viewport = {
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} ${inter.className}`}>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}