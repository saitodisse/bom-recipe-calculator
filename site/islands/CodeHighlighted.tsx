import { useEffect } from "preact/hooks";

interface CodeBlockProps {
  code: string;
  language: string;
}

type HighlightGlobal = typeof globalThis & {
  hljs?: { highlightAll: () => void };
};

export default function CodeHighlighted({
  code,
  language,
}: CodeBlockProps) {
  useEffect(() => {
    const browser = globalThis as HighlightGlobal;
    browser.hljs?.highlightAll();
  }, []);

  return (
    <div class="code-shell">
      <div class="code-toolbar">
        <span>{language}</span>
        <span>copy into your project</span>
      </div>
      <pre>
        <code class={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
