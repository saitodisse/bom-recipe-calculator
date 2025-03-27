import { defineApp } from "$fresh/server.ts";
import { getCookies } from "jsr:@std/http/cookie";

export default defineApp(async (req, ctx) => {
  // Get mode from cookie on the server side
  const cookies = getCookies(req.headers);
  const mode = cookies["mode"] || "light";

  return (
    <html class={mode === "dark" ? "dark" : ""}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>bom-recipe-calculator</title>
        <link rel="stylesheet" href="/styles.css" />
        {/* Load appropriate highlight.js theme based on server-determined mode */}
        <link 
          rel="stylesheet" 
          id="highlight-theme" 
          href={mode === "dark" 
            ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"
            : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css"
          } 
        />
        {/* No client-side theme detection needed anymore */}
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
