"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ClientTabs({ tabs }: { tabs: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || tabs[0];

  const handleTabClick = (tab: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (tab === tabs[0]) {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex bg-slate-100 p-1 rounded-xl w-full xl:w-auto overflow-x-auto no-scrollbar">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`flex-1 xl:flex-none whitespace-nowrap px-5 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
