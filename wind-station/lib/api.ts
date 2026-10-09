const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEVICE_CODE = process.env.NEXT_PUBLIC_DEVICE_CODE || 'STATION-01';

export interface SensorReading {
  id: number;
  device_id: number;
  device_name: string;
  wind_speed: number | null;
  wind_direction: number | null;
  temperature: number | null;
  humidity: number | null;
  pressure: number | null;
  solar_radiation: number | null;
  rainfall: number | null;
  created_at: string;
}

export interface HistoryPoint {
  value: number;
  created_at: string;
}

export async function fetchLatest(): Promise<SensorReading | null> {
  try {
    const res = await fetch(`${API_URL}/api/readings/latest?device_code=${DEVICE_CODE}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchHistory(
  sensor: string,
  limit: number = 30
): Promise<HistoryPoint[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/readings/history?device_code=${DEVICE_CODE}&sensor=${sensor}&limit=${limit}`
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchStats(sensor: string) {
  try {
    const res = await fetch(
      `${API_URL}/api/readings/stats?device_code=${DEVICE_CODE}&sensor=${sensor}`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}