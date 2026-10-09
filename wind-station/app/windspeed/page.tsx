"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import DynamicChart from "@/components/charts/DynamicChart";
import { fetchLatest, fetchHistory, fetchStats } from "@/lib/api";

export default function WindSpeedPage() {
  const [current, setCurrent] = useState(0);
  const [history, setHistory] = useState<{ value: number; created_at: string }[]>([]);
  const [stats, setStats] = useState({ min: 0, max: 0, avg: 0, count: 0 });

  useEffect(() => {
    const load = async () => {
      const [r, h, s] = await Promise.all([
        fetchLatest(),
        fetchHistory("wind_speed", 30),
        fetchStats("wind_speed"),
      ]);
      if (r) setCurrent(r.wind_speed ?? 0);
      setHistory(h);
      if (s) setStats(s);
    };
    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, []);

  const chartData = {
    labels: history.map(h => new Date(h.created_at + 'Z').toLocaleTimeString('id-ID', { hour12: false })),
    datasets: [{
      label: 'Kecepatan (m/s)',
      data: history.map(h => h.value),
      borderColor: 'rgba(77,171,255,1)',
      backgroundColor: 'rgba(77,171,255,0.15)',
      borderWidth: 2.5,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
    }]
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', maxTicksLimit: 6, font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 10 }, callback: (v: any) => v + ' m/s' } }
    }
  };

  const beaufort = (ms: number) => {
    const t = [0.3,1.6,3.4,5.5,8,10.8,13.9,17.2,20.8,24.5,28.5,32.7];
    for (let i = 0; i < t.length; i++) if (ms < t[i]) return i;
    return 12;
  };

  return (
    <>
      <Topbar title="Kecepatan Angin" subtitle="Data dari sensor RK100-02" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <div className="lg:col-span-2 glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="relative">
              <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Kecepatan Angin Saat Ini</div>
              <div className="flex items-end gap-3 mb-6 mt-4">
                <span className="text-7xl sm:text-8xl font-extrabold text-white leading-none">
                  {current.toFixed(1)}
                </span>
                <span className="text-2xl text-slate-400 font-medium mb-2">m/s</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">km/jam</div>
                  <div className="text-lg font-bold text-white">{(current * 3.6).toFixed(1)}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Knot</div>
                  <div className="text-lg font-bold text-white">{(current * 1.944).toFixed(1)}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Beaufort</div>
                  <div className="text-lg font-bold text-white">{beaufort(current)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Statistik</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-sm text-slate-300">Minimum</span>
                <span className="text-sm font-bold text-white">{(stats.min ?? 0).toFixed(1)} m/s</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-sm text-slate-300">Maksimum</span>
                <span className="text-sm font-bold text-white">{(stats.max ?? 0).toFixed(1)} m/s</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-sm text-slate-300">Rata-rata</span>
                <span className="text-sm font-bold text-white">{(stats.avg ?? 0).toFixed(1)} m/s</span>
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Sampel</span>
                <span className="font-bold text-white">{stats.count}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-6 sm:p-8">
          <h2 className="text-base font-bold text-white mb-3">Grafik Kecepatan Angin</h2>
          <p className="text-xs text-slate-400 mb-6">30 sampel terakhir</p>
          <DynamicChart type="line" data={chartData} options={chartOptions} height={320} />
        </div>
      </div>
    </>
  );
}