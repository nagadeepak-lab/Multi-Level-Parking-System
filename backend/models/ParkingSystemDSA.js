/**
 * ParkingSystemDSA.js
 * 
 * This file implements the core parking system using DATA STRUCTURES AND ALGORITHMS
 * 
 * DSA CONCEPTS DEMONSTRATED:
 * - Arrays: Used to store parking slots on each floor
 * - Tree Structure: Used to represent hierarchical parking levels
 * - Insertion: Adding vehicles to parking slots
 * - Deletion: Removing vehicles from parking slots
 * - Searching: Finding vehicles by number or slot
 * - Traversal: Displaying all floors and slots
 */

class ParkingSlot {
  /**
   * ARRAY ELEMENT: Represents a single parking slot
   */
  constructor(slotNo, vehicleType) {
    this.slotNo = slotNo;
    this.vehicleType = vehicleType; // "bike" | "car" | "truck"
    this.status = "empty"; // "empty" | "occupied"
    this.vehicleNumber = null;
    this.entryTime = null;
    this.exitTime = null;
  }
}

class ParkingFloor {
  /**
   * TREE NODE: Represents a single parking floor
   * Each floor contains an array of slots
   */
  constructor(floorNumber, totalSlots = 10) {
    this.floorNumber = floorNumber;
    // ARRAY STRUCTURE: Array of parking slots
    this.slots = [];
    
    // Initialize slots based on vehicle types
    const slotTypes = ["bike", "car", "truck"];
    const slotsPerType = Math.floor(totalSlots / 3);
    
    let slotNo = 1;
    for (let type of slotTypes) {
      for (let i = 0; i < slotsPerType; i++) {
        this.slots.push(new ParkingSlot(slotNo++, type));
      }
    }
    
    // Fill remaining slots
    while (slotNo <= totalSlots) {
      this.slots.push(new ParkingSlot(slotNo++, "bike"));
    }
  }

  /**
   * SEARCHING ALGORITHM (Linear Search)
   * Find empty slot for a specific vehicle type
   * Time Complexity: O(n) where n = number of slots on floor
   */
  findEmptySlot(vehicleType) {
    for (let slot of this.slots) {
      if (slot.status === "empty" && slot.vehicleType === vehicleType) {
        return slot;
      }
    }
    return null; // No empty slot found
  }

  /**
   * SEARCHING ALGORITHM (Linear Search)
   * Find vehicle by vehicle number
   * Time Complexity: O(n)
   */
  findVehicleByNumber(vehicleNumber) {
    for (let slot of this.slots) {
      if (slot.vehicleNumber === vehicleNumber && slot.status === "occupied") {
        return slot;
      }
    }
    return null;
  }

  /**
   * TRAVERSAL: Get all occupied slots on this floor
   * Time Complexity: O(n)
   */
  getOccupiedSlots() {
    return this.slots.filter(slot => slot.status === "occupied");
  }

  /**
   * TRAVERSAL: Get all empty slots on this floor
   * Time Complexity: O(n)
   */
  getEmptySlots() {
    return this.slots.filter(slot => slot.status === "empty");
  }

  /**
   * Get floor statistics
   */
  getFloorStats() {
    const occupied = this.getOccupiedSlots().length;
    const empty = this.getEmptySlots().length;
    return {
      floorNumber: this.floorNumber,
      totalSlots: this.slots.length,
      occupiedSlots: occupied,
      emptySlots: empty,
      occupancyRate: (occupied / this.slots.length) * 100
    };
  }
}

class ParkingSystem {
  /**
   * TREE STRUCTURE (Main Root Node)
   * Represents the entire parking system with multiple floors
   */
  constructor(totalFloors = 3, slotsPerFloor = 10) {
    // TREE: Array of floor nodes
    this.floors = [];
    this.parkingHistory = []; // Track all vehicle movements
    this.vehicleLocations = {}; // Quick lookup: vehicleNumber -> { floor, slot }

    // Initialize parking floors (Tree creation)
    for (let i = 1; i <= totalFloors; i++) {
      this.floors.push(new ParkingFloor(i, slotsPerFloor));
    }
  }

  /**
   * INSERTION ALGORITHM
   * Add a vehicle to the parking system
   * 
   * Algorithm:
   * 1. Find available floor with empty slot for vehicle type
   * 2. Find nearest empty slot on that floor
   * 3. Mark slot as occupied
   * 4. Record entry time and vehicle info
   * 5. Update quick lookup map
   * 
   * Time Complexity: O(f * n) where f = floors, n = slots per floor
   * Space Complexity: O(1) additional space
   */
  parkVehicle(vehicleNumber, vehicleType) {
    // Input validation
    if (!vehicleNumber || !vehicleType) {
      return { success: false, message: "Invalid vehicle details" };
    }

    // Check if vehicle already parked
    if (this.vehicleLocations[vehicleNumber]) {
      return { success: false, message: "Vehicle already parked" };
    }

    // TRAVERSAL: Search through all floors
    for (let floor of this.floors) {
      const emptySlot = floor.findEmptySlot(vehicleType);
      
      if (emptySlot) {
        // INSERTION: Mark slot as occupied
        emptySlot.status = "occupied";
        emptySlot.vehicleNumber = vehicleNumber;
        emptySlot.entryTime = new Date();

        // Update quick lookup
        this.vehicleLocations[vehicleNumber] = {
          floorNumber: floor.floorNumber,
          slotNumber: emptySlot.slotNo,
          vehicleType: vehicleType,
          entryTime: emptySlot.entryTime
        };

        // Record in history
        this.parkingHistory.push({
          vehicleNumber,
          vehicleType,
          floorNumber: floor.floorNumber,
          slotNumber: emptySlot.slotNo,
          entryTime: emptySlot.entryTime,
          exitTime: null,
          duration: null,
          fee: null
        });

        return {
          success: true,
          message: "Vehicle parked successfully",
          data: {
            vehicleNumber,
            vehicleType,
            floorNumber: floor.floorNumber,
            slotNumber: emptySlot.slotNo,
            entryTime: emptySlot.entryTime
          }
        };
      }
    }

    return { 
      success: false, 
      message: `No available ${vehicleType} slots in parking system` 
    };
  }

  /**
   * DELETION ALGORITHM
   * Remove a vehicle from the parking system
   * 
   * Algorithm:
   * 1. Search for vehicle in quick lookup map
   * 2. Find the slot
   * 3. Calculate parking duration and fee
   * 4. Mark slot as empty
   * 5. Remove from quick lookup
   * 
   * Time Complexity: O(1) - using hash map for quick lookup
   */
  unparkVehicle(vehicleNumber) {
    // SEARCHING: Quick lookup using hash map
    const location = this.vehicleLocations[vehicleNumber];

    if (!location) {
      return { success: false, message: "Vehicle not found in parking" };
    }

    const floor = this.floors[location.floorNumber - 1];
    const slot = floor.slots[location.slotNumber - 1];

    // DELETION: Mark slot as empty
    const exitTime = new Date();
    const duration = (exitTime - location.entryTime) / (1000 * 60); // minutes

    // Calculate parking fee (assuming ₹10 per hour for cars, ₹5 for bikes, ₹20 for trucks)
    const ratesPerHour = {
      bike: 5,
      car: 10,
      truck: 20
    };
    const fee = Math.ceil((duration / 60) * ratesPerHour[location.vehicleType]);

    slot.status = "empty";
    slot.vehicleNumber = null;
    slot.exitTime = exitTime;
    slot.entryTime = null;

    // Update history
    const historyIndex = this.parkingHistory.findIndex(
      h => h.vehicleNumber === vehicleNumber && h.exitTime === null
    );
    if (historyIndex !== -1) {
      this.parkingHistory[historyIndex].exitTime = exitTime;
      this.parkingHistory[historyIndex].duration = Math.round(duration);
      this.parkingHistory[historyIndex].fee = fee;
    }

    // DELETION: Remove from quick lookup
    delete this.vehicleLocations[vehicleNumber];

    return {
      success: true,
      message: "Vehicle removed successfully",
      data: {
        vehicleNumber,
        entryTime: location.entryTime,
        exitTime,
        parkingDuration: `${Math.floor(duration / 60)}h ${Math.round(duration % 60)}m`,
        parkingFee: `₹${fee}`
      }
    };
  }

  /**
   * SEARCHING ALGORITHM (Hash Map Based)
   * Find vehicle location
   * Time Complexity: O(1) - constant time lookup
   */
  searchVehicle(vehicleNumber) {
    const location = this.vehicleLocations[vehicleNumber];

    if (!location) {
      return { success: false, message: "Vehicle not found" };
    }

    const floor = this.floors[location.floorNumber - 1];
    const slot = floor.slots[location.slotNumber - 1];

    return {
      success: true,
      data: {
        vehicleNumber,
        vehicleType: location.vehicleType,
        floorNumber: location.floorNumber,
        slotNumber: location.slotNumber,
        entryTime: location.entryTime,
        duration: Math.round((new Date() - location.entryTime) / (1000 * 60))
      }
    };
  }

  /**
   * TRAVERSAL ALGORITHM (In-order Traversal)
   * Display all parking floors with their slots
   * Time Complexity: O(f * n) where f = floors, n = slots per floor
   */
  getAllFloors() {
    const floorData = [];
    
    // TRAVERSAL: Visit each floor (tree node)
    for (let floor of this.floors) {
      const slots = [];
      
      // TRAVERSAL: Visit each slot (array elements)
      for (let slot of floor.slots) {
        slots.push({
          slotNo: slot.slotNo,
          vehicleType: slot.vehicleType,
          status: slot.status,
          vehicleNumber: slot.vehicleNumber,
          entryTime: slot.entryTime
        });
      }
      
      floorData.push({
        floorNumber: floor.floorNumber,
        slots: slots,
        stats: floor.getFloorStats()
      });
    }
    
    return floorData;
  }

  /**
   * Get all available slots across all floors
   * Time Complexity: O(f * n)
   */
  getAvailableSlots() {
    const available = [];
    
    for (let floor of this.floors) {
      const emptySlots = floor.getEmptySlots();
      available.push({
        floorNumber: floor.floorNumber,
        availableSlots: emptySlots.map(slot => ({
          slotNo: slot.slotNo,
          vehicleType: slot.vehicleType
        })),
        count: emptySlots.length
      });
    }
    
    return available;
  }

  /**
   * Get parking system statistics
   * Time Complexity: O(f * n)
   */
  getSystemStats() {
    let totalSlots = 0;
    let occupiedSlots = 0;
    let emptySlots = 0;

    for (let floor of this.floors) {
      const stats = floor.getFloorStats();
      totalSlots += stats.totalSlots;
      occupiedSlots += stats.occupiedSlots;
      emptySlots += stats.emptySlots;
    }

    return {
      totalFloors: this.floors.length,
      totalSlots,
      occupiedSlots,
      emptySlots,
      occupancyRate: (occupiedSlots / totalSlots) * 100,
      parkedVehicles: Object.keys(this.vehicleLocations).length
    };
  }

  /**
   * Get parking history with filtering
   */
  getParkingHistory(filter = {}) {
    let history = [...this.parkingHistory];

    if (filter.vehicleNumber) {
      history = history.filter(h => h.vehicleNumber === filter.vehicleNumber);
    }

    if (filter.vehicleType) {
      history = history.filter(h => h.vehicleType === filter.vehicleType);
    }

    return history.sort((a, b) => b.entryTime - a.entryTime);
  }
}

export default ParkingSystem;
