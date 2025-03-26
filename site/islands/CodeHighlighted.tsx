import { useEffect } from "preact/hooks";

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeHighlighted({
  code,
  language,
}: CodeBlockProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).hljs) {
      (window as any).hljs.highlightAll();
    }
  }, []);

  return (
    <pre>
      <code class={`language-${language} rounded my-3`}>{code}</code>
    </pre>
  );
}
