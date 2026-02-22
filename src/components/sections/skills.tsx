'use client'

import SKILLS from '@/data/skills'
import { motion } from 'framer-motion'

export default function Skills() {
  return (
    <div className="space-y-10">
      {SKILLS.map((item, categoryIndex) => {
        return (
          <motion.div
            key={categoryIndex}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-4 text-lg font-bold sm:text-xl text-gray-900 dark:text-white">
              {item.field}
            </h3>

            <div className="flex flex-wrap gap-3">
              {item.skills.map((skill, skillIndex) => {
                return (
                  <motion.div
                    key={skillIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: skillIndex * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -3, scale: 1.05 }}
                    className="group flex items-center gap-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-4 py-2.5 shadow-sm transition-all duration-300 hover:border-orange-400 hover:shadow-md hover:shadow-orange-400/10 cursor-default"
                  >
                    <skill.icon className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-orange-500 transition-colors duration-300" title="" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                      {skill.skill}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
