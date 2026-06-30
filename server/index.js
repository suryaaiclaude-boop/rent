import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ===== PROPERTIES ROUTES =====

// Get all properties
app.get('/api/properties', (req, res) => {
  try {
    const properties = db.prepare(`
      SELECT p.*, 
             COUNT(DISTINCT t.id) as tenant_count,
             COALESCE(SUM(py.amount), 0) as total_revenue
      FROM properties p
      LEFT JOIN tenants t ON p.id = t.property_id
      LEFT JOIN payments py ON p.id = py.property_id
      GROUP BY p.id
    `).all();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single property
app.get('/api/properties/:id', (req, res) => {
  try {
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create property
app.post('/api/properties', (req, res) => {
  try {
    const { name, address, type, rent_amount } = req.body;
    const result = db.prepare(`
      INSERT INTO properties (name, address, type, rent_amount)
      VALUES (?, ?, ?, ?)
    `).run(name, address, type, rent_amount);
    
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update property
app.put('/api/properties/:id', (req, res) => {
  try {
    const { name, address, type, rent_amount } = req.body;
    db.prepare(`
      UPDATE properties 
      SET name = ?, address = ?, type = ?, rent_amount = ?
      WHERE id = ?
    `).run(name, address, type, rent_amount, req.params.id);
    
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete property
app.delete('/api/properties/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM properties WHERE id = ?').run(req.params.id);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== TENANTS ROUTES =====

// Get all tenants
app.get('/api/tenants', (req, res) => {
  try {
    const tenants = db.prepare(`
      SELECT t.*, p.name as property_name, p.address as property_address
      FROM tenants t
      LEFT JOIN properties p ON t.property_id = p.id
    `).all();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single tenant
app.get('/api/tenants/:id', (req, res) => {
  try {
    const tenant = db.prepare(`
      SELECT t.*, p.name as property_name, p.address as property_address
      FROM tenants t
      LEFT JOIN properties p ON t.property_id = p.id
      WHERE t.id = ?
    `).get(req.params.id);
    
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create tenant
app.post('/api/tenants', (req, res) => {
  try {
    const { name, email, phone, property_id, lease_start, lease_end } = req.body;
    const result = db.prepare(`
      INSERT INTO tenants (name, email, phone, property_id, lease_start, lease_end)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, email, phone, property_id, lease_start, lease_end);
    
    const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update tenant
app.put('/api/tenants/:id', (req, res) => {
  try {
    const { name, email, phone, property_id, lease_start, lease_end } = req.body;
    db.prepare(`
      UPDATE tenants 
      SET name = ?, email = ?, phone = ?, property_id = ?, lease_start = ?, lease_end = ?
      WHERE id = ?
    `).run(name, email, phone, property_id, lease_start, lease_end, req.params.id);
    
    const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(req.params.id);
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete tenant
app.delete('/api/tenants/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM tenants WHERE id = ?').run(req.params.id);
    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== PAYMENTS ROUTES =====

// Get all payments
app.get('/api/payments', (req, res) => {
  try {
    const payments = db.prepare(`
      SELECT py.*, t.name as tenant_name, p.name as property_name
      FROM payments py
      JOIN tenants t ON py.tenant_id = t.id
      JOIN properties p ON py.property_id = p.id
      ORDER BY py.payment_date DESC
    `).all();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single payment
app.get('/api/payments/:id', (req, res) => {
  try {
    const payment = db.prepare(`
      SELECT py.*, t.name as tenant_name, p.name as property_name
      FROM payments py
      JOIN tenants t ON py.tenant_id = t.id
      JOIN properties p ON py.property_id = p.id
      WHERE py.id = ?
    `).get(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create payment
app.post('/api/payments', (req, res) => {
  try {
    const { tenant_id, property_id, amount, payment_date, payment_method, status, notes } = req.body;
    const result = db.prepare(`
      INSERT INTO payments (tenant_id, property_id, amount, payment_date, payment_method, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(tenant_id, property_id, amount, payment_date, payment_method, status || 'completed', notes);
    
    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update payment
app.put('/api/payments/:id', (req, res) => {
  try {
    const { tenant_id, property_id, amount, payment_date, payment_method, status, notes } = req.body;
    db.prepare(`
      UPDATE payments 
      SET tenant_id = ?, property_id = ?, amount = ?, payment_date = ?, 
          payment_method = ?, status = ?, notes = ?
      WHERE id = ?
    `).run(tenant_id, property_id, amount, payment_date, payment_method, status, notes, req.params.id);
    
    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete payment
app.delete('/api/payments/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM payments WHERE id = ?').run(req.params.id);
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== DASHBOARD STATS =====
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const stats = {
      totalProperties: db.prepare('SELECT COUNT(*) as count FROM properties').get().count,
      totalTenants: db.prepare('SELECT COUNT(*) as count FROM tenants').get().count,
      totalRevenue: db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM payments').get().total,
      recentPayments: db.prepare(`
        SELECT py.*, t.name as tenant_name, p.name as property_name
        FROM payments py
        JOIN tenants t ON py.tenant_id = t.id
        JOIN properties p ON py.property_id = p.id
        ORDER BY py.payment_date DESC
        LIMIT 5
      `).all()
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
