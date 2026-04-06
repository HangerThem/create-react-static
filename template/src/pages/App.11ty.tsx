import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/Button"

export function App() {
  const [count, setCount] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const saved = localStorage.getItem("app-count")
    if (saved) setCount(Number(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("app-count", String(count))
  }, [count])

  const fadeUp = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#000_45%)]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div {...fadeUp} className="w-full">
          <p className="mb-4 inline-flex rounded-full border border-gray-700 bg-gray-900/70 px-3 py-1 text-xs uppercase tracking-wider text-gray-300">
            React + Eleventy + Tailwind
          </p>

          <h1 className="mb-4 text-4xl font-bold md:text-6xl">React Static</h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400">
            A blazing fast static site generator powered by React, Eleventy, and
            Tailwind CSS.
          </p>

          <div className="mx-auto mb-8 grid max-w-xl gap-4 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 shadow-xl shadow-black/30">
            <p className="text-sm text-gray-400">Counter demo</p>

            <p className="text-3xl font-semibold" aria-live="polite">
              {count}
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button onClick={() => setCount((c) => c + 1)}>Increment</Button>
              <Button onClick={() => setCount(0)} variant="outline">
                Reset
              </Button>
              <Button href="https://www.11ty.dev/docs/" variant="outline">
                Read Docs →
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.footer
          initial={shouldReduceMotion ? undefined : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          transition={shouldReduceMotion ? undefined : { delay: 0.4 }}
          className="text-center text-sm text-gray-500"
        >
          <p>
            Edit{" "}
            <code className="rounded bg-gray-900 px-2 py-1 text-gray-300">
              src/pages/App.11ty.tsx
            </code>{" "}
            to get started
          </p>
          <p className="mt-4">
            Built with ❤️ by{" "}
            <a
              href="https://github.com/hangerthem"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-gray-200"
            >
              HangerThem
            </a>
          </p>
        </motion.footer>
      </section>
    </main>
  )
}
