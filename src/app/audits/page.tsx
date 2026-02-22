'use client'

import { motion } from 'framer-motion'
import { Shield, Lock } from 'lucide-react'

export default function Audits() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-orange-500/10 dark:bg-orange-500/5"
        >
          <Shield className="h-12 w-12 text-orange-500" />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Security Audits
        </h1>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Lock size={14} className="text-orange-500" />
          <span className="text-sm font-medium text-orange-500 uppercase tracking-wider">
            Coming Soon
          </span>
        </div>

        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
          Smart contract security audits and reports will be published here.
          Stay tuned for detailed vulnerability assessments and security analyses.
        </p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          className="h-[1px] bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto mt-8"
        />
      </motion.div>
    </div>
  )
}
