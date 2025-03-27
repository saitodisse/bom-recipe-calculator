import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>bom-recipe-calculator</title>
        <link rel="stylesheet" href="/styles.css" />
        {/* Dynamic stylesheet loading will be handled by script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              // Get mode from localStorage, default to light
              const mode = localStorage.getItem('mode') || 'light';
              // Create link element
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.id = 'highlight-theme';
              // Set appropriate stylesheet based on mode
              link.href = mode === 'dark' 
                ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css'
                : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css';
              // Append to head
              document.head.appendChild(link);
            })();
          `,
          }}
        />
      </head>
      <body>
        <Component />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js">
        </script>
        <script>hljs.highlightAll();</script>
      </body>
    </html>
  );
}
