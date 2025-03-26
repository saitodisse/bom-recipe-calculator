import { useEffect, useState } from "preact/hooks";

export default function ChangeProductsViewMode() {
  const [viewMode, setViewMode] = useState<string>("grid");

  useEffect(() => {
    // Load the view mode from localStorage on component mount
    const savedViewMode = localStorage.getItem("productsViewMode");
    if (savedViewMode) {
      setViewMode(savedViewMode);
    } else {
      // Set default view mode to grid if not found in localStorage
      localStorage.setItem("productsViewMode", "grid");
    }
  }, []);

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
    localStorage.setItem("productsViewMode", mode);
    // Force a page reload to apply the changes
    window.location.reload();
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">View:</span>
      <button
        onClick={() => handleViewModeChange("grid")}
        className={`p-1 rounded ${
          viewMode === "grid"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        title="Grid View"
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
        onClick={() => handleViewModeChange("list")}
        className={`p-1 rounded ${
          viewMode === "list"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        title="List View"
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
}
