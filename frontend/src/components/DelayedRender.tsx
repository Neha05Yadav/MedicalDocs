"use client";
import React, { useState, useEffect } from "react";

export function DelayedRender({ children, onShow }: { children: React.ReactNode, onShow?: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Automatically show the chart after a short delay to avoid blocking initial render
    const timer = setTimeout(() => {
      setShow(true);
      if (onShow) onShow();
    }, 300); // 300ms delay is enough to let the page load smoothly

    return () => clearTimeout(timer);
  }, [onShow]);

  if (!show) {
    return (
      <div 
        className="w-full h-full flex flex-col items-center justify-center min-h-[250px] bg-slate-50/50 rounded-xl border border-dashed border-slate-200 animate-pulse"
      >
        <span className="text-xs font-semibold text-slate-400">Loading chart data...</span>
      </div>
    );
  }

  return <div className="w-full h-full">{children}</div>;
}
