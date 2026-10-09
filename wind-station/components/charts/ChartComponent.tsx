"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface Props {
  type: "line" | "bar";
  data: any;
  options?: any;
  height?: number;
}

export default function ChartComponent({ type, data, options, height = 320 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options,
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [type, data, options]);

  return (
    <div style={{ height: `${height}px` }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}