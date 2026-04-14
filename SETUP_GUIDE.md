# Quick Start Guide - Parking System Setup

## Prerequisites Installation

### 1. Install Node.js
- Download from: https://nodejs.org/
- Install Node.js v14+ (includes npm)
- Verify: `node --version` and `npm --version`

### 2. Install MongoDB

#### Option A: Local MongoDB
```bash
# Download from: https://www.mongodb.com/try/download/community
# Follow installation guide for your OS
# Start MongoDB: mongod
```

#### Option B: MongoDB Atlas (Cloud)
```bash
# Go to: https://www.mongodb.com/cloud/atlas
# Create free account
# Create cluster and get connection string
# Use connection string in backend/.env
```

### 3. Install Git (Optional)
- Download from: https://git-scm.com/

---

## Project Setup (Windows/Mac/Linux)

### Step 1: Clone/Download Project
```bash
# Navigate to your desired directory
cd Desktop
# Project is already here in: full_stack/
```

### Step 2: Backend Setup

```bash
# 1. Navigate to backend
cd full_stack/backend

# 2. Install dependencies
npm install

# 3. Create/Edit .env file (already exists)
# Verify these values:
# MONGODB_URI=mongodb://localhost:27017/parking_system
# PORT=5000
# JWT_SECRET=your_jwt_secret_key_here_change_in_production

# 4. Start MongoDB (in another terminal)
mongod

# 5. Start backend server
npm run dev
# Server should be running at http://localhost:5000
# You should see: ✅ MongoDB Connected Successfully
```

### Step 3: Frontend Setup (New Terminal)

```bash
# 1. Navigate to frontend
cd full_stack/frontend

# 2. Install dependencies
npm install

# 3. Start React development server
npm start
# App should open at http://localhost:3000
# If not, manually go to http://localhost:3000
```

---

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:5000
- [ ] MongoDB connected ✅
- [ ] Frontend running on http://localhost:3000
- [ ] Can navigate to Dashboard page
- [ ] Can see real-time statistics

### Test the Application

1. **Test Vehicle Entry**
   - Go to "Vehicle Entry" page
   - Enter: `MH01AB1234` (vehicle number)
   - Select: `Car` (vehicle type)
   - Click: "Park Vehicle"
   - Should see: Floor and Slot details

2. **Test Search**
   - Go to "Search" page
   - Enter: `MH01AB1234`
   - Click: "Search"
   - Should find the vehicle instantly

3. **Test Vehicle Exit**
   - Go to "Vehicle Exit" page
   - Enter: `MH01AB1234`
   - Click: "Process Exit"
   - Should see: Duration and parking fee

4. **Test Floor Visualization**
   - Go to "Floors" page
   - Should see: Visual grid with occupied (red) and empty (green) slots

---

## File Structure Quick Reference

```
full_stack/
├── backend/
│   ├── models/ParkingSystemDSA.js    ← Core DSA Logic
│   ├── controllers/parkingController.js
│   ├── routes/parkingRoutes.js
│   ├── server.js                      ← Main server
│   └── .env                           ← Configuration
│
├── frontend/
│   ├── src/
│   │   ├── pages/                     ← Page components
│   │   ├── components/                ← Reusable components
│   │   ├── utils/api.js               ← API calls
│   │   ├── styles/                    ← CSS files
│   │   └── App.js                     ← Main component
│   └── public/index.html
│
└── README.md                           ← Full documentation
```

---

## Common Commands

### Backend Commands
```bash
cd backend

# Development (with auto-reload)
npm run dev

# Production
npm start

# Install new package
npm install <package-name>
```

### Frontend Commands
```bash
cd frontend

# Start development server
npm start

# Build for production
npm build

# Install new package
npm install <package-name>
```

---

## Troubleshooting

### Issue: Port 5000 already in use
**Solution:**
```bash
# Find process on port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
# Or change PORT in .env
```

### Issue: MongoDB connection error
**Solution:**
- Make sure MongoDB is running: `mongod`
- Check .env MONGODB_URI is correct
- Verify MongoDB is accessible

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

### Issue: Module not found errors
**Solution:**
```bash
# Make sure you're in correct directory
pwd  # Show current directory
# Reinstall dependencies
npm install
```

### Issue: CORS error in browser console
**Solution:**
- CORS is already enabled in backend
- Ensure backend is running at http://localhost:5000
- Clear browser cache and hard refresh (Ctrl+Shift+R)

---

## API Testing (Postman/cURL)

### Test Vehicle Entry
```bash
curl -X POST http://localhost:5000/api/parking/entry \
  -H "Content-Type: application/json" \
  -d '{"vehicleNumber": "MH01AB1234", "vehicleType": "car"}'
```

### Test Search
```bash
curl http://localhost:5000/api/parking/search/MH01AB1234
```

### Test Get All Floors
```bash
curl http://localhost:5000/api/parking/floors
```

### Test Get Statistics
```bash
curl http://localhost:5000/api/parking/stats
```

---

## DSA Concepts Implemented

1. **Arrays** - Slot storage on each floor
2. **Tree Structure** - Hierarchical floor-slot model
3. **Hash Maps** - O(1) vehicle lookup
4. **Insertion** - Adding vehicles (O(f×n))
5. **Deletion** - Removing vehicles (O(1))
6. **Searching** - Finding vehicles (O(1))
7. **Traversal** - Displaying all floors (O(f×n))

---

## Expected Output

### Backend Startup
```
✅ MongoDB Connected Successfully
🚀 Backend Server is running on http://localhost:5000
📊 Parking System API ready
🔗 CORS enabled for http://localhost:3000
```

### Frontend Startup
```
Starting the development server...
Compiled successfully!
You can now view parking-system-frontend in the browser.
  Local:            http://localhost:3000
```

---

## Dashboard Features After Setup

- ✅ Real-time parking statistics
- ✅ Floor-wise occupancy breakdown
- ✅ Live updates every 5 seconds
- ✅ DSA concepts displayed
- ✅ Responsive design working

---

## Next Steps

1. ✅ Explore all pages
2. ✅ Test all CRUD operations
3. ✅ Review DSA implementation in `backend/models/ParkingSystemDSA.js`
4. ✅ Understand API endpoints in `README.md`
5. ✅ Customize and enhance features

---

## Support

For detailed documentation, see: `README.md`

For issues, check common troubleshooting section above.

---

**Congratulations!** 🎉 Your Parking System is ready to use!

🅿️ Happy Parking! 🚗
