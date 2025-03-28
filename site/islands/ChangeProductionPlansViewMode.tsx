import { useEffect, useState } from "preact/hooks";
import { getStorageItem, setStorageItem } from "../utils/storage.ts";

/**
 * Component for changing the view mode of production plans
 */
export default function ChangeProductionPlansViewMode() {
  const [viewMode, setViewMode] = useState<string>("detailed");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Skip for server-side rendering
    if (typeof window === "undefined") {
      return;
    }

    // Load the view mode from localStorage
    const savedViewMode = getStorageItem("productionPlansViewMode");
    if (savedViewMode) {
      setViewMode(savedViewMode);
    } else {
      // Set default view mode to detailed if not found in localStorage
      setStorageItem("productionPlansViewMode", "detailed");
    }
    setLoading(false);
  }, []);

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
    setStorageItem("productionPlansViewMode", mode);
    // Force a page reload to apply the changes
    window.location.reload();
  };

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-foreground">View:</span>
      <button
        onClick={() => handleViewModeChange("detailed")}
        className={`p-1 rounded ${
          viewMode === "detailed"
            ? "bg-primary text-primary-foreground"
            : "bg-background/10 text-foreground hover:bg-foreground/10"
        }`}
        title="Detailed View"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </button>
      <button
        onClick={() => handleViewModeChange("cards")}
        className={`p-1 rounded ${
          viewMode === "cards"
            ? "bg-primary text-primary-foreground"
            : "bg-background/10 text-foreground hover:bg-foreground/10"
        }`}
        title="Cards View"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      </button>
      <button
        onClick={() => handleViewModeChange("table")}
        className={`p-1 rounded ${
          viewMode === "table"
            ? "bg-primary text-primary-foreground"
            : "bg-background/10 text-foreground hover:bg-foreground/10"
        }`}
        title="Table View"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 14h18M3 18h18M3 6h18"
          />
        </svg>
      </button>
    </div>
  );
}
