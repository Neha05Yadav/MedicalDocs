"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the heavy Sidebar client component with ssr: false
// This ensures it does not block the initial HTML or hydration on mobile.
const DashboardSidebarClient = dynamic(
  () => import("./DashboardSidebarClient"),
  { ssr: false }
);

export default function MobileDeferredSidebar() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if the screen is desktop size
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsDesktop(true);
      } else {
        setIsDesktop(false);
      }
    };

    // Initial check
    handleResize();

    // Listen to resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // On mobile, render nothing to save massive React hydration time (TBT)
  if (!isDesktop) return null;

  // On desktop, render the sidebar
  return <DashboardSidebarClient />;
}
