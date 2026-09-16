'use client'

import { FC } from 'react'

const LINKS = [
  { href: 'https://x.com/shubhamtwtt', label: 'x' },
  { href: 'https://github.com/0xshubhs', label: 'github' },
  { href: 'https://t.me/DevShubhamm', label: 'telegram' },
  { href: 'https://medium.com/@0xShubham', label: 'medium' },
  { href: 'mailto:shubht3303@gmail.com', label: 'email' },
]

const Links: FC = () => (
  <footer className="border-t border-rule">
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="b-link text-[14px]"
          >
            {link.label}
          </a>
        ))}
      </div>
      <p className="b-faint text-[12px]">
        &copy; {new Date().getFullYear()} Shubham Tiwari
      </p>
    </div>
  </footer>
)

export default Links
