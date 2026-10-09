import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS: izinkan dashboard Next.js mengakses API
app.use('/*', cors({
  origin: [
    'https://wind-station.pages.dev',    // ganti sesuai domain Pages Anda
    'http://localhost:3000',              // dev lokal
  ],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'X-API-Key'],
}));

// ────────────────────────────────────────
// POST /api/readings — terima data dari ESP32
// ────────────────────────────────────────
app.post('/api/readings', async (c) => {
  const apiKey = c.req.header('X-API-Key');
  if (!apiKey) return c.json({ error: 'API key required' }, 401);

  const body = await c.req.json();

  const device = await c.env.DB
    .prepare('SELECT id FROM devices WHERE device_code = ? AND api_key = ? AND is_active = 1')
    .bind(body.device_code, apiKey)
    .first<{ id: number }>();

  if (!device) return c.json({ error: 'Invalid device or API key' }, 401);

  await c.env.DB
    .prepare(`INSERT INTO sensor_readings 
      (device_id, wind_speed, wind_direction, temperature, humidity, pressure, solar_radiation, rainfall)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(
      device.id,
      body.wind_speed ?? null,
      body.wind_direction ?? null,
      body.temperature ?? null,
      body.humidity ?? null,
      body.pressure ?? null,
      body.solar_radiation ?? null,
      body.rainfall ?? null,
    )
    .run();

  return c.json({ status: 'ok', message: 'Data tersimpan' });
});

// ────────────────────────────────────────
// GET /api/readings/latest — data terbaru
// ────────────────────────────────────────
app.get('/api/readings/latest', async (c) => {
  const deviceCode = c.req.query('device_code') || 'STATION-01';

  const row = await c.env.DB
    .prepare(`SELECT r.*, d.device_name FROM sensor_readings r
              JOIN devices d ON d.id = r.device_id
              WHERE d.device_code = ?
              ORDER BY r.id DESC LIMIT 1`)
    .bind(deviceCode)
    .first();

  if (!row) return c.json({ error: 'No data' }, 404);
  return c.json(row);
});

// ────────────────────────────────────────
// GET /api/readings/history — histori chart
// ────────────────────────────────────────
app.get('/api/readings/history', async (c) => {
  const deviceCode = c.req.query('device_code') || 'STATION-01';
  const limit = parseInt(c.req.query('limit') || '30');
  const sensor = c.req.query('sensor') || 'wind_speed';

  const allowedColumns = ['wind_speed', 'wind_direction', 'temperature',
                         'humidity', 'pressure', 'solar_radiation', 'rainfall'];
  if (!allowedColumns.includes(sensor)) {
    return c.json({ error: 'Invalid sensor' }, 400);
  }

  const rows = await c.env.DB
    .prepare(`SELECT r.${sensor} AS value, r.created_at 
              FROM sensor_readings r
              JOIN devices d ON d.id = r.device_id
              WHERE d.device_code = ?
              ORDER BY r.id DESC LIMIT ?`)
    .bind(deviceCode, limit)
    .all();

  return c.json(rows.results);
});

// ────────────────────────────────────────
// GET /api/readings/stats — statistik (min/max/avg)
// ────────────────────────────────────────
app.get('/api/readings/stats', async (c) => {
  const deviceCode = c.req.query('device_code') || 'STATION-01';
  const sensor = c.req.query('sensor') || 'wind_speed';

  const allowedColumns = ['wind_speed', 'wind_direction', 'temperature',
                         'humidity', 'pressure', 'solar_radiation', 'rainfall'];
  if (!allowedColumns.includes(sensor)) {
    return c.json({ error: 'Invalid sensor' }, 400);
  }

  const row = await c.env.DB
    .prepare(`SELECT 
                MIN(r.${sensor}) AS min,
                MAX(r.${sensor}) AS max,
                AVG(r.${sensor}) AS avg,
                COUNT(r.${sensor}) AS count
              FROM sensor_readings r
              JOIN devices d ON d.id = r.device_id
              WHERE d.device_code = ?`)
    .bind(deviceCode)
    .first();

  return c.json(row);
});

// Health check
app.get('/health', (c) => c.json({ status: 'healthy', time: new Date().toISOString() }));

export default app;