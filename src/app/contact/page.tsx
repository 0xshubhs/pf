'use client'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import memeImage from '../assets/meme.png'
import { motion } from 'framer-motion'
import { TwitterIcon } from 'lucide-react'
import {
  SiTelegram,
  SiX,
  SiGithub,
  SiGmail,

} from '@icons-pack/react-simple-icons'

// Reuse the improved TypingText component from About page
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

// Section heading component from About page
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

// Section divider component from About page
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

// Icons for contact methods
interface IconProps extends React.SVGProps<SVGSVGElement> {}

const MailIcon: React.FC<IconProps> = (props) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

const GithubIcon: React.FC<IconProps> = (props) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  )
}

const LinkedInIcon: React.FC<IconProps> = (props) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M18.335 18.339H15.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.2 1.778 3.2 4.091v4.715zM7.003 8.575a1.546 1.546 0 01-1.548-1.549 1.548 1.548 0 111.547 1.549zm1.336 9.764H5.666V9.75H8.34v8.589zM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003z" />
    </svg>
  )
}

// Contact Method component
interface ContactMethodProps {
  icon: React.ReactNode
  label: string
  value: string
  link: string
  delay: number
}

const ContactMethod: React.FC<ContactMethodProps> = ({ icon, label, value, link, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      viewport={{ once: true }}
      onClick={() => window.open(link, '_blank')}
      className="flex items-center p-4 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 
                shadow-lg hover:shadow-orange-400/20 cursor-pointer group transition-all duration-300 
                hover:-translate-y-1 hover:scale-[1.02]"
    >
      <div className="p-3 rounded-full bg-orange-400 text-white mr-4 group-hover:bg-white group-hover:text-orange-400 transition-colors duration-300">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="font-medium text-white group-hover:text-orange-400 transition-colors duration-300">{value}</p>
      </div>
    </motion.div>
  )
}

const Contact = () => {
  const [isClient, setIsClient] = useState(false)
  const [showSecond, setShowSecond] = useState(false)
  const [showThird, setShowThird] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  
  const contactRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-bg">
      <main className="container mx-auto px-6 py-16 pt-28 max-w-4xl" ref={contactRef}>
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center md:text-left"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 dark:from-white dark:to-orange-400 bg-clip-text text-transparent pb-2">
              {"Let's Connect"}
            </h1>
            <div className="h-1 w-20 bg-orange-500 mx-auto md:mx-0 rounded-full mt-2" />
          </motion.div>
          
          {/* Background decorations */}
          <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-orange-400/5 rounded-full blur-3xl" />
          <div className="absolute -z-10 bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        </motion.div>

        {/* Meme Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <div className="xs:h-[350px] mx-auto flex h-[300px] select-none flex-col text-gray-600 dark:text-gray-400 sm:h-[400px]">
            <div className="flex justify-around text-center">
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="xs:w-[140px] xs:text-xs mx-2 mt-3 w-[120px] text-[10px] font-bold sm:mx-4 sm:mt-5 sm:w-[160px] sm:text-sm"
              >
                You looking for a gud developer
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="xs:w-[140px] xs:text-xs mx-2 mt-3 w-[120px] text-[10px] font-bold sm:mx-4 sm:mt-5 sm:w-[160px] sm:text-sm"
              >
                Me looking for a gud job
              </motion.p>
            </div>
            <div className="xs:h-[250px] xs:w-[320px] relative m-auto h-[200px] w-[280px] sm:h-[350px] sm:w-[400px] md:h-[450px] md:w-[450px]">
              <Image
                src={memeImage}
                alt="spiderman-meme"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </motion.div>

        <SectionDivider />

        {/* Contact Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12"
        >
          <div className="text-center md:text-left mb-8">
            <SectionHeading title="Get In Touch" />
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
              Feel free to reach out for collaborations or just a friendly hello
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <ContactMethod 
              icon={<SiGmail className="w-6 h-6" />}
              label="Email"
              value="shubht3303@gmail.com"
              link="mailto:shubht3303@gmail.com"
              delay={0.1}
            />
            <ContactMethod 
              icon={<SiGithub className="w-6 h-6" />}
              label="GitHub"
              value="0xshubhs"
              link="https://github.com/0xshubhs"
              delay={0.2}
            />
            <ContactMethod 
              icon={<SiX className="w-6 h-6" />}
              label="X (Twitter)"
              value="shubhamtwtt"
              link="https://x.com/shubhamtwtt"
              delay={0.3}
            />
            <ContactMethod 
              icon={<SiTelegram className="w-6 h-6" />}
              label="Telegram"
              value="DevShubhamm"
              link="https://t.me/DevShubhamm"
              delay={0.4}
            />
            
            {/* Contact Form */}
              {/* <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="md:col-span-2 p-6 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 shadow-lg"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Quick Message</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-400 focus:outline-none"
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <textarea 
                  placeholder="Your message" 
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-orange-400 focus:outline-none mb-4"
                />
                <button className="px-6 py-2 bg-orange-400 text-white font-medium rounded-lg hover:bg-orange-500 transition-colors duration-300">
                  Send Message
                </button>
              </motion.div> */}
          </div>
        </motion.div>

        {/* Quick Navigation Dot */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
          <div className="flex flex-col space-y-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: contactRef.current && 
                  scrollY >= (contactRef.current.offsetTop - window.innerHeight / 2) &&
                  scrollY < (contactRef.current.offsetTop + contactRef.current.offsetHeight - window.innerHeight / 2)
                  ? 1.2 : 1 
              }}
              className="group cursor-pointer"
              onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div 
                className={`h-3 w-3 rounded-full transition-all duration-300 group-hover:bg-orange-400 ${
                  contactRef.current && 
                  scrollY >= (contactRef.current.offsetTop - window.innerHeight / 2) &&
                  scrollY < (contactRef.current.offsetTop + contactRef.current.offsetHeight - window.innerHeight / 2)
                    ? 'bg-orange-400' : 'bg-gray-600'
                }`} 
              />
              <span className={`absolute left-0 -ml-24 top-0 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                contactRef.current && 
                scrollY >= (contactRef.current.offsetTop - window.innerHeight / 2) &&
                scrollY < (contactRef.current.offsetTop + contactRef.current.offsetHeight - window.innerHeight / 2)
                  ? 'text-orange-400' : 'text-gray-300'
              }`}>
                Contact
              </span>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Contact