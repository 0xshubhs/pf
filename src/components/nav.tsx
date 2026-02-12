'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'
import { ThemeSwitcher } from './theme-switcher'

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [lastScrollY, setLastScrollY] = useState(0)
  const path = usePathname()

  const links = [
    { path: '/about', text: 'about' },
    { path: '/hacks', text: 'hacks' },
    { path: '/projects', text: 'projects' },
    { path : '/audits', text : 'audits' },
    { path: '/contact', text: 'contact' },
  ]

  // Track scroll position and direction with debounce for performance
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout>
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Determine if we're scrolling up or down
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down')
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up')
      }
      
      // Update last scroll position
      setLastScrollY(currentScrollY)
      
      // Determine if we've scrolled past threshold
      if (currentScrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div 
      className={clsx(
        "fixed w-full z-50 transition-all duration-300 ",
        scrolled 
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-2" 
          : "bg-transparent py-4",
        // Hide navbar when scrolling down (after 150px) and not at the top, show when scrolling up
        !isOpen && scrollDirection === 'down' && scrolled && lastScrollY > 150 
          ? "-top-20" 
          : "top-0"
      )}
    >
      <div className="mx-auto max-w-7xl">
        {/* Overlay for mobile menu */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={toggleMenu}
          />
        )}

        <div className="flex items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            className={clsx(
              "text-xl font-bold transition-all duration-300",
              scrolled 
                ? "text-gray-900 hover:text-orange-500 dark:text-white dark:hover:text-orange-400 scale-95" 
                : "text-gray-900 dark:text-white hover:text-orange-400 dark:hover:text-orange-400 scale-100"
            )}
          >
            0xshubhs
          </Link>

          {/* Desktop Navigation */}
          <nav className={clsx(
            "hidden items-center gap-2 rounded-lg p-2 lg:flex transition-all duration-300",
            scrolled 
              ? "bg-orange-400/90 shadow-md" 
              : "bg-orange-400 shadow-lg"
          )}>
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={clsx(
                  'rounded-md px-4 py-2 font-medium text-gray-900 transition-colors',
                  path === link.path
                    ? 'bg-white shadow-sm'
                    : 'hover:bg-orange-300',
                )}
              >
                {link.text}
              </Link>
            ))}
            <div className="ml-2 rounded-md bg-white px-2 py-1">
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

        {/* Mobile Sidebar */}
        <div
          className={clsx(
            'fixed right-0 top-0 z-50 h-full w-64 transform border-l transition-transform duration-300 ease-in-out lg:hidden',
            'bg-white dark:bg-gray-900',
            'border-gray-200 dark:border-gray-800',
            isOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="p-4">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Menu
              </span>
              <button
                className="text-gray-900 hover:text-orange-400 dark:text-white"
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
                    'rounded-md px-4 py-2 text-center font-medium transition-all duration-200',
                    path === link.path
                      ? 'bg-orange-400 font-bold text-gray-900' 
                      : 'text-gray-900 hover:bg-gray-100 hover:font-bold dark:text-white dark:hover:bg-gray-800',
                  )}
                  onClick={toggleMenu}
                >
                  {link.text}
                </Link>
              ))}
              <div className="mt-4 flex justify-center">
                <div className="rounded-md bg-gray-100 p-2 dark:bg-gray-800">
                  <ThemeSwitcher />
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nav