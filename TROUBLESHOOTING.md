# 🔧 Troubleshooting Guide

## Common Issues and Solutions

---

## ⚠️ npm Warnings

### Warning: `prebuild-install@7.1.3: No longer maintained`

**What it means:**
- This is a **deprecation warning**, not an error
- The package `prebuild-install` is used by `better-sqlite3` (our SQLite database driver)
- Your app will still work perfectly fine

**Is it a problem?**
- ❌ **No** - This is just a warning, not an error
- ✅ **Your app will run without any issues**
- ✅ **All functionality works as expected**

**Solution 1: Ignore it (Recommended)**
The warning is safe to ignore. Your application will work perfectly.

**Solution 2: Update Dependencies**
I've updated the `package.json` to use the latest versions:
- `better-sqlite3`: ^11.5.0 (latest)
- `express`: ^4.19.2
- `react`: ^18.3.1
- `vite`: ^5.4.8

To apply the updates:
```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Reinstall with latest versions
npm install
```

**Solution 3: Use Alternative Database (Optional)**
If you prefer to avoid any warnings, you can switch to an alternative:

**Option A: Use `sql.js` (pure JavaScript SQLite)**
```bash
npm install sql.js
```

**Option B: Use PostgreSQL or MySQL**
For production, consider a full database server.

---

## 🐛 Other Common Issues

### Issue: "Cannot find module 'better-sqlite3'"

**Solution:**
```bash
# Make sure you're in the project directory
cd rent-management-app

# Install dependencies
npm install

# If still failing, try:
npm install better-sqlite3 --build-from-source
```

---

### Issue: "Port 3000 or 5000 already in use"

**Solution:**

**Option 1: Stop the process using the port**
```bash
# On Mac/Linux:
lsof -ti:3000 | xargs kill
lsof -ti:5000 | xargs kill

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Option 2: Change the port numbers**

Edit `vite.config.js`:
```javascript
server: {
  port: 3001,  // Change from 3000
  // ...
}
```

Edit `server/index.js`:
```javascript
const PORT = 5001;  // Change from 5000
```

---

### Issue: "npm ERR! code EACCES"

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules

# Or use npx instead
npx concurrently "node server/index.js" "vite"
```

---

### Issue: Database file locked or corrupted

**Solution:**
```bash
# Delete the database file (will recreate with sample data)
rm server/rentmanagement.db

# Restart the server
npm run server
```

---

### Issue: "Cannot GET /" or blank page

**Solutions:**

1. **Make sure both servers are running:**
```bash
npm run dev  # Runs both frontend and backend
```

2. **Check if backend is responding:**
```bash
curl http://localhost:5000/api/properties
```

3. **Clear browser cache:**
- Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)

4. **Check console for errors:**
- Open browser DevTools (F12)
- Look for errors in Console tab

---

### Issue: "Module not found" errors

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

### Issue: Vite not building or hot-reload not working

**Solution:**
```bash
# Restart Vite dev server
# Press Ctrl+C to stop
npm run client

# Or rebuild
npm run build
npm run preview
```

---

## 🔍 Debugging Tips

### Check if Node.js and npm are installed:
```bash
node --version  # Should be v16 or higher
npm --version   # Should be v7 or higher
```

### Check if all dependencies installed:
```bash
npm list
```

### Run in development mode with verbose logging:
```bash
# Backend with logging
DEBUG=* npm run server

# Frontend with verbose
npm run client -- --debug
```

### Test API endpoints manually:
```bash
# Get all properties
curl http://localhost:5000/api/properties

# Get dashboard stats
curl http://localhost:5000/api/dashboard/stats
```

---

## 📦 Clean Installation Process

If you encounter multiple issues, try a complete clean install:

```bash
# 1. Stop all running processes (Ctrl+C)

# 2. Remove all dependencies and caches
rm -rf node_modules
rm -rf package-lock.json
rm -rf server/rentmanagement.db
npm cache clean --force

# 3. Reinstall everything
npm install

# 4. Restart the application
npm run dev
```

---

## 🌐 Browser Compatibility

**Supported Browsers:**
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)

**Not supported:**
- ❌ Internet Explorer

---

## 💾 Database Issues

### SQLite3 native module build errors

**On Windows:**
```bash
npm install --global windows-build-tools
npm install better-sqlite3 --build-from-source
```

**On Mac:**
```bash
xcode-select --install
npm install better-sqlite3 --build-from-source
```

**On Linux:**
```bash
sudo apt-get install build-essential
npm install better-sqlite3 --build-from-source
```

---

## 🚀 Production Deployment Issues

### Build errors

**Solution:**
```bash
# Make sure build completes
npm run build

# Check dist folder was created
ls -la dist/

# Test production build locally
npm run preview
```

### Environment variables

Create a `.env` file for production:
```env
NODE_ENV=production
PORT=5000
DATABASE_PATH=./server/rentmanagement.db
```

---

## 📞 Still Having Issues?

### 1. Check the logs
- Backend logs appear in the terminal running `npm run server`
- Frontend logs appear in the terminal running `npm run client`
- Browser console logs (F12 → Console)

### 2. Verify prerequisites
- Node.js v16 or higher installed
- npm v7 or higher installed
- Sufficient disk space (at least 500MB)

### 3. Common quick fixes
```bash
# Restart everything
npm run dev

# Or run separately
npm run server  # Terminal 1
npm run client  # Terminal 2
```

---

## ✅ Verification Checklist

Before reporting an issue, verify:

- [ ] Node.js and npm are installed (`node -v`, `npm -v`)
- [ ] You're in the correct directory (`pwd`)
- [ ] `npm install` completed without errors
- [ ] Both ports 3000 and 5000 are available
- [ ] No firewall blocking local ports
- [ ] Browser is supported (not IE)
- [ ] `package.json` exists in current directory
- [ ] `server/` and `src/` directories exist

---

## 🎯 Quick Reference

| Problem | Quick Fix |
|---------|-----------|
| Deprecation warnings | Safe to ignore |
| Port in use | Change port or kill process |
| Module not found | `npm install` |
| Database locked | Delete `.db` file |
| Build errors | `rm -rf node_modules && npm install` |
| Blank page | Check both servers running |
| API not responding | Restart backend server |

---

## 📖 Additional Resources

- **Node.js Documentation**: https://nodejs.org/docs
- **React Documentation**: https://react.dev
- **Vite Documentation**: https://vitejs.dev
- **Express Documentation**: https://expressjs.com
- **Better-SQLite3 Docs**: https://github.com/WiseLibs/better-sqlite3

---

**Last Updated**: June 30, 2026

**Need More Help?** Check the other documentation files:
- `README.md` - Full project documentation
- `SETUP_INSTRUCTIONS.md` - Installation guide
- `START_HERE.md` - Quick start guide
