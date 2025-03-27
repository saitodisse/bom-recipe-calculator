import { type PageProps } from "$fresh/server.ts";
import { getCookies } from "jsr:@std/http/cookie";

export default function App({ Component, url }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>bom-recipe-calculator</title>
        <link rel="stylesheet" href="/styles.css" />
        {/* Script to manage theme based on cookie and X-Color-Mode header */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              // Check X-Color-Mode header if available
              const checkColorMode = async () => {
                try {
                  const response = await fetch(window.location.href);
                  const colorMode = response.headers.get('X-Color-Mode');
                  if (colorMode === 'dark' && !document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.add('dark');
                  } else if (colorMode === 'light' && document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error('Error checking color mode:', e);
                }
              };

              // Check cookies for mode
              const getCookie = (name) => {
                const value = "; " + document.cookie;
                const parts = value.split("; " + name + "=");
                if (parts.length === 2) return parts.pop().split(";").shift();
                return null;
              };

              // Determine mode based on cookie
              const mode = getCookie('mode') || 'light';
              
              // Apply dark class to html if needed
              if (mode === 'dark' && !document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.add('dark');
              }

              // Load appropriate highlight.js theme
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.id = 'highlight-theme';
              link.href = mode === 'dark' 
                ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css'
                : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css';
              document.head.appendChild(link);

              // Check color mode after page load
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', checkColorMode);
              } else {
                checkColorMode();
              }
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
