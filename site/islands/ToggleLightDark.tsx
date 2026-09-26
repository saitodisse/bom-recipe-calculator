// ToggleLightDark.tsx
import Lng from "./Lng.tsx";
import { useEffect } from "preact/hooks";

interface ToggleLightDarkProps {
  modeFromQuery: string | null;
  modeFromCookie: string | null;
}

export default function ToggleLightDark(
  { modeFromQuery, modeFromCookie }: ToggleLightDarkProps,
) {
  const handleModeChange = (newMode: string) => {
    globalThis.location.href = `/?mode=${newMode}`;
  };

  useEffect(() => {
    // if modeFromQuery redirect to root without querystrings
    if (modeFromQuery) {
      globalThis.location.href = `/`;
    }
  }, []);

  return (
    <div className="theme-toggle">
      {(modeFromQuery || modeFromCookie) === "light"
        ? (
          <button
            type="button"
            className="theme-toggle-button"
            onClick={() => handleModeChange("dark")}
          >
            <Lng en="light" pt="claro" />
          </button>
        )
        : (
          <button
            type="button"
            className="theme-toggle-button"
            onClick={() => handleModeChange("light")}
          >
            <Lng en="dark" pt="escuro" />
          </button>
        )}
    </div>
  );
}
