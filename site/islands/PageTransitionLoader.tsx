import { useEffect, useState } from "preact/hooks";
import { FullPageLoading } from "../components/LoadingSpinner.tsx";

/**
 * Component that shows a loading spinner during page transitions
 * with a maximum timeout of 2 seconds
 */
export default function PageTransitionLoader() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const LOADING_TIMEOUT = 2000; // 2 seconds timeout

  useEffect(() => {
    if (typeof window === "undefined") return;

    let loadingTimer: number | undefined;
    let observer: MutationObserver | null = null;

    const handleNavigationStart = () => {
      setIsLoading(true);
      clearTimeout(loadingTimer);
      loadingTimer = setTimeout(() => {
        setIsLoading(false);
      }, LOADING_TIMEOUT);
    };

    const handleNavigationEnd = () => {
      clearTimeout(loadingTimer);
      setIsLoading(false);
    };

    // Observer para detectar mudanças no body
    observer = new MutationObserver(() => handleNavigationEnd());
    observer.observe(document.body, { childList: true, subtree: true });

    const handlePopState = () => {
      handleNavigationStart();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      clearTimeout(loadingTimer);
      window.removeEventListener("popstate", handlePopState);
      observer?.disconnect();
    };
  }, []);

  return isLoading ? <FullPageLoading /> : null;
}
