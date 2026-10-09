-- Tabel perangkat (ESP32 station)
CREATE TABLE IF NOT EXISTS devices (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    device_code TEXT UNIQUE NOT NULL,
    device_name TEXT NOT NULL,
    location    TEXT,
    api_key     TEXT NOT NULL,
    is_active   INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now'))
);

-- Tabel pembacaan sensor (1 baris = 1 snapshot semua sensor)
CREATE TABLE IF NOT EXISTS sensor_readings (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id       INTEGER NOT NULL,
    wind_speed      REAL,       -- m/s (RK100-02)
    wind_direction  INTEGER,    -- derajat (RK110-02)
    temperature     REAL,       -- °C (RK330-01B)
    humidity        REAL,       -- %RH (RK330-01B)
    pressure        REAL,       -- hPa (RK330-01B)
    solar_radiation INTEGER,    -- W/m² (RK200-04)
    rainfall        REAL,       -- mm (RK400-04)
    created_at      TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

-- Index untuk query cepat
CREATE INDEX IF NOT EXISTS idx_readings_device_time 
    ON sensor_readings(device_id, created_at DESC);

-- Registrasi device pertama
INSERT OR IGNORE INTO devices (device_code, device_name, location, api_key)
VALUES ('STATION-01', 'Stasiun Cuaca Sawah A', 'Gedung A', 'rahasia123');