# 🅿️ Multi-Level Parking System - MERN Stack Application

A comprehensive full-stack web application for managing a **multi-level parking system** using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)** with a modern, responsive UI and clear demonstration of **Data Structures and Algorithms (DSA) concepts**.

## 📋 Table of Contents

- [Features](#features)
- [DSA Concepts Demonstrated](#dsa-concepts-demonstrated)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [DSA Implementation Details](#dsa-implementation-details)
- [Technologies Used](#technologies-used)
- [Future Enhancements](#future-enhancements)

---

## ✨ Features

### Core Features
- ✅ **Vehicle Entry (INSERTION)** - Register vehicles entering the parking system
- ✅ **Vehicle Exit (DELETION)** - Remove vehicles and calculate parking fees
- ✅ **Search Vehicle (SEARCHING)** - Find parked vehicles instantly using hash maps
- ✅ **Floor Visualization (TRAVERSAL)** - Real-time visual layout of all parking floors
- ✅ **Parking History** - Complete record of all parking activities
- ✅ **Real-time Dashboard** - Live statistics and monitoring
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Advanced Features
- 🔐 **JWT Authentication** - Secure user registration and login
- 💳 **Automated Fee Calculation** - Per-hour pricing for different vehicle types
- 🎯 **Smart Slot Assignment** - Assigns nearest available slots
- 📊 **Parking Analytics** - Occupancy rates, revenue tracking
- 🎨 **Modern UI** - Color-coded slots (green=available, red=occupied)
- ⚡ **Real-time Updates** - Auto-refresh every few seconds

---

## 🧠 DSA Concepts Demonstrated

### 1. **Arrays**
```
Each floor uses an ARRAY to store parking slots:
[
  { slotNo: 1, status: "empty", vehicleType: "bike" },
  { slotNo: 2, status: "occupied", vehicleNumber: "MH01AB1234" },
  ...
]
```
- **Time Complexity**: O(n) for iteration
- **Space Complexity**: O(n) for storage

### 2. **Tree Structure**
```
Parking System (Root)
├─ Floor 1 (Node)
│  ├─ Slot Array
│  └─ Slot Statistics
├─ Floor 2 (Node)
│  ├─ Slot Array
│  └─ Slot Statistics
└─ Floor 3 (Node)
   ├─ Slot Array
   └─ Slot Statistics
```
- Hierarchical representation of multiple floors
- Each floor is a node in the tree structure

### 3. **Insertion Algorithm** (Vehicle Entry)
```javascript
Algorithm: Insert Vehicle
1. Traverse all floors (tree traversal)
2. Search for empty slot matching vehicle type (linear search)
3. Mark slot as occupied
4. Record entry time
5. Update quick lookup hash map

Time Complexity: O(f × n) where f=floors, n=slots/floor
```

### 4. **Deletion Algorithm** (Vehicle Exit)
```javascript
Algorithm: Delete Vehicle
1. Quick lookup using hash map → O(1)
2. Find slot and calculate duration
3. Compute parking fee
4. Mark slot as empty
5. Remove from quick lookup
6. Update history

Time Complexity: O(1) - Hash map based lookup
```

### 5. **Searching Algorithm** (Find Vehicle)
```javascript
Algorithm: Search Vehicle
- Method 1: Linear Search through all slots → O(f × n)
- Method 2: Hash Map Lookup → O(1) ✓ USED HERE

Hash Map Structure:
{
  "MH01AB1234": { floor: 1, slot: 5, entryTime: ... },
  "MH02CD5678": { floor: 2, slot: 8, entryTime: ... }
}
```

### 6. **Traversal Algorithm** (Display All Floors)
```javascript
Algorithm: In-order Tree Traversal
1. Visit each floor (depth-first)
2. For each floor, iterate through all slots (array traversal)
3. Display slot details
4. Return complete parking structure

Time Complexity: O(f × n)
```

---

## 📁 Project Structure

```
full_stack/
│
├── frontend/                          # React.js Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js              # Navigation component
│   │   │   ├── Card.js                # Reusable card component
│   │   │   ├── LoadingSpinner.js      # Loading indicator
│   │   │   ├── StatBox.js             # Statistics display
│   │   │   └── SlotVisualization.js   # Slot grid visualization
│   │   ├── pages/
│   │   │   ├── Dashboard.js           # Main dashboard
│   │   │   ├── VehicleEntry.js        # Entry form (INSERTION)
│   │   │   ├── VehicleExit.js         # Exit form (DELETION)
│   │   │   ├── SearchVehicle.js       # Search form (SEARCHING)
│   │   │   ├── FloorsVisualization.js # Floor layout (TRAVERSAL)
│   │   │   ├── ParkingHistory.js      # History records
│   │   │   ├── Login.js               # Login page
│   │   │   └── Register.js            # Registration page
│   │   ├── utils/
│   │   │   ├── api.js                 # API client
│   │   │   ├── auth.js                # Authentication utilities
│   │   │   └── constants.js           # Constants
│   │   ├── styles/
│   │   │   ├── variables.css          # CSS variables & theming
│   │   │   ├── global.css             # Global styles
│   │   │   ├── Navbar.css
│   │   │   ├── Card.css
│   │   │   ├── StatBox.css
│   │   │   ├── SlotVisualization.css
│   │   │   ├── Dashboard.css
│   │   │   ├── VehicleEntry.css
│   │   │   ├── VehicleExit.css
│   │   │   ├── SearchVehicle.css
│   │   │   ├── FloorsVisualization.css
│   │   │   ├── ParkingHistory.css
│   │   │   ├── LoadingSpinner.css
│   │   │   └── Auth.css
│   │   ├── App.js                     # Main app component
│   │   └── index.js                   # React entry point
│   ├── package.json
│   └── .gitignore
│
├── backend/                           # Node.js + Express Backend
│   ├── models/
│   │   ├── ParkingSystemDSA.js        # Core DSA implementation
│   │   ├── User.js                    # User schema
│   │   └── Parking.js                 # Parking schema
│   ├── routes/
│   │   ├── parkingRoutes.js           # Parking API routes
│   │   └── authRoutes.js              # Authentication routes
│   ├── controllers/
│   │   ├── parkingController.js       # Parking business logic
│   │   ├── authController.js          # Authentication logic
│   │   └── authMiddleware.js          # JWT middleware
│   ├── server.js                      # Main server file
│   ├── package.json
│   ├── .env                           # Environment variables
│   └── .gitignore
│
└── README.md                          # Project documentation
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v14+ and npm
- MongoDB (local or cloud - MongoDB Atlas)
- Git
- VS Code or any code editor

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Create `.env` file (already created, modify as needed)
   ```
   MONGODB_URI=mongodb://localhost:27017/parking_system
   PORT=5000
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - Local: `mongod` (if installed locally)
   - Cloud: Use MongoDB Atlas connection string

5. **Run backend server**
   ```bash
   npm run dev    # Development with nodemon
   # or
   npm start      # Production
   ```
   
   Server will be running at: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory (new terminal)**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start React development server**
   ```bash
   npm start
   ```
   
   Application will open at: `http://localhost:3000`

---

## 💻 Usage

### 1. **Vehicle Entry** (INSERTION)
- Go to "Vehicle Entry" page
- Enter vehicle number and type
- Click "Park Vehicle"
- System assigns nearest available slot
- Displays floor and slot number

### 2. **Vehicle Exit** (DELETION)
- Go to "Vehicle Exit" page
- Enter vehicle number
- Click "Process Exit"
- System calculates parking duration and fee
- Slot becomes available

### 3. **Search Vehicle** (SEARCHING)
- Go to "Search" page
- Enter vehicle number
- Click "Search"
- Instantly shows floor and slot location (O(1) lookup)

### 4. **View Floors** (TRAVERSAL)
- Go to "Floors" page
- See real-time visualization of all floors
- Green = Available slots
- Red = Occupied slots
- Updates every 3 seconds

### 5. **Parking History**
- Go to "History" page
- Filter by vehicle number
- View complete parking records
- See duration and fees

### 6. **Dashboard**
- Main overview page
- Real-time statistics
- Occupancy rates
- Floor-wise breakdown

---

## 🔗 API Endpoints

### Parking Endpoints (No Auth Required for Demo)

#### **Vehicle Entry - INSERTION**
```
POST /api/parking/entry
Content-Type: application/json

{
  "vehicleNumber": "MH01AB1234",
  "vehicleType": "car"
}

Response:
{
  "success": true,
  "data": {
    "vehicleNumber": "MH01AB1234",
    "floorNumber": 1,
    "slotNumber": 5,
    "entryTime": "2024-01-15T10:30:00Z"
  }
}
```

#### **Vehicle Exit - DELETION**
```
DELETE /api/parking/exit/:vehicleNumber

Response:
{
  "success": true,
  "data": {
    "vehicleNumber": "MH01AB1234",
    "entryTime": "2024-01-15T10:30:00Z",
    "exitTime": "2024-01-15T11:45:00Z",
    "parkingDuration": "1h 15m",
    "parkingFee": "₹12"
  }
}
```

#### **Search Vehicle - SEARCHING**
```
GET /api/parking/search/:vehicleNumber

Response:
{
  "success": true,
  "data": {
    "vehicleNumber": "MH01AB1234",
    "vehicleType": "car",
    "floorNumber": 1,
    "slotNumber": 5,
    "entryTime": "2024-01-15T10:30:00Z",
    "duration": 30
  }
}
```

#### **Get All Floors - TRAVERSAL**
```
GET /api/parking/floors

Response:
{
  "success": true,
  "data": [
    {
      "floorNumber": 1,
      "slots": [
        { "slotNo": 1, "status": "occupied", "vehicleNumber": "MH01AB1234" },
        { "slotNo": 2, "status": "empty", "vehicleType": "car" }
      ],
      "stats": { "occupancyRate": 50 }
    }
  ]
}
```

#### **Get Available Slots**
```
GET /api/parking/available

Response:
{
  "success": true,
  "data": [
    {
      "floorNumber": 1,
      "availableSlots": [
        { "slotNo": 2, "vehicleType": "car" },
        { "slotNo": 4, "vehicleType": "bike" }
      ],
      "count": 2
    }
  ]
}
```

#### **Get System Statistics**
```
GET /api/parking/stats

Response:
{
  "success": true,
  "data": {
    "totalFloors": 3,
    "totalSlots": 30,
    "occupiedSlots": 12,
    "emptySlots": 18,
    "occupancyRate": 40
  }
}
```

#### **Get Parking History**
```
GET /api/parking/history?limit=10&offset=0

Response:
{
  "success": true,
  "data": [
    {
      "vehicleNumber": "MH01AB1234",
      "vehicleType": "car",
      "floorNumber": 1,
      "slotNumber": 5,
      "entryTime": "2024-01-15T10:30:00Z",
      "exitTime": "2024-01-15T11:45:00Z",
      "duration": 75,
      "fee": 12
    }
  ]
}
```

### Authentication Endpoints

#### **Register**
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### **Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 🎓 DSA Implementation Details

### 1. **ParkingSlot Class**
```javascript
class ParkingSlot {
  constructor(slotNo, vehicleType) {
    this.slotNo;              // Slot number
    this.vehicleType;         // Type: bike, car, truck
    this.status;              // Status: empty, occupied
    this.vehicleNumber;       // Vehicle registration
    this.entryTime;           // Entry timestamp
  }
}
```

### 2. **ParkingFloor Class (Tree Node)**
```javascript
class ParkingFloor {
  constructor(floorNumber, totalSlots) {
    this.floorNumber;         // Floor identifier
    this.slots = [];          // Array of slots on this floor
  }

  // Linear search for empty slot - O(n)
  findEmptySlot(vehicleType) { }

  // Find vehicle - O(n)
  findVehicleByNumber(vehicleNumber) { }

  // Traversal - O(n)
  getOccupiedSlots() { }
  getEmptySlots() { }
}
```

### 3. **ParkingSystem Class (Main Root)**
```javascript
class ParkingSystem {
  constructor(totalFloors, slotsPerFloor) {
    this.floors = [];                    // Tree structure
    this.vehicleLocations = {};          // Hash map for O(1) lookup
    this.parkingHistory = [];            // History log
  }

  // INSERTION - O(f × n)
  parkVehicle(vehicleNumber, vehicleType) { }

  // DELETION - O(1) using hash map
  unparkVehicle(vehicleNumber) { }

  // SEARCHING - O(1) using hash map
  searchVehicle(vehicleNumber) { }

  // TRAVERSAL - O(f × n)
  getAllFloors() { }
}
```

### Time Complexity Summary

| Operation | Algorithm | Time Complexity | Space Complexity |
|-----------|-----------|-----------------|------------------|
| Insert (Entry) | Linear Search | O(f × n) | O(1) |
| Delete (Exit) | Hash Map Lookup | **O(1)** | O(1) |
| Search | Hash Map Lookup | **O(1)** | O(1) |
| Traversal | DFS Tree Traversal | O(f × n) | O(1) |
| Get Stats | Array Traversal | O(f × n) | O(1) |

---

## 🛠 Technologies Used

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling and animations
- **Lucide React** - Icon library
- **QR Code Generator** - For ticket generation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM library
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **Dotenv** - Environment configuration

### Development Tools
- **Nodemon** - Auto-reload during development
- **Git** - Version control

---

## 📊 Pricing Structure

| Vehicle Type | Rate |
|---|---|
| 🏍️ Bike | ₹5/hour |
| 🚗 Car | ₹10/hour |
| 🚚 Truck | ₹20/hour |

---

## 🎯 Future Enhancements

- [ ] QR code ticket generation
- [ ] Email notifications
- [ ] Admin dashboard with analytics
- [ ] Payment gateway integration
- [ ] WhatsApp notifications
- [ ] Mobile app (React Native)
- [ ] Real-time occupancy updates (WebSocket)
- [ ] Automated number plate recognition (ANPR)
- [ ] Reserved slots
- [ ] Subscription plans
- [ ] Multi-language support
- [ ] Dark mode theme toggle

---

## 📝 Code Examples

### Example 1: Vehicle Entry (INSERTION)
```javascript
// Frontend
const response = await parkVehicle('MH01AB1234', 'car');
// Returns: Floor 1, Slot 5

// Backend (DSA)
parkVehicle(vehicleNumber, vehicleType) {
  // Traverse all floors
  for (let floor of this.floors) {
    // Find empty slot for vehicle type
    const emptySlot = floor.findEmptySlot(vehicleType);
    if (emptySlot) {
      // Insert vehicle into slot
      emptySlot.status = 'occupied';
      emptySlot.vehicleNumber = vehicleNumber;
      emptySlot.entryTime = new Date();
      
      // Update hash map for O(1) lookup
      this.vehicleLocations[vehicleNumber] = {
        floorNumber: floor.floorNumber,
        slotNumber: emptySlot.slotNo
      };
      return { success: true, data: {...} };
    }
  }
}
```

### Example 2: Vehicle Search (SEARCHING)
```javascript
// O(1) Hash Map Lookup
searchVehicle(vehicleNumber) {
  // Direct lookup from hash map
  const location = this.vehicleLocations[vehicleNumber];
  
  if (!location) {
    return { success: false, message: 'Vehicle not found' };
  }

  return {
    success: true,
    data: {
      vehicleNumber,
      floor: location.floorNumber,
      slot: location.slotNumber,
      ...
    }
  };
}
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env or
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Error
```bash
# Ensure MongoDB is running
mongod

# Or use MongoDB Atlas cloud
# Update MONGODB_URI in .env with your connection string
```

### CORS Error
```
Access-Control-Allow-Origin: http://localhost:3000
# Already configured in backend/server.js
```

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

Created as a comprehensive demonstration of the **MERN Stack** and **Data Structures & Algorithms** concepts.

---

## 📞 Support

For issues, questions, or suggestions, please create an issue in the repository or contact the project maintainer.

---

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Full-stack web development
- ✅ Data Structures (Arrays, Trees, Hash Maps)
- ✅ Algorithm implementation
- ✅ Time & Space complexity analysis
- ✅ Database design
- ✅ RESTful API design
- ✅ Authentication & Authorization
- ✅ Responsive UI design
- ✅ Real-time data updates
- ✅ Modern JavaScript practices

---

**Happy Parking!** 🅿️🚗
