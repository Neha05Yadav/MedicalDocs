"use client";

import React, { useState, useEffect } from 'react';

export default function DeferredChart({ children }: { children: React.ReactNode }) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setShouldRender(true);
  }, []);

  if (!shouldRender) {
    return <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm bg-slate-50/50 rounded-xl animate-pulse">Loading chart data...</div>;
  }

  return <>{children}</>;
}
