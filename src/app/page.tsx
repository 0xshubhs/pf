'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import memeImage from './assets/itachi.gif'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, FileText, ShieldCheck } from 'lucide-react'
import BackgroundScene from '@/components/three/background-scene'
import Magnetic from '@/components/magnetic'

// Cycling subtitle — pure garnish. It never gates content and screen readers
// get the full phrase via aria-label instead of letter-soup.
const PHRASES = [
  'gmeow anon ;)',
  'sealing transactions with FHE',
  'shipping sealed-bid ZK auctions',
  'breaking CLOBs for sport',
  'running my own EVM chains',
]

const RotatingTyping = ({ className = '' }: { className?: string }) => {
  const prefersReduced = useReducedMotion()
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [deleting, setDeleting] = useState(false)

  const phrase = PHRASES[phraseIdx]

  useEffect(() => {
    if (prefersReduced) return

    let delay = deleting ? 35 : 65
    if (!deleting && charCount === phrase.length) delay = 2200 // hold complete phrase
    if (deleting && charCount === 0) delay = 300

    const timer = setTimeout(() => {
      if (!deleting) {
        if (charCount < phrase.length) setCharCount(charCount + 1)
        else setDeleting(true)
      } else {
        if (charCount > 0) setCharCount(charCount - 1)
        else {
          setDeleting(false)
          setPhraseIdx((phraseIdx + 1) % PHRASES.length)
        }
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [charCount, deleting, phrase, phraseIdx, prefersReduced])

  return (
    <p aria-label={phrase} className={`min-h-[24px] ${className}`}>
      <span aria-hidden>
        {prefersReduced ? phrase : phrase.slice(0, charCount)}
        {!prefersReduced && <span className="animate-blink">|</span>}
      </span>
    </p>
  )
}

// Topic pills — every one of these is a real link now
const TopicPill = ({ text, href, delay = 0 }: { text: string; href: string; delay?: number }) => (
  <Magnetic strength={0.2}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{
        scale: 1.1,
        y: -4,
        boxShadow: '0 10px 30px -5px rgba(251, 147, 61, 0.4)',
      }}
      className="mx-auto"
    >
      <Link
        href={href}
        className="flex h-16 w-16 flex-col justify-center rounded-full liquid-glass-pill text-center text-xs text-gray-900 dark:text-white transition duration-300 ease-in-out hover:text-orange-500 dark:hover:text-orange-400 md:h-24 md:w-24 md:text-base"
      >
        <span className="font-bold">{text}</span>
      </Link>
    </motion.div>
  </Magnetic>
)

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function Home() {
  const leftPills = [
    { text: 'FHE', href: '/hacks', delay: 0.15 },
    { text: 'ZK', href: '/hacks', delay: 0.25 },
    { text: 'Audits', href: '/audits', delay: 0.35 },
    { text: 'Chains', href: '/projects', delay: 0.45 },
  ]

  const rightPills = [
    { text: 'DeFi', href: '/projects', delay: 0.2 },
    { text: 'Payments', href: '/hacks', delay: 0.3 },
    { text: 'Indexers', href: '/projects', delay: 0.4 },
    { text: 'OSS', href: '/about', delay: 0.5 },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-bg font-base overflow-hidden">
      <BackgroundScene scene="home" />
      <main className="flex-1">
        <div className="mx-auto min-h-screen w-full max-w-[1240px] text-center pt-24 relative">
          <div className="flex min-h-[calc(100vh-6rem)] flex-col md:flex-row">
            {/* Left pills - hidden on mobile */}
            <div className="hidden md:flex mt-10 w-[20%] flex-col justify-evenly">
              {leftPills.map((pill) => (
                <TopicPill key={pill.text} {...pill} />
              ))}
            </div>

            {/* Center content — everything visible immediately, staggered fade only */}
            <div className="flex w-full md:w-[60%] flex-col items-center justify-center px-4 py-8">
              <motion.div {...fadeUp(0)}>
                <div className="relative mx-auto h-[140px] w-[140px] md:h-[180px] md:w-[180px]">
                  <Image src={memeImage} alt="" fill className="object-contain" priority />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-orange-500/15 blur-3xl -z-10"></div>
                </div>
              </motion.div>

              <motion.h1
                {...fadeUp(0.08)}
                className="mt-5 text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 dark:from-white dark:to-orange-400 bg-clip-text text-transparent pb-1"
              >
                Shubham Tiwari
              </motion.h1>

              <motion.p
                {...fadeUp(0.16)}
                className="mt-1 text-lg md:text-2xl font-semibold text-gray-800 dark:text-gray-200"
              >
                Blockchain engineer &amp; security researcher
              </motion.p>

              <motion.p
                {...fadeUp(0.24)}
                className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300"
              >
                I build privacy tech — FHE, ZK, confidential payments — and the chains it runs
                on. Currently lead engineer on Maha Fraxn, an RWA exchange on its own custom
                EVM chain.
              </motion.p>

              <motion.div {...fadeUp(0.32)}>
                <RotatingTyping className="mt-3 text-sm font-medium text-orange-600 dark:text-orange-400" />
              </motion.div>

              <motion.p
                {...fadeUp(0.4)}
                className="mt-5 text-xs md:text-sm text-gray-600 dark:text-gray-400"
              >
                148 merged OSS PRs · DefiLlama · Foundry · Starknet Quest · 6 hackathon wins
              </motion.p>

              <motion.div {...fadeUp(0.48)} className="mt-7 flex flex-wrap gap-4 justify-center">
                <Magnetic strength={0.2}>
                  <Link
                    href="/projects"
                    className="group flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-orange-600 hover:shadow-orange-500/25 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    View Work
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <Link
                    href="/audits"
                    className="liquid-glass-pill flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200 transition-all duration-300 hover:text-orange-500 dark:hover:text-orange-400 hover:-translate-y-0.5"
                  >
                    <ShieldCheck size={16} />
                    Security Research
                  </Link>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass-pill flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200 transition-all duration-300 hover:text-orange-500 dark:hover:text-orange-400 hover:-translate-y-0.5"
                  >
                    <FileText size={16} />
                    Resume
                  </a>
                </Magnetic>
              </motion.div>

              {/* Mobile pills */}
              <div className="grid grid-cols-4 gap-3 mt-9 md:hidden px-2">
                {[...leftPills, ...rightPills].map((pill, index) => (
                  <TopicPill
                    key={`mobile-${pill.text}`}
                    {...pill}
                    delay={0.2 + index * 0.06}
                  />
                ))}
              </div>
            </div>

            {/* Right pills - hidden on mobile */}
            <div className="hidden md:flex mt-10 w-[20%] flex-col justify-evenly">
              {rightPills.map((pill) => (
                <TopicPill key={pill.text} {...pill} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
