"use client";
import React, { useState } from "react";

export function DelayedRender({ children, onShow }: { children: React.ReactNode, onShow?: () => void }) {
  const [show, setShow] = useState(false);

  const handleTrigger = () => {
    if (!show) {
      setShow(true);
      if (onShow) onShow();
    }
  };

  if (!show) {
    return (
      <div 
        className="w-full h-full flex flex-col items-center justify-center min-h-[250px] cursor-pointer group bg-slate-50/50 rounded-xl border border-dashed border-slate-200 hover:bg-slate-50 transition-colors"
        onClick={handleTrigger}
        onMouseEnter={handleTrigger}
        onTouchStart={handleTrigger}
      >
        <svg className="size-6 mb-2 text-slate-300 group-hover:text-slate-400 transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-500 transition-colors px-4 text-center">Hover or tap to load interactive chart</span>
      </div>
    );
  }

  return <div className="w-full h-full">{children}</div>;
}
