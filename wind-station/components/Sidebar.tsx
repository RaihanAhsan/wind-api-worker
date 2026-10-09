"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const menuItems = [
  { href: "/", label: "Dashboard", section: "Utama",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/> },
  { href: "/windspeed", label: "Kecepatan Angin", section: "Sensor",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/> },
  { href: "/winddirection", label: "Arah Angin", section: "Sensor",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v4m0 12v4M2 12h4m12 0h4m-9 0a3 3 0 106 0 3 3 0 00-6 0z"/> },
  { href: "/humidity", label: "Suhu & Kelembapan", section: "Sensor",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/> },
  { href: "/solar", label: "Radiasi Surya", section: "Sensor",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/> },
  { href: "/rainfall", label: "Curah Hujan", section: "Sensor",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14.5A5.5 5.5 0 0013.5 9h-1.2a7 7 0 00-13.5 2.7 5 5 0 001.2 9.8h12a5.5 5.5 0 006.8-7zM8 19v2m4-2v3m4-3v2"/> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <aside
      id="sidebar"
      className={`glass-strong lg:fixed lg:top-0 lg:left-0 lg:bottom-0 lg:w-64 p-5 flex flex-col ${isOpen ? "open" : ""}`}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center glow-blue shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
          </svg>
        </div>
        <div>
          <div className="text-sm font-bold text-white leading-tight">Weather Station</div>
          <div className="text-[11px] text-slate-400">IoT Monitoring</div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 px-3 mb-2 font-semibold">Utama</div>
        {menuItems.filter(i => i.section === "Utama").map(item => (
          <Link key={item.href} href={item.href}
                className={`sidebar-link ${pathname === item.href ? "active" : ""}`}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {item.icon}
            </svg>
            <span>{item.label}</span>
          </Link>
        ))}

        <div className="text-[10px] uppercase tracking-wider text-slate-500 px-3 mt-5 mb-2 font-semibold">Sensor</div>
        {menuItems.filter(i => i.section === "Sensor").map(item => (
          <Link key={item.href} href={item.href}
                className={`sidebar-link ${pathname === item.href ? "active" : ""}`}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {item.icon}
            </svg>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="pt-4 mt-4 border-t border-white/5">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow"></span>
            <span className="text-[11px] font-medium text-emerald-400">SISTEM ONLINE</span>
          </div>
          <div className="text-[10px] text-slate-400">Cloudflare Workers</div>
        </div>
      </div>
    </aside>
  );
}