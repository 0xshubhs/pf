'use client'

import PAST_ROLES from '@/data/experience'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface Role {
  id: string
  company: string
  role: string
  description: string
  startDate: string
  endDate: string
  link?: string
}

export default function Experience() {
  const roles = [...PAST_ROLES].reverse()

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[7px] md:left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-orange-400 via-orange-400/50 to-transparent" />

      <div className="space-y-10">
        {roles.map((role: Role, index: number) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative pl-8 md:pl-10"
          >
            {/* Timeline dot */}
            <div className="absolute left-0 top-1.5 h-4 w-4 md:h-6 md:w-6 rounded-full border-[3px] border-orange-400 bg-white dark:bg-gray-900 z-10" />

            {/* Card */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 p-5 transition-all duration-300 hover:border-orange-400/50 hover:shadow-lg hover:shadow-orange-400/5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                    {role.role}
                  </h3>
                  <p className="text-orange-500 font-semibold text-sm">
                    @ {role.company}
                  </p>
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 whitespace-nowrap self-start">
                  {role.startDate} - {role.endDate}
                </span>
              </div>

              {role.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                  {role.description}
                </p>
              )}

              {role.link && (
                <a
                  href={role.link}
                  className="inline-flex items-center gap-1.5 mt-3 text-sm text-orange-500 hover:text-orange-600 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
