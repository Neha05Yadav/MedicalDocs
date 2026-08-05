"use client";

import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeaderClient from "./DashboardHeaderClient";
import DashboardSearchAutocomplete from "./DashboardSearchAutocomplete";
import styles from "./dashboard-theme.module.css";
import { useEffect } from "react";

if (typeof window !== "undefined") {
  const guardedWindow = window as typeof window & { __medicalDocsFetchWrapped?: boolean };
  if (!guardedWindow.__medicalDocsFetchWrapped) {
    guardedWindow.__medicalDocsFetchWrapped = true;
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args) => {
      const res = await originalFetch(...args);
      if (res.status === 401 && !window.location.pathname.includes("/login") && !window.location.pathname.includes("/auth")) {
        const payload = await res.clone().json().catch(() => ({}));
        const message = String(payload?.message || '');
        const token = localStorage.getItem("token");
        const isSessionFailure = !token || message === 'Unauthorized' || message === 'Management login required.';
        if (isSessionFailure) {
          localStorage.removeItem("token");
          window.location.href = `/auth?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
      }
      return res;
    };
  }
}

const themes = {
  patient: ["#0891b2", "#22d3ee", "8 145 178"],
  clinic: ["#2563eb", "#38bdf8", "37 99 235"],
  hospital: ["#4f46e5", "#818cf8", "79 70 229"],
  laboratory: ["#7c3aed", "#c084fc", "124 58 237"],
  pharmacy: ["#059669", "#22d3ee", "5 150 105"],
  management: ["#0b5f59", "#14b8a6", "11 95 89"],
} as const;

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const themeName = pathname.startsWith("/clinic")
    ? "clinic"
    : pathname.startsWith("/hospital")
      ? "hospital"
      : pathname.startsWith("/laboratory")
        ? "laboratory"
        : pathname.startsWith("/pharmacy")
          ? "pharmacy"
          : pathname.startsWith("/management")
            ? "management"
            : "patient";
  const [accent, accent2, accentRgb] = themes[themeName];
  const themeVariables = {
    "--dash-accent": accent,
    "--dash-accent-2": accent2,
    "--dash-accent-rgb": accentRgb,
  } as CSSProperties;

  useEffect(() => {
    const normalize = (value: string | null | undefined) =>
      String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

    const removeDuplicatePageHeading = () => {
      const canonicalHeading = document.querySelector<HTMLElement>("[data-dashboard-page-title]");
      const content = document.querySelector<HTMLElement>("[data-dashboard-content]");
      const canonicalTitle = normalize(canonicalHeading?.textContent);
      if (!canonicalTitle || !content) return;

      content.querySelectorAll<HTMLElement>("h1, h2").forEach(heading => {
        const isDuplicate = normalize(heading.textContent) === canonicalTitle;
        if (!isDuplicate) return;
        heading.dataset.duplicateDashboardHeading = "true";
        const subtitle = heading.nextElementSibling as HTMLElement | null;
        if (subtitle?.tagName === "P") subtitle.dataset.duplicateDashboardSubtitle = "true";
      });
    };

    // Run only after React has hydrated the current route. A document-wide
    // MutationObserver can mutate the next route's server HTML before React
    // hydrates it, which produces an attribute mismatch in development.
    const frame = window.requestAnimationFrame(removeDuplicatePageHeading);
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <div className={styles.shell} style={themeVariables} data-dashboard-theme={themeName}>
      <DashboardSearchAutocomplete />
      <DashboardSidebar />

      {/* Main Content */}
      <main className={styles.main}>
        <DashboardHeaderClient />

        <div className={styles.content} data-dashboard-content>
          {children}
        </div>
      </main>
    </div>
  );
}
