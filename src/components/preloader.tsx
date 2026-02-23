'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const letters = '0xshubhs.eth'.split('')

export default function Preloader() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  // Check sessionStorage only after mount to avoid hydration mismatch
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('preloaderShown')
    if (!alreadyShown) {
      setIsLoading(true)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading) return

    document.body.style.overflow = 'hidden'

    const start = Date.now()
    const minDuration = 2200

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        const elapsed = Date.now() - start
        const target = Math.min((elapsed / minDuration) * 100, 100)
        return Math.min(prev + (target - prev) * 0.1 + 0.5, 100)
      })
    }, 16)

    const timer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        sessionStorage.setItem('preloaderShown', 'true')
        document.body.style.overflow = ''
      }, 400)
    }, minDuration)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
      document.body.style.overflow = ''
    }
  }, [isLoading])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-950"
        >
          {/* Pulsing ring */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-64 h-64 rounded-full border border-orange-500/20"
          />

          {/* Letter-by-letter reveal */}
          <div className="flex overflow-hidden mb-8">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-3xl md:text-5xl font-bold text-white inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-48 h-[2px] bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Progress text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 text-xs text-gray-500 tracking-[0.3em] uppercase"
          >
            loading
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
