/// <reference types="vite/client" />

import { hydrateRoot } from "react-dom/client"

const modules = import.meta.glob("./components/*.11ty.tsx", { eager: true })

const registry: Record<string, React.ComponentType> = {}
for (const [path, module] of Object.entries(modules)) {
  const name = path.match(/\/(\w+)\.11ty\.tsx$/)?.[1]
  if (name) registry[name] = (module as any)[name] || (module as any).default
}

// Hydrate the root element with the appropriate component
const root = document.getElementById("root")
if (root) {
  const Component = registry[root.dataset.component ?? "App"]
  if (Component) hydrateRoot(root, <Component />)
}
