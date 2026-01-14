import { hydrateRoot } from "react-dom/client"
import { App } from "./components/App.11ty"

// Registry of components that can be hydrated on the client
// Add new components here as you create them
const registry = { App }

// Hydrate the root element with the appropriate component
const root = document.getElementById("root")
if (root) {
  const compName = (root.dataset.component as keyof typeof registry) ?? "App"
  const Component = registry[compName] ?? App
  hydrateRoot(root, <Component />)
}
