"use client"
import { useState } from "react"
import { motion } from "framer-motion"

export function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-4">
          React Static
        </h1>
        <p className="text-lg text-secondary-light mb-8 max-w-md">
          A blazing fast static site generator powered by React, Eleventy, and
          Tailwind CSS.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCount((c) => c + 1)}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-lg hover:bg-primary-dark transition-colors"
          >
            Count: {count}
          </motion.button>

          <a
            href="https://www.11ty.dev/docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border-2 border-secondary text-secondary rounded-lg font-medium hover:bg-secondary hover:text-white transition-colors"
          >
            Read Docs →
          </a>
        </div>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 text-sm text-secondary-light"
      >
        Edit{" "}
        <code className="bg-gray-100 px-2 py-1 rounded">
          src/components/App.11ty.tsx
        </code>{" "}
        to get started
      </motion.footer>
    </main>
  )
}
