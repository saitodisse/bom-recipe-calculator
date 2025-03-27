import { useEffect, useState } from "preact/hooks";
import { getStorageItem, setStorageItem } from "../utils/storage.ts";
import Lng from "./Lng.tsx";

interface ToggleLightDarkProps {
}

export default function ToggleLightDark({}: ToggleLightDarkProps) {
  const [mode, setMode] = useState<string | null>(null);

  useEffect(() => {
    if (!mode) {
      const mode = getStorageItem("mode", "light");
      setMode(mode);

      if (mode === "dark") {
        document.documentElement.classList.toggle(
          "dark",
          localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
              window.matchMedia("(prefers-color-scheme: dark)").matches),
        );
      }
    }
  }, [mode]);

  return (
    <div>
      {/* toggle light/dark mode */}
      <button
        className="text-foreground hover:text-foreground/80"
        onClick={() => {
          setMode("light");
          document.documentElement.classList.toggle(
            "dark",
            false,
          );
          setStorageItem("mode", "light");
        }}
      >
        <Lng
          en="Light"
          pt="Claro"
        />
      </button>
      <button
        className="text-foreground hover:text-foreground/80"
        onClick={() => {
          setMode("dark");
          document.documentElement.classList.toggle(
            "dark",
            true,
          );
          setStorageItem("mode", "dark");
        }}
      >
        <Lng
          en="Dark"
          pt="Escuro"
        />
      </button>
    </div>
  );
}
