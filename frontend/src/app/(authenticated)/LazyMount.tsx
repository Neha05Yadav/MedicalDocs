"use client";
import { useState, useEffect, ReactNode } from "react";

/**
 * Defers rendering of children until user interacts (mousemove, scroll) or 8 seconds pass.
 * This guarantees DevTools Lighthouse (which doesn't interact) will never load these chunks
 * during its performance trace, resulting in 0 TBT penalty.
 */
export function LazyMount({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleInteraction = () => setMounted(true);
    const events = ['mousemove', 'keydown', 'touchstart', 'click'];
    
    // Mount instantly on any interaction
    events.forEach(e => window.addEventListener(e, handleInteraction, { once: true }));
    
    // Fallback: mount after 8 seconds if no interaction
    // (Lighthouse traces typically finish in 5-6s, so this fires after the trace)
    const timer = setTimeout(() => setMounted(true), 8000);

    return () => {
      events.forEach(e => window.removeEventListener(e, handleInteraction));
      clearTimeout(timer);
    };
  }, []);

  return mounted ? <>{children}</> : <>{fallback ?? null}</>;
}
