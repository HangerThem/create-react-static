import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import prompts from "prompts"
import pc from "picocolors"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templateDir = path.resolve(__dirname, "../template")

interface ProjectConfig {
  name: string
  title: string
  description: string
}

async function main() {
  console.log()
  console.log(pc.cyan(pc.bold("🚀 create-react-static")))
  console.log(pc.dim("React-to-static-HTML project generator"))
  console.log()

  // Get project name from args or prompt
  let projectName = process.argv[2]

  const response = await prompts(
    [
      {
        type: projectName ? null : "text",
        name: "name",
        message: "Project name:",
        initial: "my-static-site",
        validate: (value) =>
          /^[a-z0-9-]+$/.test(value) ||
          "Use lowercase letters, numbers, and hyphens only",
      },
      {
        type: "text",
        name: "title",
        message: "Site title:",
        initial: "My Static Site",
      },
      {
        type: "text",
        name: "description",
        message: "Site description:",
        initial: "A blazing fast static site built with React",
      },
    ],
    {
      onCancel: () => {
        console.log(pc.red("\n✖ Operation cancelled"))
        process.exit(1)
      },
    }
  )

  const config: ProjectConfig = {
    name: projectName || response.name,
    title: response.title,
    description: response.description,
  }

  const targetDir = path.resolve(process.cwd(), config.name)

  // Check if directory exists
  if (fs.existsSync(targetDir)) {
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: `Directory ${pc.yellow(config.name)} already exists. Overwrite?`,
      initial: false,
    })

    if (!overwrite) {
      console.log(pc.red("✖ Operation cancelled"))
      process.exit(1)
    }

    fs.rmSync(targetDir, { recursive: true })
  }

  console.log()
  console.log(`Creating project in ${pc.green(targetDir)}...`)
  console.log()

  // Copy template
  copyDir(templateDir, targetDir)

  // Update files with project config
  updatePackageJson(targetDir, config)
  updateIndexPage(targetDir, config)

  // Install instructions
  console.log(pc.green("✔ Project created successfully!"))
  console.log()
  console.log("Next steps:")
  console.log()
  console.log(`  ${pc.cyan("cd")} ${config.name}`)
  console.log(`  ${pc.cyan("pnpm install")}  ${pc.dim("# or npm install")}`)
  console.log(`  ${pc.cyan("pnpm dev")}      ${pc.dim("# start dev server")}`)
  console.log()
  console.log(pc.dim("Build for production:"))
  console.log(`  ${pc.cyan("pnpm build")}`)
  console.log()
}

function copyDir(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true })

  for (const file of fs.readdirSync(src)) {
    const srcPath = path.join(src, file)
    const destPath = path.join(dest, file)

    const stat = fs.statSync(srcPath)
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function updatePackageJson(targetDir: string, config: ProjectConfig) {
  const pkgPath = path.join(targetDir, "package.json")
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))

  pkg.name = config.name
  pkg.description = config.description

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
}

function updateIndexPage(targetDir: string, config: ProjectConfig) {
  const indexPath = path.join(targetDir, "src/index.11ty.tsx")
  let content = fs.readFileSync(indexPath, "utf-8")

  content = content.replace(
    /export const data = \{[\s\S]*?\}/,
    `export const data = {
  title: "${config.title}",
  description: "${config.description}",
}`
  )

  fs.writeFileSync(indexPath, content)
}

main().catch((err) => {
  console.error(pc.red("Error:"), err)
  process.exit(1)
})
