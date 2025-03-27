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
    if (!window) return;
    window.location.href = `/?mode=${newMode}`;
  };

  useEffect(() => {
    if (!window) return;
    // if modeFromQuery redirect to root without querystrings
    if (modeFromQuery) {
      window.location.href = `/`;
    }
  }, []);

  return (
    <div>
      {(modeFromQuery || modeFromCookie) === "light"
        ? (
          <button
            className="text-foreground hover:text-foreground/80"
            onClick={() => handleModeChange("dark")}
          >
            <Lng en="light" pt="claro" />
          </button>
        )
        : (
          <button
            className="text-foreground hover:text-foreground/80"
            onClick={() => handleModeChange("light")}
          >
            <Lng en="dark" pt="escuro" />
          </button>
        )}
    </div>
  );
}
