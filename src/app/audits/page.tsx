'use client'

import { motion } from 'framer-motion'
import { Shield, Github, FileText, Wrench, ChevronRight } from 'lucide-react'
import BackgroundScene from '@/components/three/background-scene'
import AUDITS, { type AuditEngagement } from '@/data/audits'

const AuditCard: React.FC<{ audit: AuditEngagement; index: number }> = ({ audit, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
    className="rounded-lg border-2 border-border bg-main p-6 shadow-lg hover:shadow-xl transition-all duration-300 dark:border-darkBorder dark:bg-main dark:shadow-dark"
  >
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {audit.protocol}
        </h2>
        <p className="text-sm font-medium text-orange-500 mt-1">
          {audit.platform}
          {audit.prizePool ? ` · ${audit.prizePool}` : ''}
        </p>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 md:text-right shrink-0">
        <p>{audit.date}</p>
        <p>{audit.scope}</p>
      </div>
    </div>

    <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
      {audit.description}
    </p>

    <div className="flex flex-wrap gap-2 mb-4">
      {audit.tools.map((tool) => (
        <span
          key={tool}
          className="inline-flex items-center gap-1 rounded-full border border-border dark:border-darkBorder bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-600 dark:text-orange-400"
        >
          <Wrench size={11} />
          {tool}
        </span>
      ))}
    </div>

    <ul className="space-y-2 mb-5">
      {audit.highlights.map((point, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
          <ChevronRight size={16} className="text-orange-500 mt-0.5 shrink-0" />
          <span>{point}</span>
        </li>
      ))}
    </ul>

    <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-border/50 dark:border-darkBorder/50">
      <a
        href={audit.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
      >
        <Github size={16} />
        Read the research
      </a>
      <span className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <FileText size={13} />
        {audit.status}
      </span>
    </div>
  </motion.div>
)

export default function Audits() {
  return (
    <div className="min-h-screen bg-bg">
      <BackgroundScene scene="audits" />
      <main className="container mx-auto px-6 py-16 pt-28 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left mb-10"
        >
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 dark:bg-orange-500/5">
              <Shield className="h-6 w-6 text-orange-500" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 dark:from-white dark:to-orange-400 bg-clip-text text-transparent pb-1">
              Security Research
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0 leading-relaxed">
            Competitive audit contests, fuzzing harnesses, and formal verification. No accepted
            findings on the board yet — but every engagement below ships with runnable PoCs,
            invariant suites, and specs, all public. The scoreboard will catch up.
          </p>
        </motion.div>

        <div className="space-y-6">
          {AUDITS.map((audit, index) => (
            <AuditCard key={audit.protocol} audit={audit} index={index} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10"
        >
          Also hardening contracts professionally — test suites, fuzz coverage, and security
          reviews at AttenomicsLabs &amp; Qoneqt.
        </motion.p>
      </main>
    </div>
  )
}
