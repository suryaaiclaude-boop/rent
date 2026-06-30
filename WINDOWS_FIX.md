# 🪟 Windows Installation Fix

## Issue: File Lock and npm Warning on Windows

You're seeing two issues:
1. ❌ `EPERM: operation not permitted` - Windows file lock
2. ⚠️ `npm warn deprecated prebuild-install@7.1.3` - Persistent warning

---

## ✅ **SOLUTION: Step-by-Step Fix**

### **Step 1: Close Everything**

Close these if open:
- ✅ VS Code or any code editors
- ✅ File Explorer windows showing the project folder
- ✅ Command Prompt/PowerShell with `npm run dev` running
- ✅ Any antivirus software scanning the folder
- ✅ Git Bash or Git GUI
- ✅ Docker Desktop (if running)

Press **Ctrl+C** in any terminal running the app.

---

### **Step 2: Use PowerShell as Administrator**

1. **Right-click** on **PowerShell** or **Command Prompt**
2. Select **"Run as Administrator"**
3. Navigate to your project:
   ```powershell
   cd D:\rent-main\rent-main
   ```

---

### **Step 3: Force Delete node_modules**

Use Windows built-in command to force delete:

```powershell
# Option 1: Using rmdir (Recommended)
rmdir /s /q node_modules

# Option 2: If above fails, use PowerShell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# Option 3: If both fail, use robocopy trick
mkdir empty
robocopy empty node_modules /purge
rmdir empty
rmdir node_modules
```

---

### **Step 4: Delete package-lock.json**

```powershell
del package-lock.json
```

---

### **Step 5: Clear npm Cache**

```powershell
npm cache clean --force
```

---

### **Step 6: Install Dependencies**

Now reinstall everything fresh:

```powershell
npm install
```

---

## 🎯 **If STILL Getting the Warning:**

The warning is **SAFE TO IGNORE**, but if you want it gone completely:

### **Option A: Use Alternative SQLite Package (Recommended)**

Switch to a pure JavaScript SQLite implementation that has no native dependencies:

1. **Update `package.json`** - Replace `better-sqlite3` with `sql.js`:

```json
"dependencies": {
  "express": "^4.19.2",
  "cors": "^2.8.5",
  "sql.js": "^1.10.3",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.2"
}
```

2. **Update `server/database.js`**:

```javascript
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
  );
`);

// Insert sample data if tables are empty
const propertyCount = db.exec('SELECT COUNT(*) as count FROM properties');
if (propertyCount[0].values[0][0] === 0) {
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

// Wrapper for prepare-like API
const dbWrapper = {
  prepare: (sql) => ({
    all: (...params) => {
      const result = db.exec(sql, params);
      return result[0]?.values.map(row => {
        const obj = {};
        result[0].columns.forEach((col, i) => obj[col] = row[i]);
        return obj;
      }) || [];
    },
    get: (...params) => {
      const result = db.exec(sql, params);
      if (!result[0]) return null;
      const obj = {};
      result[0].columns.forEach((col, i) => obj[col] = result[0].values[0][i]);
      return obj;
    },
    run: (...params) => {
      db.run(sql, params);
      saveDatabase();
      return { lastInsertRowid: db.exec('SELECT last_insert_rowid()')[0].values[0][0] };
    }
  })
};

export default dbWrapper;
```

---

### **Option B: Ignore the Warning (Simplest)**

The warning is **harmless** and your app will work perfectly. The warning comes from a dependency chain and doesn't affect functionality.

**To hide npm warnings:**

Create a `.npmrc` file in your project root:

```
loglevel=error
```

This will hide all warnings and only show errors.

---

### **Option C: Continue with better-sqlite3 (Most Common)**

The warning appears because `better-sqlite3` has native dependencies. **This is normal for database drivers.**

**Your app will work fine despite the warning!**

Just ensure you have:
- ✅ Visual Studio Build Tools installed
- ✅ Python installed (for node-gyp)

**To install build tools on Windows:**

```powershell
# Run as Administrator
npm install --global windows-build-tools

# Or install manually:
# - Visual Studio Community (with C++ tools)
# - Python 3.x
```

---

## 🔧 **Additional Windows-Specific Tips**

### **If npm install hangs:**

```powershell
# Kill all node processes
taskkill /F /IM node.exe

# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### **If "Access Denied" errors persist:**

1. **Disable antivirus temporarily** during installation
2. **Use shorter path** - Move project to `C:\rent` instead of `D:\rent-main\rent-main`
3. **Run as Administrator**

### **If git operations fail:**

```powershell
# Configure git for Windows
git config --global core.longpaths true
git config --global core.autocrlf false
```

---

## ✅ **Quick Fix Summary**

**Fastest solution for Windows:**

```powershell
# 1. Close all editors and terminals
# 2. Run as Administrator
cd D:\rent-main\rent-main

# 3. Force delete
rmdir /s /q node_modules
del package-lock.json

# 4. Clean and reinstall
npm cache clean --force
npm install

# 5. Run the app
npm run dev
```

---

## 🎯 **Expected Result**

After these steps, you should see:

```
✅ Added X packages
✅ No critical errors
⚠️ Warning may still appear (safe to ignore)

Server running on http://localhost:5000
Frontend running on http://localhost:3000
```

**The warning is cosmetic and won't affect your app!** 🎉

---

## 🆘 **Still Having Issues?**

Try these in order:

1. **Move project to shorter path**: `C:\rent`
2. **Disable Windows Defender** during install
3. **Install Visual Studio Build Tools**:
   ```powershell
   npm install --global windows-build-tools
   ```
4. **Use WSL2** (Windows Subsystem for Linux):
   ```bash
   wsl --install
   # Then install Node.js in Ubuntu
   ```

---

## 📋 **Verification Checklist**

Before running:
- [ ] All editors/terminals closed
- [ ] Running PowerShell as Administrator
- [ ] Antivirus disabled temporarily
- [ ] node_modules deleted
- [ ] package-lock.json deleted
- [ ] npm cache cleared
- [ ] Fresh npm install completed

---

## 🎉 **Bottom Line**

**The `prebuild-install` warning is SAFE TO IGNORE!**

Your app works perfectly. The warning is just informational and comes from a transitive dependency. As long as `npm install` completes and `npm run dev` works, you're all set! 🚀

---

**Need more help?** Check `TROUBLESHOOTING.md` for additional solutions.
