'use client'
import React from 'react'
import { useState, useEffect, useRef } from 'react'
import Skills from '@/components/sections/skills'
import Experience from '@/components/sections/experience'
import { motion } from 'framer-motion'

interface TypingTextProps {
  text: string
  delay?: number
  typingSpeed?: number
  onComplete?: () => void
  className?: string
}

const TypingText: React.FC<TypingTextProps> = ({
  text,
  delay = 0,
  typingSpeed = 100,
  onComplete,
  className = "",
}) => {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started || isComplete) return

    let currentIndex = 0
    const intervalId = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(intervalId)
        setIsComplete(true)
        onComplete?.()
      }
    }, typingSpeed)

    return () => clearInterval(intervalId)
  }, [text, started, onComplete, isComplete, typingSpeed])

  return (
    <div className={`xs:min-h-[24px] min-h-[20px] ${className}`}>
      {isComplete ? (
        <span>{text}</span>
      ) : (
        <span>{displayText}<span className="animate-pulse">|</span></span>
      )}
    </div>
  )
}

// Section divider component with animated line
const SectionDivider = () => (
  <div className="flex items-center justify-center my-10">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: "40%" }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="h-[1px] bg-gradient-to-r from-transparent via-orange-400 to-transparent"
    />
  </div>
);

// Section heading component
const SectionHeading = ({ title }: { title: string }) => (
  <motion.h2 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="text-2xl md:text-3xl font-bold mb-6 relative inline-block"
  >
    <span>{title}</span>
    <motion.span 
      initial={{ width: 0 }}
      whileInView={{ width: "100%" }}
      transition={{ duration: 0.8, delay: 0.3 }}
      viewport={{ once: true }}
      className="absolute bottom-0 left-0 h-[3px] bg-orange-400"
    />
  </motion.h2>
);

export default function About() {
  const [show, setShow] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const sectionRefs = {
    intro: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
    experience: useRef<HTMLDivElement>(null)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const introText =
    'A quiet Saturday evening, lofi beats playing softly, rain tapping ' +
    'against the window, and a warm cup of coffee by my side. The cursor ' +
    'blinks, and I type console.log("Am a hecker lol "). This is my flow state — ' +
    'building decentralized solutions, solving puzzles, and bringing ideas ' +
    'to life. Two years deep in Web3, crafting smart contracts and dApps. ' +
    'Beyond the code, I breathe music, clear my mind through meditation, ' +
    'and push limits at the gym.'

  const introParagraphs = [
    'building on-chain, breaking things for fun, and shipping what matters.'
  ]

  return (
    <div className="min-h-screen bg-bg">
      <main className="container mx-auto px-6 py-16 pt-28 max-w-4xl">
        {/* Intro Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
          ref={sectionRefs.intro}
        >
          <div className="flex flex-col justify-center space-y-6 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 dark:from-white dark:to-orange-400 bg-clip-text text-transparent pb-2">
                Gm, I&apos;m Shubham.
              </h1>
              <div className="h-1 w-20 bg-orange-500 mx-auto md:mx-0 rounded-full mt-2" />
            </motion.div>
            
            {show && (
              <div className="max-w-2xl mx-auto md:mx-0 text-sm md:text-base lg:text-lg space-y-4 leading-relaxed font-light text-gray-800 dark:text-gray-300">
                {introParagraphs.map((paragraph, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                  >
                    <p>{paragraph}</p>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Background decorations */}
            <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-orange-400/5 rounded-full blur-3xl" />
            <div className="absolute -z-10 bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
          </div>
        </motion.div>

        <SectionDivider />

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12"
          ref={sectionRefs.skills}
        >
          <div className="text-center md:text-left mb-8">
            <SectionHeading title="Skills & Technologies" />
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
             Technologies I&apos;ve previously worked with and the skills Ive developed over my journey in web development and web3.
            </p>
          </div>
          <Skills />
        </motion.div>

        <SectionDivider />

        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12"
          ref={sectionRefs.experience}
        >
          <div className="text-center md:text-left mb-8">
            <SectionHeading title="Work Experience" />
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
              My professional journey in the world of Web3 and development.
            </p>
          </div>
          <Experience />
        </motion.div>
        
        {/* Quick Navigation Dots */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
          <div className="flex flex-col space-y-4">
            {Object.entries(sectionRefs).map(([key, ref]) => {
              const isActive = ref.current && 
                scrollY >= (ref.current.offsetTop - window.innerHeight / 2) && 
                scrollY < (ref.current.offsetTop + ref.current.offsetHeight - window.innerHeight / 2);
              
              return (
                <motion.div
                  key={key}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isActive ? 1.2 : 1 }}
                  className="group cursor-pointer"
                  onClick={() => ref.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <div 
                    className={`h-3 w-3 rounded-full transition-all duration-300 group-hover:bg-orange-400 ${
                      isActive ? 'bg-orange-400' : 'bg-gray-600'
                    }`} 
                  />
                  <span className={`absolute left-0 -ml-24 top-0 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isActive ? 'text-orange-400' : 'text-gray-300'
                  }`}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}