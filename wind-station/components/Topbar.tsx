"use client";

import { useState, useEffect } from "react";

interface TopbarProps {
  title: string;
  subtitle: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const update = () => {
      setClock(new Date().toLocaleTimeString("id-ID", { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const openSidebar = () => {
    document.getElementById("sidebar")?.classList.add("open");
    document.getElementById("overlay")?.classList.add("show");
  };

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/5 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={openSidebar}
                className="lg:hidden w-10 h-10 rounded-xl glass flex items-center justify-center shrink-0 active:scale-95 transition">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white leading-tight">{title}</h1>
          <p className="text-[11px] sm:text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="glass rounded-full px-3 py-2 hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow"></span>
          <span className="text-[11px] font-medium text-emerald-400">LIVE</span>
        </div>
        <div className="glass rounded-full px-3 py-2 text-[11px] font-mono text-slate-300">
          {clock}
        </div>
      </div>
    </header>
  );
}