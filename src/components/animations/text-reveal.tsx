'use client'

import { motion } from 'framer-motion'

interface TextRevealProps {
  text: string
  mode?: 'words' | 'characters'
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
}

const containerVariants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.03,
      delayChildren: delay,
    },
  }),
}

const wordVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const charVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

export default function TextReveal({
  text,
  mode = 'words',
  className = '',
  delay = 0,
  as: Tag = 'div',
}: TextRevealProps) {
  const MotionTag = motion.create(Tag)
  const items = mode === 'words' ? text.split(' ') : text.split('')
  const variants = mode === 'words' ? wordVariants : charVariants

  return (
    <MotionTag
      className={`flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={delay}
    >
      {items.map((item, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span className="inline-block" variants={variants}>
            {item}
            {mode === 'words' && i < items.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
