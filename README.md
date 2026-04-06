# create-react-static

CLI to scaffold React-to-static-HTML projects with Eleventy, Tailwind CSS, and TypeScript.

## Usage

```bash
# Using npx (recommended)
npx create-react-static my-site

# Pick a package manager up-front (optional)
npx create-react-static my-site --pm pnpm

# Non-interactive (uses defaults where needed)
npx create-react-static my-site -y

# Overwrite if the folder exists
npx create-react-static my-site -f

# Scoped package name, but safe directory name
npx create-react-static @acme/my-site --dir my-site

# Or with pnpm
pnpm create react-static my-site

# Or install globally
npm install -g create-react-static
create-react-static my-site
```

## What You Get

- ⚛️ **React 19** - Modern React with hooks
- 🏗️ **Eleventy** - Fast static site generation
- 🎨 **Tailwind CSS** - Utility-first styling
- 🎬 **Framer Motion** - Animations out of the box
- 🔥 **Vite** - Lightning-fast build tool
- 📝 **TypeScript** - Full type safety

## Output

Pure static files (HTML, CSS, JS) that can be deployed anywhere:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any static file server

## License

MIT
