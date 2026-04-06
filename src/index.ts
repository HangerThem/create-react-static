import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
import prompts from "prompts"
import pc from "picocolors"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templateDir = path.resolve(__dirname, "../template")

interface ProjectConfig {
  packageName: string
  dirName: string
  title: string
  description: string
  packageManager: PackageManager
  git: boolean
  install: boolean
}

type PackageManager = "pnpm" | "npm" | "yarn" | "bun"

function detectPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent ?? ""
  if (userAgent.startsWith("pnpm/")) return "pnpm"
  if (userAgent.startsWith("yarn/")) return "yarn"
  if (userAgent.startsWith("bun/")) return "bun"
  return "npm"
}

function isValidPackageName(value: string) {
  // Accepts unscoped "my-app" and scoped "@scope/my-app" style names.
  // (Deliberately stricter than full npm spec; keeps scaffolds predictable.)
  return /^(@[a-z0-9-]+\/)?[a-z0-9-]+$/.test(value)
}

function toDefaultDirName(packageName: string) {
  return packageName.startsWith("@")
    ? packageName.split("/")[1] ?? "my-static-site"
    : packageName
}

function isValidDirName(value: string) {
  return /^[a-z0-9-]+$/.test(value)
}

function parseArgs(argv: string[]) {
  let name: string | undefined
  let dir: string | undefined
  let pm: PackageManager | undefined
  let yes = false
  let overwrite = false
  let git: boolean | undefined
  let install: boolean | undefined
  let title: string | undefined
  let description: string | undefined
  let help = false

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "-h" || arg === "--help") {
      help = true
      continue
    }

    if (arg === "-y" || arg === "--yes") {
      yes = true
      continue
    }

    if (arg === "-f" || arg === "--overwrite") {
      overwrite = true
      continue
    }

    if (arg === "--pm") {
      const next = argv[i + 1]
      if (next === "pnpm" || next === "npm" || next === "yarn" || next === "bun") {
        pm = next
        i++
      }
      continue
    }

    if (arg === "--dir") {
      const next = argv[i + 1]
      if (next && !next.startsWith("-")) {
        dir = next
        i++
      }
      continue
    }

    if (arg === "--git") {
      git = true
      continue
    }
    if (arg === "--no-git") {
      git = false
      continue
    }

    if (arg === "--install") {
      install = true
      continue
    }
    if (arg === "--no-install") {
      install = false
      continue
    }

    if (arg === "--title") {
      const next = argv[i + 1]
      if (typeof next === "string") {
        title = next
        i++
      }
      continue
    }

    if (arg === "--description") {
      const next = argv[i + 1]
      if (typeof next === "string") {
        description = next
        i++
      }
      continue
    }

    if (!arg.startsWith("-") && !name) {
      name = arg
    }
  }

  return {
    name,
    dir,
    pm,
    yes,
    overwrite,
    git,
    install,
    title,
    description,
    help,
  }
}

function jsStringLiteral(value: string) {
  return JSON.stringify(value)
}

async function main() {
  console.log()
  console.log(pc.cyan(pc.bold("🚀 create-react-static")))
  console.log(pc.dim("React-to-static-HTML project generator"))
  console.log()

  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    console.log("Usage:")
    console.log()
    console.log(
      `  ${pc.cyan("create-react-static")} ${pc.dim("[package-name]")} ${pc.dim("[options]")}`
    )
    console.log()
    console.log("Options:")
    console.log(`  ${pc.cyan("--pm")} pnpm|npm|yarn|bun     Package manager`)
    console.log(`  ${pc.cyan("--dir")} <name>              Target directory (default from package name)`)
    console.log(`  ${pc.cyan("-y, --yes")}                 Skip prompts and use defaults`)
    console.log(`  ${pc.cyan("-f, --overwrite")}           Overwrite target directory if it exists`)
    console.log(`  ${pc.cyan("--git / --no-git")}          Initialize a git repo (default: yes)`)
    console.log(`  ${pc.cyan("--install / --no-install")}  Install dependencies (default: no)`)
    console.log(`  ${pc.cyan("--title")} <text>            Site title`)
    console.log(`  ${pc.cyan("--description")} <text>      Site description`)
    console.log()
    process.exit(0)
  }

  const detectedPm = detectPackageManager()
  const packageManager: PackageManager = args.pm ?? detectedPm

  let packageName = args.name
  if (packageName && !isValidPackageName(packageName)) {
    console.log(
      pc.yellow(
        `⚠ Package name ${pc.bold(packageName)} is invalid (use lowercase letters, numbers, hyphens; optional @scope/).`
      )
    )
    packageName = undefined
  }

  const defaults = {
    packageName: packageName ?? "my-static-site",
    dirName: args.dir ?? (packageName ? toDefaultDirName(packageName) : "my-static-site"),
    title: args.title ?? "My Static Site",
    description: args.description ?? "A blazing fast static site built with React",
    packageManager,
    git: args.git ?? true,
    install: args.install ?? false,
  }

  const response = args.yes
    ? {
        packageName: defaults.packageName,
        dirName: defaults.dirName,
        title: defaults.title,
        description: defaults.description,
        packageManager: defaults.packageManager,
        git: defaults.git,
        install: defaults.install,
      }
    : await prompts(
        [
          {
            type: packageName ? null : "text",
            name: "packageName",
            message: "Package name:",
            initial: defaults.packageName,
            validate: (value) =>
              isValidPackageName(value) ||
              "Use lowercase letters, numbers, hyphens; optional @scope/name",
          },
          {
            type: args.dir ? null : "text",
            name: "dirName",
            message: "Directory name:",
            initial: defaults.dirName,
            validate: (value) =>
              isValidDirName(value) ||
              "Use lowercase letters, numbers, and hyphens only",
          },
          {
            type: args.pm ? null : "select",
            name: "packageManager",
            message: "Package manager:",
            choices: [
              { title: "pnpm", value: "pnpm" },
              { title: "npm", value: "npm" },
              { title: "yarn", value: "yarn" },
              { title: "bun", value: "bun" },
            ],
            initial: ["pnpm", "npm", "yarn", "bun"].indexOf(packageManager),
          },
          {
            type: args.title ? null : "text",
            name: "title",
            message: "Site title:",
            initial: defaults.title,
          },
          {
            type: args.description ? null : "text",
            name: "description",
            message: "Site description:",
            initial: defaults.description,
          },
          {
            type: typeof args.git === "boolean" ? null : "confirm",
            name: "git",
            message: "Initialize a git repository?",
            initial: defaults.git,
          },
          {
            type: typeof args.install === "boolean" ? null : "confirm",
            name: "install",
            message: "Install dependencies now?",
            initial: defaults.install,
          },
        ],
        {
          onCancel: () => {
            console.log(pc.red("\n✖ Operation cancelled"))
            process.exit(1)
          },
        }
      )

  const resolvedPackageName =
    (packageName ?? response.packageName ?? defaults.packageName) as string
  const resolvedDirName =
    (args.dir ?? response.dirName ?? defaults.dirName) as string

  const config: ProjectConfig = {
    packageName: resolvedPackageName,
    dirName: resolvedDirName,
    title: (args.title ?? response.title ?? defaults.title) as string,
    description: (args.description ?? response.description ?? defaults.description) as string,
    packageManager: (args.pm ?? response.packageManager ?? defaults.packageManager) as PackageManager,
    git: (args.git ?? response.git ?? defaults.git) as boolean,
    install: (args.install ?? response.install ?? defaults.install) as boolean,
  }

  if (!isValidPackageName(config.packageName)) {
    console.log(pc.red("✖ Invalid package name"))
    process.exit(1)
  }

  if (!isValidDirName(config.dirName)) {
    console.log(pc.red("✖ Invalid directory name"))
    process.exit(1)
  }

  const targetDir = path.resolve(process.cwd(), config.dirName)

  if (fs.existsSync(targetDir)) {
    const overwrite =
      args.overwrite ||
      (!args.yes &&
        (
          await prompts({
            type: "confirm",
            name: "overwrite",
            message: `Directory ${pc.yellow(config.dirName)} already exists. Overwrite?`,
            initial: false,
          })
        ).overwrite)

    if (!overwrite) {
      console.log(pc.red("✖ Operation cancelled"))
      process.exit(1)
    }

    fs.rmSync(targetDir, { recursive: true, force: true })
  }

  console.log()
  console.log(`Creating project in ${pc.green(targetDir)}...`)
  console.log()

  copyDir(templateDir, targetDir)

  updatePackageJson(targetDir, config)
  updateIndexPage(targetDir, config)

  if (config.git) {
    const result = spawnSync("git", ["init"], {
      cwd: targetDir,
      stdio: "ignore",
      shell: false,
    })
    if (result.status !== 0) {
      console.log(pc.yellow("⚠ Could not initialize git repo (is git installed?)"))
    }
  }

  if (config.install) {
    const installCmd =
      config.packageManager === "pnpm"
        ? { command: "pnpm", args: ["install"] }
        : config.packageManager === "yarn"
          ? { command: "yarn", args: [] }
          : config.packageManager === "bun"
            ? { command: "bun", args: ["install"] }
            : { command: "npm", args: ["install"] }

    const result = spawnSync(installCmd.command, installCmd.args, {
      cwd: targetDir,
      stdio: "inherit",
      shell: false,
    })
    if (result.status !== 0) {
      console.log(pc.yellow("⚠ Dependency install failed; you can run it manually later."))
    }
  }

  console.log(pc.green("✔ Project created successfully!"))
  console.log()
  console.log("Next steps:")
  console.log()
  console.log(`  ${pc.cyan("cd")} ${config.dirName}`)
  if (!config.install) {
    if (config.packageManager === "pnpm") console.log(`  ${pc.cyan("pnpm install")}`)
    else if (config.packageManager === "yarn") console.log(`  ${pc.cyan("yarn")}`)
    else if (config.packageManager === "bun") console.log(`  ${pc.cyan("bun install")}`)
    else console.log(`  ${pc.cyan("npm install")}`)
  }
  if (config.packageManager === "pnpm") {
    console.log(`  ${pc.cyan("pnpm dev")}      ${pc.dim("# start dev server")}`)
  } else if (config.packageManager === "yarn") {
    console.log(`  ${pc.cyan("yarn dev")}      ${pc.dim("# start dev server")}`)
  } else if (config.packageManager === "bun") {
    console.log(`  ${pc.cyan("bun run dev")}   ${pc.dim("# start dev server")}`)
  } else {
    console.log(`  ${pc.cyan("npm run dev")}   ${pc.dim("# start dev server")}`)
  }
  console.log()
  console.log(pc.dim("Build for production:"))
  if (config.packageManager === "pnpm") console.log(`  ${pc.cyan("pnpm build")}`)
  else if (config.packageManager === "yarn") console.log(`  ${pc.cyan("yarn build")}`)
  else if (config.packageManager === "bun") console.log(`  ${pc.cyan("bun run build")}`)
  else console.log(`  ${pc.cyan("npm run build")}`)
  console.log()
}

function copyDir(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true })

  for (const file of fs.readdirSync(src)) {
    if (
      file === ".git" ||
      file === "node_modules" ||
      file === "_site" ||
      file === ".DS_Store"
    ) {
      continue
    }

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

  pkg.name = config.packageName
  pkg.description = config.description
  pkg.private = true

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
}

function updateIndexPage(targetDir: string, config: ProjectConfig) {
  const indexPath = path.join(targetDir, "src/index.11ty.tsx")
  let content = fs.readFileSync(indexPath, "utf-8")

  content = content.replace(
    /export const data = \{[\s\S]*?\n\}/,
    `export const data = {
  title: ${jsStringLiteral(config.title)},
  description: ${jsStringLiteral(config.description)},
}`
  )

  fs.writeFileSync(indexPath, content)
}

main().catch((err) => {
  console.error(pc.red("Error:"), err)
  process.exit(1)
})
