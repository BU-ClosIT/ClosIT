import { useEffect, useState } from "react";

/**
 * Hook to detect mobile viewport. SSR-safe (returns false on server).
 * @param breakpoint pixel width to consider mobile (default 768)
 */
const useIsMobile = (breakpoint = 768) => {
  // Start with a consistent value for SSR and initial client render to avoid
  // hydration mismatches. We'll update on mount.
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setIsMobile((e as any).matches);

    // set initial on mount
    setIsMobile(mq.matches);

    // add listener (with modern/older API fallbacks)
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler as EventListener);
    } else if (typeof mq.addListener === "function") {
      mq.addListener(handler);
    }

    return () => {
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", handler as EventListener);
      } else if (typeof mq.removeListener === "function") {
        mq.removeListener(handler);
      }
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
