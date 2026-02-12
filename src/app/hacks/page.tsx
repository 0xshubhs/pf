'use client'
import { useState, useEffect, useRef } from 'react'
import HACKS from '@/data/hacks'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink, Github, Trophy } from 'lucide-react'

interface TeamMember {
  name: string
  link: string
}

interface Hack {
  name: string
  projectName: string
  description: string
  team: TeamMember[]
  prizes: string[] | null
  previewImage?: string
  dashboardImage?: string
  projectImage?: string
  liveLink?: string
  repoUrl?: string
}

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

const HackathonCard: React.FC<{ hack: Hack; index: number; isVisible?: boolean }> = ({
  hack,
  index,
  isVisible = true,
}) => {
  const images = [
    hack.previewImage,
    hack.dashboardImage,
    hack.projectImage,
  ].filter(Boolean) as string[]
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [autoplay, setAutoplay] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  // Handle image carousel
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (autoplay && images.length > 1 && !isHovered) {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoplay, images.length, isHovered]);
  
  const nextImage = () => {
    setAutoplay(false);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setAutoplay(false);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  // Reset image loaded state when image changes
  useEffect(() => {
    setImageLoaded(false);
  }, [currentImageIndex]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
      className="rounded-lg border-2 border-border bg-main p-5 shadow-lg hover:shadow-xl transition-all duration-300 dark:border-darkBorder dark:bg-main dark:shadow-dark"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image carousel */}
        {images.length > 0 && (
          <div className="md:w-2/5 relative group">
            <div className="relative w-full overflow-hidden rounded-lg border-2 border-border shadow-light dark:border-darkBorder dark:shadow-dark">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.5 }}
                  transition={{ duration: 0.5 }}
                  className="w-full min-h-[200px] flex items-center justify-center bg-gray-900/30 backdrop-blur-sm relative"
                >
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-orange-400"></div>
                    </div>
                  )}
                  <img
                    className="max-w-full max-h-[400px] object-contain p-2"
                    src={images[currentImageIndex]}
                    alt={`${hack.name} - ${hack.projectName}`}
                    onLoad={(e) => {
                      // Set image as loaded
                      setImageLoaded(true);
                    }}
                    style={{
                      opacity: imageLoaded ? 1 : 0,
                      transition: 'opacity 0.3s ease-in-out'
                    }}
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Image indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentImageIndex ? 'bg-orange-400 scale-125' : 'bg-gray-400 opacity-70'
                      }`}
                      onClick={() => {
                        setAutoplay(false);
                        setCurrentImageIndex(idx);
                      }}
                    />
                  ))}
                </div>
              )}
              
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-80 transition-opacity"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-80 transition-opacity"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="md:w-3/5 font-base text-text flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-heading font-bold sm:text-2xl">
              <span className="text-black-400">{hack.name}</span> - {hack.projectName}
            </h2>

            <p className="mt-3 text-gray-800 dark:text-gray-200 leading-relaxed">{hack.description}</p>

            {/* Team section */}
            <div className="mt-4">
              <h3 className="font-medium text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400">Team Members</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {hack.team.map((member) => (
                  <a
                    key={member.name}
                    href={member.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-border px-3 py-1.5 text-sm shadow-light transition-all hover:bg-orange-400/10 hover:border-orange-400/50 hover:text-gray-900 dark:hover:text-white text-gray-700 dark:border-darkBorder dark:bg-secondaryBlack dark:text-darkText dark:shadow-dark flex items-center gap-1.5"
                  >
                    {member.name}
                    <ExternalLink size={12} />
                  </a>
                ))}
              </div>
            </div>

            {/* Prizes section */}
            {hack.prizes && hack.prizes.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400">Achievements</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {hack.prizes.map((prize) => (
                    <span
                      key={prize}
                      className="rounded-md border border-orange-600/30 bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 text-sm text-orange-700 dark:text-orange-300 flex items-center gap-1.5"
                    >
                      <Trophy size={14} />
                      {prize}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex gap-4">
            {hack.liveLink && (
              <a
                className="flex items-center justify-center gap-2 rounded-md border-2 border-border bg-white px-4 py-2 text-center text-sm font-semibold text-gray-800 shadow-light transition-all hover:translate-y-[-2px] hover:bg-orange-400 hover:text-white hover:border-orange-500 dark:border-darkBorder dark:bg-secondaryBlack dark:text-darkText dark:shadow-dark dark:hover:bg-orange-500 dark:hover:text-white flex-1"
                href={hack.liveLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={16} />
                View Project
              </a>
            )}
            {hack.repoUrl && (
              <a
                className="flex items-center justify-center gap-2 rounded-md border-2 border-border bg-white px-4 py-2 text-center text-sm font-semibold text-gray-800 shadow-light transition-all hover:translate-y-[-2px] hover:bg-gray-800 hover:text-white hover:border-gray-700 dark:border-darkBorder dark:bg-secondaryBlack dark:text-darkText dark:shadow-dark dark:hover:bg-gray-700 dark:hover:text-white flex-1"
                href={hack.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={16} />
                Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Filter component for hackathon filtering
const HackathonFilter: React.FC<{
  filters: string[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}> = ({ filters, activeFilter, setActiveFilter }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeFilter === filter
              ? 'bg-orange-400 text-white shadow-md'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          onClick={() => setActiveFilter(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default function Hacks() {
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [activeFilter, setActiveFilter] = useState("All")
  const [visibleHacks, setVisibleHacks] = useState<Hack[]>(HACKS)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  
  // Get unique hackathon types for filters
  const hackTypes = ["All", ...Array.from(new Set(HACKS.map(hack => hack.name.split(" ")[0])))]
  
  // Set page as loaded after a small delay for smoother entry animations
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (activeFilter === "All") {
      setVisibleHacks(HACKS);
    } else {
      setVisibleHacks(HACKS.filter(hack => hack.name.includes(activeFilter)));
    }
  }, [activeFilter]);

  const introText =
    'My journey into both web2 and web3 has been deeply shaped by hackathons. Just a few months after diving into web3, I started challenging myself with projects that pushed my limits. As a competitive person, I discovered a passion for participating — and winning — in these competitions. Whether its web2 or web3, the thrill of innovating ideas and bringing them to life is something I can not get enough of. It can be an addictive experience XD.'

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-6 py-16 pt-28 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isPageLoaded ? 1 : 0, y: isPageLoaded ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center space-y-4 text-center max-w-3xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isPageLoaded ? 1 : 0, y: isPageLoaded ? 0 : -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            <span className="bg-gradient-to-r from-orange-500 to-orange-700 dark:from-orange-400 dark:to-orange-600 bg-clip-text text-transparent">
              Hackathon
            </span> Journey
          </motion.h1>
          
          <div className="relative pb-4">
            <TypingText
              text={introText}
              delay={300}
              typingSpeed={80}
              onComplete={() => setIsTypingComplete(true)}
              className="text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
            />
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <HackathonFilter 
            filters={hackTypes} 
            activeFilter={activeFilter} 
            setActiveFilter={setActiveFilter} 
          />
        </motion.div>

        {/* Hackathon cards */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex flex-col gap-8"
        >
          <AnimatePresence>
            {visibleHacks.map((hack, id) => (
              <HackathonCard key={hack.name} hack={hack} index={id} />
            ))}
          </AnimatePresence>
          
          {visibleHacks.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-gray-400"
            >
              No hackathons found for this filter. Try another category.
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}