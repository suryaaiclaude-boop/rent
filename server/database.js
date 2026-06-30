import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'rentmanagement.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
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
  );
`);

// Insert sample data if tables are empty
const propertyCount = db.prepare('SELECT COUNT(*) as count FROM properties').get();
if (propertyCount.count === 0) {
  const insertProperty = db.prepare(`
    INSERT INTO properties (name, address, type, rent_amount)
    VALUES (?, ?, ?, ?)
  `);

  insertProperty.run('Sunset Apartments 101', '123 Main St, Unit 101', 'Apartment', 1200);
  insertProperty.run('Riverside House', '456 Oak Ave', 'House', 2500);
  insertProperty.run('Downtown Studio 5B', '789 City Center, Unit 5B', 'Studio', 950);

  const insertTenant = db.prepare(`
    INSERT INTO tenants (name, email, phone, property_id, lease_start, lease_end)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertTenant.run('John Doe', 'john.doe@email.com', '555-0101', 1, '2024-01-01', '2024-12-31');
  insertTenant.run('Jane Smith', 'jane.smith@email.com', '555-0102', 2, '2023-06-01', '2025-05-31');

  const insertPayment = db.prepare(`
    INSERT INTO payments (tenant_id, property_id, amount, payment_date, payment_method, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertPayment.run(1, 1, 1200, '2024-06-01', 'Bank Transfer', 'completed');
  insertPayment.run(1, 1, 1200, '2024-05-01', 'Bank Transfer', 'completed');
  insertPayment.run(2, 2, 2500, '2024-06-01', 'Check', 'completed');

  console.log('Sample data inserted successfully');
}

export default db;
