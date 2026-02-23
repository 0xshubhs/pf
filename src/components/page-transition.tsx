'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const curtainVariants = {
  initial: { scaleX: 0 },
  animate: { scaleX: 0 },
  exit: {
    scaleX: [0, 1, 1, 0],
    transition: {
      duration: 0.8,
      times: [0, 0.4, 0.6, 1],
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        {/* Orange curtain wipe */}
        <motion.div
          variants={curtainVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-[90] bg-orange-500 origin-left pointer-events-none"
        />

        {/* Page content */}
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
