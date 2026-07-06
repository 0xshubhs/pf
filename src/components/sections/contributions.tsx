'use client'

import { motion } from 'framer-motion'
import { GitMerge, GitPullRequest, ExternalLink } from 'lucide-react'
import CONTRIBUTIONS from '@/data/contributions'

const StatusBadge = ({ status }: { status: 'merged' | 'open' }) =>
  status === 'merged' ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 shrink-0">
      <GitMerge size={11} />
      merged
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:text-sky-400 shrink-0">
      <GitPullRequest size={11} />
      open
    </span>
  )

const Contributions = () => (
  <div className="grid gap-5 md:grid-cols-2">
    {CONTRIBUTIONS.map((c, i) => (
      <motion.div
        key={c.project}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
        viewport={{ once: true, margin: '-50px' }}
        className={`glass-panel p-5 ${i === 0 ? 'md:col-span-2' : ''}`}
      >
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
            {c.project}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">{c.org}</span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{c.blurb}</p>

        <ul className="mt-4 space-y-2">
          {c.prs.map((pr) => (
            <li key={pr.url}>
              <a
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-3 rounded-md border border-black/5 bg-black/[0.03] px-3 py-2 transition-all hover:border-orange-400/40 hover:bg-orange-400/10 dark:border-white/10 dark:bg-white/5"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white flex items-center gap-1.5">
                  {pr.title}
                  <ExternalLink size={11} className="opacity-0 group-hover:opacity-70 transition-opacity shrink-0" />
                </span>
                <StatusBadge status={pr.status} />
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    ))}
  </div>
)

export default Contributions
