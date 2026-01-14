"use client"
import { useState } from "react"
import { motion } from "framer-motion"

export function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          React Static
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-md">
          A blazing fast static site generator powered by React, Eleventy, and
          Tailwind CSS.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCount((c) => c + 1)}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium shadow-lg hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Count: {count}
          </motion.button>

          <a
            href="https://www.11ty.dev/docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-600 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Read Docs →
          </a>
        </div>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 text-sm text-gray-500 text-center"
      >
        <p>
          Edit{" "}
          <code className="bg-gray-900 px-2 py-1 rounded text-gray-300">
            src/components/App.11ty.tsx
          </code>{" "}
          to get started
        </p>
        <p className="mt-4">
          Built with ❤️ by{" "}
          <a
            href="https://github.com/hangerthem"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            HangerThem
          </a>
        </p>
      </motion.footer>
    </main>
  )
}
