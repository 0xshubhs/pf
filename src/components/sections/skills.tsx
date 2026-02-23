'use client'

import SKILLS from '@/data/skills'
import { motion } from 'framer-motion'
import { StaggerReveal, StaggerItem } from '@/components/animations/stagger-reveal'

export default function Skills() {
  return (
    <div className="space-y-10">
      {SKILLS.map((item, categoryIndex) => {
        return (
          <StaggerReveal key={categoryIndex}>
            <StaggerItem>
              <h3 className="mb-4 text-lg font-bold sm:text-xl text-gray-900 dark:text-white">
                {item.field}
              </h3>
            </StaggerItem>

            <div className="flex flex-wrap gap-3">
              {item.skills.map((skill, skillIndex) => {
                return (
                  <StaggerItem key={skillIndex}>
                    <motion.div
                      whileHover={{ y: -3, scale: 1.05 }}
                      className="group flex items-center gap-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-4 py-2.5 shadow-sm transition-all duration-300 hover:border-orange-400 hover:shadow-md hover:shadow-orange-400/10 cursor-default"
                    >
                      <skill.icon className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-orange-500 transition-colors duration-300" title="" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                        {skill.skill}
                      </span>
                    </motion.div>
                  </StaggerItem>
                )
              })}
            </div>
          </StaggerReveal>
        )
      })}
    </div>
  )
}
