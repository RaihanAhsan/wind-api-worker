"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import { fetchLatest } from "@/lib/api";

export default function HomePage() {
  const [data, setData] = useState({
    wind_speed: 0,
    wind_direction: 0,
    temperature: 0,
    humidity: 0,
    pressure: 0,
    solar_radiation: 0,
    rainfall: 0,
    created_at: "",
    device_name: "Memuat...",
  });
  const [lastUpdate, setLastUpdate] = useState("--:--:--");

  useEffect(() => {
    const load = async () => {
      const r = await fetchLatest();
      if (r) {
        setData({
          wind_speed: r.wind_speed ?? 0,
          wind_direction: r.wind_direction ?? 0,
          temperature: r.temperature ?? 0,
          humidity: r.humidity ?? 0,
          pressure: r.pressure ?? 0,
          solar_radiation: r.solar_radiation ?? 0,
          rainfall: r.rainfall ?? 0,
          created_at: r.created_at,
          device_name: r.device_name,
        });
        setLastUpdate(new Date().toLocaleTimeString("id-ID", { hour12: false }));
      }
    };
    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, []);

  const beaufort = (ms: number) => {
    const t = [0.3,1.6,3.4,5.5,8,10.8,13.9,17.2,20.8,24.5,28.5,32.7];
    for (let i = 0; i < t.length; i++) if (ms < t[i]) return i;
    return 12;
  };

  const dirName = (d: number) => {
    const dirs = ["Utara","Timur Laut","Timur","Tenggara","Selatan","Barat Daya","Barat","Barat Laut"];
    return dirs[Math.round(d/45) % 8];
  };

  return (
    <>
      <Topbar title="Dashboard" subtitle="Ringkasan kondisi cuaca saat ini" />
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Hero Card */}
        <div className="glass-strong rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden animate-fade-in">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center border border-amber-400/20 shrink-0">
                <svg className="w-14 h-14 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Kondisi Cuaca</div>
                <div className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {data.solar_radiation > 500 ? "Cerah" : data.rainfall > 5 ? "Hujan" : "Berawan"}
                </div>
                <div className="text-xs text-slate-400 mt-1">Aman untuk aktivitas pertanian</div>
              </div>
            </div>

            <div className="text-center md:border-l md:border-r border-white/5 md:px-6">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Suhu Udara</div>
              <div className="flex items-end justify-center gap-2">
                <span className="text-6xl sm:text-7xl font-extrabold text-white leading-none">
                  {data.temperature.toFixed(1)}
                </span>
                <span className="text-2xl text-slate-400 font-medium mb-2">°C</span>
              </div>
              <div className="text-xs text-slate-400 mt-2">Hangat, nyaman untuk aktivitas</div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-2">Info Terkini</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Diperbarui</span>
                  <span className="text-white font-medium">{lastUpdate}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Status Sensor</span>
                  <span className="text-emerald-400 font-medium">5/5 Aktif</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Stasiun</span>
                  <span className="text-white font-medium">{data.device_name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sensor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">

          <Link href="/windspeed" className="glass-strong rounded-2xl p-5 hover:border-blue-400/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center border border-blue-400/20">
                <svg className="w-6 h-6 text-blue-400 wind-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/>
                </svg>
              </div>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Kecepatan Angin</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-white">{data.wind_speed.toFixed(1)}</span>
              <span className="text-sm text-slate-400 mb-1">m/s</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400 font-medium">
                Beaufort {beaufort(data.wind_speed)}
              </span>
            </div>
          </Link>

          <Link href="/winddirection" className="glass-strong rounded-2xl p-5 hover:border-purple-400/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center border border-purple-400/20">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v4m0 12v4M2 12h4m12 0h4m-9 0a3 3 0 106 0 3 3 0 00-6 0z"/>
                </svg>
              </div>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Arah Angin</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-white">{data.wind_direction}</span>
              <span className="text-sm text-slate-400 mb-1">°</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-purple-400/10 text-purple-400 font-medium">
                {dirName(data.wind_direction)}
              </span>
            </div>
          </Link>

          <Link href="/humidity" className="glass-strong rounded-2xl p-5 hover:border-emerald-400/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center border border-emerald-400/20">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Kelembapan</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-white">{data.humidity.toFixed(0)}</span>
              <span className="text-sm text-slate-400 mb-1">%RH</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 font-medium">
                {data.pressure.toFixed(0)} hPa
              </span>
            </div>
          </Link>

          <Link href="/solar" className="glass-strong rounded-2xl p-5 hover:border-amber-400/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Radiasi Surya</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-white">{data.solar_radiation}</span>
              <span className="text-sm text-slate-400 mb-1">W/m²</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-medium">
                {data.solar_radiation > 800 ? "Sangat Tinggi" : data.solar_radiation > 500 ? "Tinggi" : "Sedang"}
              </span>
            </div>
          </Link>

          <Link href="/rainfall" className="glass-strong rounded-2xl p-5 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14.5A5.5 5.5 0 0013.5 9h-1.2a7 7 0 00-13.5 2.7 5 5 0 001.2 9.8h12a5.5 5.5 0 006.8-7zM8 19v2m4-2v3m4-3v2"/>
                </svg>
              </div>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Curah Hujan</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-white">{data.rainfall.toFixed(1)}</span>
              <span className="text-sm text-slate-400 mb-1">mm</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 font-medium">
                {data.rainfall < 0.2 ? "Tidak Hujan" : data.rainfall < 5 ? "Ringan" : "Sedang"}
              </span>
            </div>
          </Link>

          {/* System Card */}
          <div className="glass-strong rounded-2xl p-5 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-400/10 flex items-center justify-center border border-slate-400/20">
                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                </svg>
              </div>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Status Sistem</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-emerald-400">98</span>
              <span className="text-sm text-slate-400 mb-1">%</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 font-medium">Sehat</span>
            </div>
          </div>
        </div>

        {/* Rekomendasi Petani */}
        <div className="glass rounded-2xl p-5 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-400/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-1">Rekomendasi untuk Petani</div>
              <div className="text-xs text-slate-400 leading-relaxed">
                Kondisi saat ini <span className="text-emerald-400 font-medium">aman untuk aktivitas penyemprotan</span>.
                Kecepatan angin {data.wind_speed.toFixed(1)} m/s, curah hujan {data.rainfall.toFixed(1)} mm,
                suhu {data.temperature.toFixed(1)}°C.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}