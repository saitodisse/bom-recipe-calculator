import { ComponentChildren, JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import Lng from "../islands/Lng.tsx";

interface LoadingSpinnerProps {
  /** Optional message to display below the spinner */
  message?: string | ComponentChildren;
  /** Size of the spinner (small, medium, large) */
  size?: "small" | "medium" | "large";
  /** Whether to show a full-page overlay */
  fullPage?: boolean;
  /** Optional class name for additional styling */
  className?: string;
  /** Timeout in milliseconds (default: 5000) */
  timeout?: number;
}

/**
 * Animated loading spinner component with automatic timeout
 */
export default function LoadingSpinner({
  message,
  size = "medium",
  fullPage = false,
  className = "",
  timeout = 2000,
}: LoadingSpinnerProps) {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    // Set timeout to hide spinner after specified time
    const timer = setTimeout(() => {
      setVisible(false);
    }, timeout);

    // Clean up timer
    return () => clearTimeout(timer);
  }, [timeout]);

  // If timeout has elapsed, don't render anything
  if (!visible) {
    return null;
  }

  // Size mappings
  const sizeClasses = {
    small: "w-5 h-5 border-2",
    medium: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4",
  };

  // Container classes based on fullPage prop
  const containerClasses = fullPage
    ? "fixed inset-0 flex items-center justify-center bg-background/80 z-50"
    : "flex flex-col items-center justify-center py-6";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div
        className={`${
          sizeClasses[size]
        } rounded-full border-t-primary border-r-primary/30 border-b-primary/10 border-l-primary/60 animate-spin`}
      />
      {message && (
        <div className="mt-4 text-foreground text-center">
          {message}
        </div>
      )}
    </div>
  );
}

/**
 * Full page loading component with a message
 */
export function FullPageLoading() {
  return (
    <LoadingSpinner
      fullPage
      size="large"
      message={
        <Lng
          en="Loading..."
          pt="Carregando..."
        />
      }
    />
  );
}

/**
 * Content loading component with a message
 */
export function ContentLoading() {
  return (
    <LoadingSpinner
      size="medium"
      message={
        <Lng
          en="Loading content..."
          pt="Carregando conteúdo..."
        />
      }
    />
  );
}
