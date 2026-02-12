'use client'

import {
  IconType,
  SiGithub,
  SiGmail,
  SiMedium,
  SiTelegram,
  SiX,
} from '@icons-pack/react-simple-icons'
import { FC } from 'react'

interface LinkItem {
  icon: IconType
  href: string
  label: string
}

const Links: FC = () => {
  const links: LinkItem[] = [
    {
      icon: SiX,
      href: 'https://x.com/shubhamtwtt',
      label: 'X',
    },
    {
      icon: SiTelegram,
      href: 'https://t.me/DevShubhamm',
      label: 'Telegram',
    },
    {
      icon: SiGmail,
      href: 'mailto:shubht3303@gmail.com',
      label: 'Email',
    },
    {
      icon: SiGithub,
      href: 'https://github.com/0xshubhs',
      label: 'GitHub',
    },
    {
      icon: SiMedium,
      href: 'https://medium.com/@0xShubham',
      label: 'Medium',
    },
  ]

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="mx-auto max-w-4xl px-6 py-10 flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-5">
          {links.map((link: LinkItem, id: number) => {
            return (
              <a
                target="_blank"
                key={id}
                href={link.href}
                rel="noopener noreferrer"
                aria-label={link.label}
                className="group relative p-2.5 rounded-lg text-gray-500 dark:text-gray-400 transition-all duration-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:-translate-y-1"
              >
                <link.icon className="h-5 w-5" title="" />
              </a>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600">
          &copy; {new Date().getFullYear()} Shubham. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Links
