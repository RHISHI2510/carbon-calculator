import { 
  users, type User, type InsertUser,
  footprints, type Footprint, type InsertFootprint,
  type Recommendation
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Footprint methods
  createFootprint(footprint: InsertFootprint, userId?: number): Promise<Footprint>;
  getFootprint(id: number): Promise<Footprint | undefined>;
  getFootprintsByUserId(userId: number): Promise<Footprint[]>;
  
  // Emission factors lookup
  getEmissionFactor(category: string, key: string): Promise<number>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private footprints: Map<number, Footprint>;
  private emissionFactors: Map<string, number>;
  
  currentUserId: number;
  currentFootprintId: number;

  constructor() {
    this.users = new Map();
    this.footprints = new Map();
    this.emissionFactors = new Map();
    this.currentUserId = 1;
    this.currentFootprintId = 1;
    
    // Initialize emission factors
    this.initializeEmissionFactors();
  }
  
  private initializeEmissionFactors(): void {
    // Electricity emission factors by country (kg CO2e per kWh)
    this.emissionFactors.set('electricity_us', 0.42);
    this.emissionFactors.set('electricity_uk', 0.23);
    this.emissionFactors.set('electricity_ca', 0.14);
    this.emissionFactors.set('electricity_au', 0.79);
    this.emissionFactors.set('electricity_in', 0.82); // India has a higher emissions factor due to coal dependency
    this.emissionFactors.set('electricity_global', 0.475);
    
    // Natural gas emission factors (kg CO2e per therm)
    this.emissionFactors.set('natural_gas', 5.3);
    
    // Transportation emission factors
    this.emissionFactors.set('car_sedan', 0.39); // kg CO2e per mile
    this.emissionFactors.set('car_suv', 0.57); // kg CO2e per mile
    this.emissionFactors.set('car_truck', 0.68); // kg CO2e per mile
    this.emissionFactors.set('car_hybrid', 0.19); // kg CO2e per mile
    this.emissionFactors.set('car_electric', 0.1); // kg CO2e per mile
    this.emissionFactors.set('public_transport', 0.16); // kg CO2e per mile
    this.emissionFactors.set('bike', 0); // kg CO2e per mile
    this.emissionFactors.set('walking', 0); // kg CO2e per mile
    
    // Flight emission factors
    // More accurate emissions per mile based on flight distance category
    this.emissionFactors.set('flight_short', 0.28); // kg CO2e per mile (shorter flights are less efficient per mile)
    this.emissionFactors.set('flight_medium', 0.22); // kg CO2e per mile (medium-haul flights 1000-2000 miles)
    this.emissionFactors.set('flight_long', 0.18); // kg CO2e per mile (long-haul flights are most efficient per mile)
    // Additional radiative forcing factor - typically applied for high-altitude emissions
    this.emissionFactors.set('flight_rf_factor', 1.9); // Multiplier for non-CO2 warming effects at altitude
    // Legacy factors for compatibility with older calculations
    this.emissionFactors.set('flight_short_legacy', 115); // kg CO2e per flight (one-way)
    this.emissionFactors.set('flight_medium_legacy', 450); // kg CO2e per flight (one-way)
    this.emissionFactors.set('flight_long_legacy', 715); // kg CO2e per flight (one-way)
    
    // Food emission factors per person per year
    this.emissionFactors.set('food_meat_heavy', 2.5); // tonnes CO2e
    this.emissionFactors.set('food_average', 1.7); // tonnes CO2e
    this.emissionFactors.set('food_vegetarian', 1.2); // tonnes CO2e
    this.emissionFactors.set('food_vegan', 0.8); // tonnes CO2e
    
    // Home type/size factors
    this.emissionFactors.set('home_apartment', 0.75); // multiplier
    this.emissionFactors.set('home_house', 1.0); // multiplier
    this.emissionFactors.set('home_other', 0.9); // multiplier
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createFootprint(footprint: InsertFootprint, userId?: number): Promise<Footprint> {
    const id = this.currentFootprintId++;
    const now = new Date();
    
    // Create a new object with all fields properly set as required by the Footprint type
    const fullFootprint = {
      id,
      userId: userId || null,
      calculationType: footprint.calculationType,
      location: footprint.location,
      // Optional fields - convert undefined to null to match type
      householdSize: footprint.householdSize ?? null,
      incomeRange: footprint.incomeRange ?? null,
      homeType: footprint.homeType ?? null,
      homeSize: footprint.homeSize ?? null,
      homeUnit: footprint.homeUnit ?? null,
      electricityUsage: footprint.electricityUsage ?? null,
      gasUsage: footprint.gasUsage ?? null,
      renewableSources: footprint.renewableSources ?? [],
      primaryTransport: footprint.primaryTransport ?? null,
      carType: footprint.carType ?? null,
      fuelEfficiency: footprint.fuelEfficiency ?? null,
      annualMileage: footprint.annualMileage ?? null,
      weeklyBusRides: footprint.weeklyBusRides ?? null,
      avgCommuteDistance: footprint.avgCommuteDistance ?? null,
      weeklyBikeMiles: footprint.weeklyBikeMiles ?? null,
      weeklyWalkingMiles: footprint.weeklyWalkingMiles ?? null,
      shortFlights: footprint.shortFlights ?? null,
      longFlights: footprint.longFlights ?? null,
      avgFlightDistance: footprint.avgFlightDistance ?? null,
      // Results - initialize with zeros
      totalEmissions: 0,
      homeEmissions: 0,
      transportEmissions: 0,
      foodEmissions: 0,
      recommendations: [],
      createdAt: now
    };
    
    this.footprints.set(id, fullFootprint);
    return fullFootprint;
  }
  
  async getFootprint(id: number): Promise<Footprint | undefined> {
    return this.footprints.get(id);
  }
  
  async getFootprintsByUserId(userId: number): Promise<Footprint[]> {
    return Array.from(this.footprints.values()).filter(
      (footprint) => footprint.userId === userId
    );
  }
  
  async getEmissionFactor(category: string, key: string): Promise<number> {
    const factorKey = `${category}_${key}`;
    const factor = this.emissionFactors.get(factorKey);
    
    if (factor === undefined) {
      // Return a default factor if the specific one is not found
      return this.emissionFactors.get(`${category}_global`) || 0;
    }
    
    return factor;
  }
}

// Database implementation of the storage interface
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";
import { 
  countries, emissionFactors, customEmissionFactors, trainingData,
  type Country, type EmissionFactor, type CustomEmissionFactor, type TrainingData
} from "@shared/schema";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async createFootprint(footprint: InsertFootprint, userId?: number): Promise<Footprint> {
    // Create a valid footprint object with defaults for null values
    const fullFootprint = {
      ...footprint,
      userId: userId || null,
      // Use nullish coalescing to ensure proper values for optional fields
      householdSize: footprint.householdSize ?? null,
      incomeRange: footprint.incomeRange ?? null,
      homeType: footprint.homeType ?? null,
      homeSize: footprint.homeSize ?? null,
      homeUnit: footprint.homeUnit ?? null,
      electricityUsage: footprint.electricityUsage ?? null,
      gasUsage: footprint.gasUsage ?? null,
      renewableSources: footprint.renewableSources ?? [],
      primaryTransport: footprint.primaryTransport ?? null,
      carType: footprint.carType ?? null,
      fuelEfficiency: footprint.fuelEfficiency ?? null,
      annualMileage: footprint.annualMileage ?? null,
      weeklyBusRides: footprint.weeklyBusRides ?? null,
      avgCommuteDistance: footprint.avgCommuteDistance ?? null,
      weeklyBikeMiles: footprint.weeklyBikeMiles ?? null,
      weeklyWalkingMiles: footprint.weeklyWalkingMiles ?? null,
      shortFlights: footprint.shortFlights ?? null,
      longFlights: footprint.longFlights ?? null,
      avgFlightDistance: footprint.avgFlightDistance ?? null,
      // Initialize results with zeros
      totalEmissions: 0,
      homeEmissions: 0,
      transportEmissions: 0, 
      foodEmissions: 0,
      recommendations: []
    };
    
    const [result] = await db
      .insert(footprints)
      .values(fullFootprint)
      .returning();
    
    return result;
  }
  
  async getFootprint(id: number): Promise<Footprint | undefined> {
    const [footprint] = await db.select().from(footprints).where(eq(footprints.id, id));
    return footprint;
  }
  
  async getFootprintsByUserId(userId: number): Promise<Footprint[]> {
    return db.select().from(footprints).where(eq(footprints.userId, userId));
  }
  
  async getEmissionFactor(category: string, key: string): Promise<number> {
    // Try to find a country-specific emission factor first
    const countryCode = key.length === 2 ? key : "global";
    
    // Look in the emission factors table
    const [factor] = await db.select()
      .from(emissionFactors)
      .where(and(
        eq(emissionFactors.category, category),
        eq(emissionFactors.countryCode, countryCode)
      ));
      
    if (factor) {
      return factor.value;
    }
    
    // If not found and this is a country-specific request, try to get the global default
    if (countryCode !== "global") {
      return this.getEmissionFactor(category, "global");
    }
    
    // Fallback hardcoded values based on category
    const fallbackValues: Record<string, number> = {
      'electricity': 0.475,
      'natural_gas': 5.3,
      'car': 0.39,
      'flight': 0.22,
      'food': 1.7
    };
    
    return fallbackValues[category] || 0;
  }
  
  // Additional methods for working with countries
  async getAllCountries(): Promise<Country[]> {
    return db.select().from(countries).orderBy(asc(countries.name));
  }
  
  async getCountryByCode(code: string): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.code, code));
    return country;
  }
  
  // Methods for working with training data
  async saveTrainingData(data: any, countryCode: string, footprintId?: number): Promise<TrainingData> {
    const [result] = await db.insert(trainingData)
      .values({
        footprintId: footprintId || null,
        countryCode,
        inputData: data,
        verified: false,
        collectionMethod: 'user_submission'
      })
      .returning();
    
    return result;
  }
  
  // Method to update footprint results after calculation
  async updateFootprintResults(
    id: number, 
    totalEmissions: number,
    homeEmissions: number,
    transportEmissions: number,
    foodEmissions: number,
    recommendations: any[] = []
  ): Promise<Footprint> {
    const [updated] = await db.update(footprints)
      .set({
        totalEmissions,
        homeEmissions,
        transportEmissions,
        foodEmissions,
        recommendations
      })
      .where(eq(footprints.id, id))
      .returning();
    
    return updated;
  }
}

// Create and export a singleton instance of the storage
// Use DatabaseStorage now that we have a database connection
export const storage = new DatabaseStorage();
