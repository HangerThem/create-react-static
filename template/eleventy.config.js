import "tsx/esm"
import { renderToStaticMarkup } from "react-dom/server"

import cssnano from "cssnano"
import postcss from "postcss"
import tailwindcss from "@tailwindcss/postcss"

import path from "path"
import fs from "fs"

export default function (eleventyConfig) {
  // Process Tailwind CSS before each Eleventy build.
  // In dev/watch mode, skip cssnano to speed up rebuilds.
  const isDevLike =
    process.argv.includes("--serve") || process.argv.includes("--watch")

  const processor = postcss([
    tailwindcss,
    ...(isDevLike ? [] : [cssnano({ preset: "default" })]),
  ])

  eleventyConfig.on("eleventy.before", async () => {
    const tailwindInputPath = path.resolve("src/css/global.css")
    const tailwindOutputPath = "_site/css/global.css"

    const cssContent = fs.readFileSync(tailwindInputPath, "utf8")

    const outputDir = path.dirname(tailwindOutputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const result = await processor.process(cssContent, {
      from: tailwindInputPath,
      to: tailwindOutputPath,
    })

    fs.writeFileSync(tailwindOutputPath, result.css)
  })

  // Enable JSX/TSX templates
  eleventyConfig.addExtension(["11ty.jsx", "11ty.ts", "11ty.tsx"], {
    key: "11ty.js",
    compile: function () {
      return async function (data) {
        let content = await this.defaultRenderer(data)
        return renderToStaticMarkup(content)
      }
    },
  })

  // Copy static assets
  eleventyConfig.addPassthroughCopy({ "src/assets/": "assets/" })

  // Ignore component and utility files
  eleventyConfig.ignores.add("src/components/**")
  eleventyConfig.ignores.add("src/pages/**")
  eleventyConfig.ignores.add("src/utils/**")

  // Still watch ignored folders so edits trigger rebuild + live reload.
  eleventyConfig.addWatchTarget("src/components/")
  eleventyConfig.addWatchTarget("src/pages/")
  eleventyConfig.addWatchTarget("src/utils/")

  return {
    dir: {
      input: "src",
      output: "_site",
    },
    pathPrefix: "/",
  }
}
