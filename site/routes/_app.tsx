import { defineApp } from "$fresh/server.ts";
import { getCookies } from "jsr:@std/http@1.1.3/cookie";

export default defineApp((req, ctx) => {
  // Get mode from cookie on the server side
  const cookies = getCookies(req.headers);
  const mode = cookies["mode"] || "light";

  return (
    <html class={mode === "dark" ? "dark" : ""}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Build clear bills of materials from nested recipes."
        />
        <link rel="icon" href="/logo.svg" />
        <title>BOM Recipe Calculator</title>
        <link rel="stylesheet" href="/styles.css" />
        {/* Load appropriate highlight.js theme based on server-determined mode */}
        <link
          rel="stylesheet"
          id="highlight-theme"
          href={mode === "dark"
            ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"
            : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css"}
        />
      </head>
      <body>
        <ctx.Component />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js">
        </script>
        <script>hljs.highlightAll();</script>
      </body>
    </html>
  );
});
