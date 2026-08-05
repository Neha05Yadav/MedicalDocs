"use client";

import { useEffect, useRef, useState } from "react";

const MAX_SUGGESTIONS = 8;

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();

const isDashboardSearch = (input: HTMLInputElement) => {
  const placeholder = String(input.placeholder || "").toLowerCase();
  return input.type === "search" || placeholder.includes("search");
};

const collectSuggestions = (query: string) => {
  const content = document.querySelector<HTMLElement>("[data-dashboard-content]");
  if (!content) return [];

  const normalizedQuery = query.toLocaleLowerCase();
  const values = new Set<string>();
  const selectors = [
    "td",
    "option",
    "[data-search-suggestion]",
    "article h2",
    "article h3",
    "article h4",
    "li h2",
    "li h3",
    "li h4",
  ].join(",");

  content.querySelectorAll<HTMLElement>(selectors).forEach((element) => {
    const value = normalize(
      element instanceof HTMLOptionElement ? element.label || element.value : element.innerText,
    );
    if (
      value.length >= 2 &&
      value.length <= 100 &&
      value.toLocaleLowerCase() !== normalizedQuery &&
      value.toLocaleLowerCase().includes(normalizedQuery)
    ) {
      values.add(value);
    }
  });

  if (values.size < MAX_SUGGESTIONS) {
    normalize(content.innerText)
      .split(/\s*[\n|•]+\s*/)
      .map(normalize)
      .filter((value) => value.length >= 2 && value.length <= 100)
      .filter((value) => value.toLocaleLowerCase().includes(normalizedQuery))
      .forEach((value) => values.add(value));
  }

  return Array.from(values)
    .sort((left, right) => {
      const leftStarts = left.toLocaleLowerCase().startsWith(normalizedQuery) ? 0 : 1;
      const rightStarts = right.toLocaleLowerCase().startsWith(normalizedQuery) ? 0 : 1;
      return leftStarts - rightStarts || left.length - right.length || left.localeCompare(right);
    })
    .slice(0, MAX_SUGGESTIONS);
};

export default function DashboardSearchAutocomplete() {
  const [input, setInput] = useState<HTMLInputElement | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = (target: HTMLInputElement) => {
      const rect = target.getBoundingClientRect();
      setPosition({ left: rect.left, top: rect.bottom + 6, width: rect.width });
    };

    const refresh = (target: HTMLInputElement) => {
      const query = target.value.trim();
      setInput(target);
      updatePosition(target);
      setSuggestions(query.length >= 1 ? collectSuggestions(query) : []);
      setActiveIndex(-1);
    };

    const handleInput = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && isDashboardSearch(target)) refresh(target);
    };

    const handleFocus = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && isDashboardSearch(target)) refresh(target);
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (popupRef.current?.contains(target) || input?.contains(target)) return;
      setSuggestions([]);
    };

    const handleViewportChange = () => input && updatePosition(input);

    document.addEventListener("input", handleInput, true);
    document.addEventListener("focusin", handleFocus, true);
    document.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      document.removeEventListener("input", handleInput, true);
      document.removeEventListener("focusin", handleFocus, true);
      document.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [input]);

  const chooseSuggestion = (value: string) => {
    if (!input) return;
    const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    valueSetter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
    setSuggestions([]);
  };

  if (!input || suggestions.length === 0) return null;

  return (
    <div
      ref={popupRef}
      role="listbox"
      aria-label="Search suggestions"
      className="fixed z-[1000] overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.18)]"
      style={{ left: position.left, top: position.top, width: Math.max(position.width, 240) }}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
        if (event.key === "ArrowUp") setActiveIndex((index) => Math.max(index - 1, 0));
        if (event.key === "Enter" && activeIndex >= 0) chooseSuggestion(suggestions[activeIndex]);
        if (event.key === "Escape") setSuggestions([]);
      }}
    >
      <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        Suggestions
      </p>
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion}
          type="button"
          role="option"
          aria-selected={activeIndex === index}
          className={`block w-full truncate px-3 py-2.5 text-left text-sm font-medium transition-colors ${
            activeIndex === index ? "bg-cyan-50 text-cyan-800" : "text-slate-700 hover:bg-slate-50"
          }`}
          onMouseEnter={() => setActiveIndex(index)}
          onClick={() => chooseSuggestion(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
