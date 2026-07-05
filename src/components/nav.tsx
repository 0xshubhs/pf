'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import clsx from 'clsx'
import { ThemeSwitcher } from './theme-switcher'
import Magnetic from './magnetic'
import GlassLens from './glass-lens'

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [lastScrollY, setLastScrollY] = useState(0)
  const path = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const isInNavRef = useRef(false)
  const [pillVertical, setPillVertical] = useState({ top: 0, height: 0 })

  // Motion values — direct DOM updates, no React re-renders on mouse move
  const targetLeft = useMotionValue(0)
  const targetWidth = useMotionValue(0)
  const targetOpacity = useMotionValue(0)

  // Springs for liquid-smooth cursor following
  const springLeft = useSpring(targetLeft, { stiffness: 180, damping: 22, mass: 0.9 })
  const springWidth = useSpring(targetWidth, { stiffness: 260, damping: 26 })
  const springOpacity = useSpring(targetOpacity, { stiffness: 300, damping: 30 })

  const links = [
    { path: '/about', text: 'about' },
    { path: '/hacks', text: 'hacks' },
    { path: '/projects', text: 'projects' },
    { path : '/audits', text : 'audits' },
    { path: '/contact', text: 'contact' },
  ]

  // Track scroll position and direction
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout>

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down')
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up')
      }
      setLastScrollY(currentScrollY)
      setScrolled(currentScrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const toggleMenu = () => setIsOpen(!isOpen)

  // Helper: measure a link and position pill there (for active/leave states)
  const snapToLink = useCallback((linkEl: HTMLAnchorElement, instant = false) => {
    if (!navRef.current) return
    const navRect = navRef.current.getBoundingClientRect()
    const linkRect = linkEl.getBoundingClientRect()
    const left = linkRect.left - navRect.left
    const width = linkRect.width

    if (instant) {
      springLeft.jump(left)
      springWidth.jump(width)
    } else {
      targetLeft.set(left)
      targetWidth.set(width)
    }
    targetOpacity.set(1)

    if (pillVertical.height === 0) {
      setPillVertical({
        top: linkRect.top - navRect.top,
        height: linkRect.height,
      })
    }
  }, [pillVertical.height, targetLeft, targetWidth, targetOpacity, springLeft, springWidth])

  // Position pill at active link on mount and route change
  useEffect(() => {
    if (isInNavRef.current) return
    const activeEl = linkRefs.current.get(path)
    if (activeEl) {
      // First mount: jump instantly. Route change: animate.
      const isFirstMount = targetOpacity.get() === 0
      snapToLink(activeEl, isFirstMount)
    } else {
      targetOpacity.set(0)
    }
  }, [path, snapToLink, targetOpacity])

  // Recalculate on resize
  useEffect(() => {
    const handleResize = () => {
      if (isInNavRef.current) return
      const activeEl = linkRefs.current.get(path)
      if (activeEl) snapToLink(activeEl, true)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [path, snapToLink])

  // Continuous cursor tracking — pill center follows cursor X
  const handleNavMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!navRef.current) return
    const navRect = navRef.current.getBoundingClientRect()
    const cursorX = e.clientX - navRect.left

    // Find nearest link and compute links zone boundary
    let nearestWidth = 80
    let minDist = Infinity
    let linksRightEdge = 0
    let linksLeftEdge = Infinity
    linkRefs.current.forEach((el) => {
      const rect = el.getBoundingClientRect()
      const relLeft = rect.left - navRect.left
      const relRight = rect.right - navRect.left
      const centerX = relLeft + rect.width / 2
      const dist = Math.abs(cursorX - centerX)
      if (dist < minDist) {
        minDist = dist
        nearestWidth = rect.width
      }
      if (relRight > linksRightEdge) linksRightEdge = relRight
      if (relLeft < linksLeftEdge) linksLeftEdge = relLeft
    })

    // Clamp cursor to links zone only (ignore theme switcher area)
    const clampedX = Math.max(linksLeftEdge, Math.min(cursorX, linksRightEdge))
    const left = Math.max(linksLeftEdge, Math.min(clampedX - nearestWidth / 2, linksRightEdge - nearestWidth))
    targetLeft.set(left)
    targetWidth.set(nearestWidth)
    targetOpacity.set(1)

    // Set vertical dimensions once
    if (pillVertical.height === 0) {
      const firstLink = linkRefs.current.values().next().value
      if (firstLink) {
        const linkRect = firstLink.getBoundingClientRect()
        setPillVertical({
          top: linkRect.top - navRect.top,
          height: linkRect.height,
        })
      }
    }

    // Specular highlight tracking
    const xPct = (cursorX / navRect.width) * 100
    const yPct = ((e.clientY - navRect.top) / navRect.height) * 100
    navRef.current.style.setProperty('--nav-x', `${xPct}%`)
    navRef.current.style.setProperty('--nav-y', `${yPct}%`)
  }, [targetLeft, targetWidth, targetOpacity, pillVertical.height])

  const handleNavMouseEnter = useCallback(() => {
    isInNavRef.current = true
  }, [])

  // On leave, slide back to active link or fade out
  const handleNavMouseLeave = useCallback(() => {
    isInNavRef.current = false
    const activeEl = linkRefs.current.get(path)
    if (activeEl) {
      snapToLink(activeEl)
    } else {
      targetOpacity.set(0)
    }
  }, [path, snapToLink, targetOpacity])

  return (
    <>
    <GlassLens />
    <div
      className={clsx(
        "fixed w-full z-50 transition-all duration-300 ",
        isOpen
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-lg py-2"
          : scrolled
            ? "bg-white/50 dark:bg-gray-900/50 backdrop-blur-2xl shadow-lg py-2"
            : "bg-transparent py-4",
        !isOpen && scrollDirection === 'down' && scrolled && lastScrollY > 150
          ? "-top-20"
          : "top-0"
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between px-4">
          {/* Logo */}
          <Magnetic strength={0.15}>
            <Link
              href="/"
              className={clsx(
                "text-xl font-bold transition-all duration-300",
                scrolled
                  ? "text-gray-900 hover:text-orange-500 dark:text-white dark:hover:text-orange-400 scale-95"
                  : "text-gray-900 dark:text-white hover:text-orange-400 dark:hover:text-orange-400 scale-100"
              )}
            >
              0xshubhs.eth
            </Link>
          </Magnetic>

          {/* Desktop Navigation */}
          <nav
            ref={navRef}
            onMouseMove={handleNavMouseMove}
            onMouseEnter={handleNavMouseEnter}
            onMouseLeave={handleNavMouseLeave}
            className="hidden items-center gap-2 rounded-2xl p-2 lg:flex transition-all duration-300 liquid-glass-nav"
          >
            {/* Liquid glass droplet — center follows cursor continuously */}
            <motion.div
              className="liquid-glass-slider"
              style={{
                position: 'absolute',
                left: springLeft,
                width: springWidth,
                top: pillVertical.top,
                height: pillVertical.height,
                opacity: springOpacity,
              }}
            />

            {links.map((link) => (
              <Magnetic key={link.path} strength={0.2}>
                <Link
                  ref={(el: HTMLAnchorElement | null) => {
                    if (el) linkRefs.current.set(link.path, el)
                  }}
                  href={link.path}
                  className={clsx(
                    'relative z-10 rounded-xl px-4 py-2 font-medium transition-colors duration-300',
                    path === link.path
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
                  )}
                >
                  {link.text}
                </Link>
              </Magnetic>
            ))}
            <div className="relative z-10 ml-2 rounded-xl px-2 py-1 liquid-glass-pill">
              <ThemeSwitcher />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={clsx(
              "hover:text-orange-400 lg:hidden",
              scrolled
                ? "text-gray-900 dark:text-white"
                : "text-gray-900 dark:text-white"
            )}
            onClick={toggleMenu}
          >
            <Menu size={24} />
          </button>
        </div>

      </div>
    </div>

      {/* Mobile menu overlay + sidebar live OUTSIDE the backdrop-filtered navbar:
          a filtered ancestor becomes the containing block for fixed children,
          which collapsed the sidebar's height and left it transparent. */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={clsx(
          'fixed right-0 top-0 z-[60] h-screen w-64 transform transition-transform duration-300 ease-in-out lg:hidden liquid-glass-sidebar',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
          <div className="p-4">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-lg font-bold text-white">
                Menu
              </span>
              <button
                className="text-gray-200 hover:text-orange-400"
                onClick={toggleMenu}
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={clsx(
                    'rounded-xl px-4 py-2 text-center font-medium transition-all duration-300 liquid-glass-mobile-link',
                    path === link.path
                      ? 'liquid-glass-mobile-active font-bold text-white'
                      : 'text-gray-200',
                  )}
                  onClick={toggleMenu}
                >
                  {link.text}
                </Link>
              ))}
              <div className="mt-4 flex justify-center">
                <div className="rounded-xl p-2 liquid-glass-pill">
                  <ThemeSwitcher />
                </div>
              </div>
            </nav>
          </div>
      </div>
    </>
  )
}

export default Nav
