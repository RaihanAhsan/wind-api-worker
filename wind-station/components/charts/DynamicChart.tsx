"use client";

import dynamic from "next/dynamic";

const DynamicChart = dynamic(() => import("./ChartComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 text-slate-500">
      Memuat grafik...
    </div>
  ),
});

export default DynamicChart;