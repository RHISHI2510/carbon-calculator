import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import { emissionFactors } from "../shared/schema";
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

// Initialize database connection
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { emissionFactors } });

// List of emission factors with their data
const emissionFactorData = [
  // Electricity emission factors by country (kg CO2e per kWh)
  {
    category: "electricity",
    subcategory: "grid",
    countryCode: "us",
    value: 0.42,
    unit: "kg CO2e/kWh",
    description: "US national average grid electricity emissions",
    year: 2023
  },
  {
    category: "electricity",
    subcategory: "grid",
    countryCode: "uk",
    value: 0.23,
    unit: "kg CO2e/kWh",
    description: "UK national average grid electricity emissions",
    year: 2023
  },
  {
    category: "electricity",
    subcategory: "grid",
    countryCode: "ca",
    value: 0.14,
    unit: "kg CO2e/kWh",
    description: "Canada national average grid electricity emissions (low due to hydro)",
    year: 2023
  },
  {
    category: "electricity",
    subcategory: "grid",
    countryCode: "au",
    value: 0.79,
    unit: "kg CO2e/kWh",
    description: "Australia national average grid electricity emissions",
    year: 2023
  },
  {
    category: "electricity",
    subcategory: "grid",
    countryCode: "in",
    value: 0.82,
    unit: "kg CO2e/kWh",
    description: "India national average grid electricity emissions (high due to coal)",
    year: 2023
  },
  {
    category: "electricity",
    subcategory: "grid",
    countryCode: "cn",
    value: 0.63,
    unit: "kg CO2e/kWh",
    description: "China national average grid electricity emissions",
    year: 2023
  },
  {
    category: "electricity",
    subcategory: "grid",
    countryCode: "de",
    value: 0.37,
    unit: "kg CO2e/kWh",
    description: "Germany national average grid electricity emissions",
    year: 2023
  },
  {
    category: "electricity",
    subcategory: "grid",
    countryCode: "fr",
    value: 0.09,
    unit: "kg CO2e/kWh",
    description: "France national average grid electricity emissions (low due to nuclear)",
    year: 2023
  },
  {
    category: "electricity",
    subcategory: "grid",
    countryCode: "global",
    value: 0.475,
    unit: "kg CO2e/kWh",
    description: "Global average grid electricity emissions",
    year: 2023
  },
  
  // Natural gas emission factors
  {
    category: "natural_gas",
    subcategory: "residential",
    countryCode: "global",
    value: 5.3,
    unit: "kg CO2e/therm",
    description: "Natural gas emissions for residential heating",
    year: 2023
  },
  
  // Car emission factors
  {
    category: "car",
    subcategory: "sedan",
    countryCode: "global",
    value: 0.39,
    unit: "kg CO2e/mile",
    description: "Average sedan emissions per mile",
    year: 2023
  },
  {
    category: "car",
    subcategory: "suv",
    countryCode: "global",
    value: 0.57,
    unit: "kg CO2e/mile",
    description: "Average SUV/truck emissions per mile",
    year: 2023
  },
  {
    category: "car",
    subcategory: "truck",
    countryCode: "global",
    value: 0.68,
    unit: "kg CO2e/mile",
    description: "Average large truck emissions per mile",
    year: 2023
  },
  {
    category: "car",
    subcategory: "hybrid",
    countryCode: "global",
    value: 0.19,
    unit: "kg CO2e/mile",
    description: "Average hybrid vehicle emissions per mile",
    year: 2023
  },
  {
    category: "car",
    subcategory: "electric",
    countryCode: "global",
    value: 0.1,
    unit: "kg CO2e/mile",
    description: "Average electric vehicle emissions per mile (including electricity generation)",
    year: 2023
  },
  
  // Public transport emission factors
  {
    category: "public_transport",
    subcategory: "bus",
    countryCode: "global",
    value: 0.16,
    unit: "kg CO2e/mile",
    description: "Average bus emissions per passenger mile",
    year: 2023
  },
  {
    category: "public_transport",
    subcategory: "train",
    countryCode: "global",
    value: 0.12,
    unit: "kg CO2e/mile",
    description: "Average train emissions per passenger mile",
    year: 2023
  },
  {
    category: "public_transport",
    subcategory: "subway",
    countryCode: "global",
    value: 0.11,
    unit: "kg CO2e/mile",
    description: "Average subway/metro emissions per passenger mile",
    year: 2023
  },
  
  // Flight emission factors
  {
    category: "flight",
    subcategory: "short",
    countryCode: "global",
    value: 0.28,
    unit: "kg CO2e/mile",
    description: "Short-haul flight emissions per passenger mile",
    year: 2023
  },
  {
    category: "flight",
    subcategory: "medium",
    countryCode: "global",
    value: 0.22,
    unit: "kg CO2e/mile",
    description: "Medium-haul flight emissions per passenger mile",
    year: 2023
  },
  {
    category: "flight",
    subcategory: "long",
    countryCode: "global",
    value: 0.18,
    unit: "kg CO2e/mile",
    description: "Long-haul flight emissions per passenger mile",
    year: 2023
  },
  {
    category: "flight",
    subcategory: "rf_factor",
    countryCode: "global",
    value: 1.9,
    unit: "multiplier",
    description: "Radiative forcing factor for high-altitude emissions",
    year: 2023
  },
  
  // Food emission factors
  {
    category: "food",
    subcategory: "average",
    countryCode: "global",
    value: 1.7,
    unit: "tonnes CO2e/year",
    description: "Average food carbon footprint per person per year",
    year: 2023
  },
  {
    category: "food",
    subcategory: "meat_heavy",
    countryCode: "global",
    value: 2.5,
    unit: "tonnes CO2e/year",
    description: "Meat-heavy diet carbon footprint per person per year",
    year: 2023
  },
  {
    category: "food",
    subcategory: "vegetarian",
    countryCode: "global",
    value: 1.2,
    unit: "tonnes CO2e/year",
    description: "Vegetarian diet carbon footprint per person per year",
    year: 2023
  },
  {
    category: "food",
    subcategory: "vegan",
    countryCode: "global",
    value: 0.8,
    unit: "tonnes CO2e/year",
    description: "Vegan diet carbon footprint per person per year",
    year: 2023
  },
  
  // Home type factors (multipliers)
  {
    category: "home",
    subcategory: "apartment",
    countryCode: "global",
    value: 0.75,
    unit: "multiplier",
    description: "Adjustment factor for apartment/condo energy use",
    year: 2023
  },
  {
    category: "home",
    subcategory: "house",
    countryCode: "global",
    value: 1.0,
    unit: "multiplier",
    description: "Base factor for house energy use",
    year: 2023
  },
  {
    category: "home",
    subcategory: "other",
    countryCode: "global",
    value: 0.9,
    unit: "multiplier",
    description: "Adjustment factor for other home types",
    year: 2023
  }
];

// Function to insert emission factor data
async function seedEmissionFactors() {
  console.log("Starting to seed emission factors database...");
  
  // Clear existing data to avoid duplicates
  try {
    await db.delete(emissionFactors);
    console.log("Cleared existing emission factor data");
  } catch (error) {
    console.error("Error clearing emission factor data:", error);
  }
  
  // Insert new emission factor data
  try {
    const insertedFactors = await db.insert(emissionFactors).values(emissionFactorData).returning();
    console.log(`Successfully inserted ${insertedFactors.length} emission factors`);
  } catch (error) {
    console.error("Error inserting emission factors:", error);
  }
  
  // Close the database connection
  await pool.end();
  console.log("Database connection closed");
}

// Run the seeding function
seedEmissionFactors()
  .then(() => console.log("Emission factor seeding complete"))
  .catch(error => console.error("Error seeding emission factors:", error));