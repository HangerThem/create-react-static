import { App } from "./components/App.11ty"

export const data = {
  title: "{{title}}",
  description: "{{description}}",
}

export default function Page({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link href="./style/global.css" rel="stylesheet" />
      </head>
      <body className="bg-white text-secondary antialiased">
        <div id="root" data-component="App">
          <App />
        </div>

        <script src="./assets/client.min.js"></script>
      </body>
    </html>
  )
}
