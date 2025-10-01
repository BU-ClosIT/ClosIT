import { useEffect, useState } from "react";

/**
 * Hook to detect mobile viewport. SSR-safe (returns false on server).
 * @param breakpoint pixel width to consider mobile (default 768)
 */
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile((e as any).matches);

    // set initial
    setIsMobile(mq.matches);

    // add listener
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler as any);

    return () => {
      mq.removeEventListener("change", handler);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
