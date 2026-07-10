import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import ClientShell from '@/components/client-shell'
import './assets/favicon.ico'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })

export const metadata: Metadata = {
  title: 'Shubham Tiwari <Console Nerd>',
  description: 'Proof of Work is the proof of time spent on work.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.jpg',
    shortcut: '/icon.jpg',
    apple: '/icon.jpg',
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