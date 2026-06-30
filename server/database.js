import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'rentmanagement.db');

// Initialize SQL.js
const SQL = await initSqlJs();

// Load or create database
let db;
if (existsSync(dbPath)) {
  const buffer = readFileSync(dbPath);
  db = new SQL.Database(buffer);
} else {
  db = new SQL.Database();
}

// Save database to disk
function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(dbPath, buffer);
}

// Create tables
db.run(`
  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    type TEXT NOT NULL,
    rent_amount REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tenants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    property_id INTEGER,
    lease_start DATE,
    lease_end DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    payment_date DATE NOT NULL,
    payment_method TEXT,
    status TEXT DEFAULT 'completed',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS tenants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    property_id INTEGER,
    lease_start DATE,
    lease_end DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    payment_date DATE NOT NULL,
    payment_method TEXT,
    status TEXT DEFAULT 'completed',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
  )
`);

// Insert sample data if tables are empty
const propertyCount = db.exec('SELECT COUNT(*) as count FROM properties');
if (!propertyCount[0] || propertyCount[0].values[0][0] === 0) {
  db.run(`INSERT INTO properties (name, address, type, rent_amount)
          VALUES ('Sunset Apartments 101', '123 Main St, Unit 101', 'Apartment', 1200)`);
  db.run(`INSERT INTO properties (name, address, type, rent_amount)
          VALUES ('Riverside House', '456 Oak Ave', 'House', 2500)`);
  db.run(`INSERT INTO properties (name, address, type, rent_amount)
          VALUES ('Downtown Studio 5B', '789 City Center, Unit 5B', 'Studio', 950)`);

  db.run(`INSERT INTO tenants (name, email, phone, property_id, lease_start, lease_end)
          VALUES ('John Doe', 'john.doe@email.com', '555-0101', 1, '2024-01-01', '2024-12-31')`);
  db.run(`INSERT INTO tenants (name, email, phone, property_id, lease_start, lease_end)
          VALUES ('Jane Smith', 'jane.smith@email.com', '555-0102', 2, '2023-06-01', '2025-05-31')`);

  db.run(`INSERT INTO payments (tenant_id, property_id, amount, payment_date, payment_method, status)
          VALUES (1, 1, 1200, '2024-06-01', 'Bank Transfer', 'completed')`);
  db.run(`INSERT INTO payments (tenant_id, property_id, amount, payment_date, payment_method, status)
          VALUES (1, 1, 1200, '2024-05-01', 'Bank Transfer', 'completed')`);
  db.run(`INSERT INTO payments (tenant_id, property_id, amount, payment_date, payment_method, status)
          VALUES (2, 2, 2500, '2024-06-01', 'Check', 'completed')`);

  saveDatabase();
  console.log('Sample data inserted successfully');
}

// Wrapper to mimic better-sqlite3 API
const dbWrapper = {
  prepare: (sql) => ({
    all: (...params) => {
      try {
        const result = db.exec(sql, params);
        if (!result[0]) return [];
        return result[0].values.map(row => {
          const obj = {};
          result[0].columns.forEach((col, i) => obj[col] = row[i]);
          return obj;
        });
      } catch (e) {
        console.error('Query error:', e);
        return [];
      }
    },
    get: (...params) => {
      try {
        const result = db.exec(sql, params);
        if (!result[0] || !result[0].values[0]) return null;
        const obj = {};
        result[0].columns.forEach((col, i) => obj[col] = result[0].values[0][i]);
        return obj;
      } catch (e) {
        console.error('Query error:', e);
        return null;
      }
    },
    run: (...params) => {
      try {
        db.run(sql, params);
        saveDatabase();
        const lastId = db.exec('SELECT last_insert_rowid() as id');
        return { 
          lastInsertRowid: lastId[0]?.values[0]?.[0] || 0,
          changes: 1
        };
      } catch (e) {
        console.error('Query error:', e);
        return { lastInsertRowid: 0, changes: 0 };
      }
    }
  }),
  pragma: (pragma) => {
    return true;
  },
  exec: (sql) => {
    db.exec(sql);
    saveDatabase();
  }
};

export default dbWrapper;
