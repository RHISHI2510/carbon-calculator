import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import { countries } from "../shared/schema";
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

// Initialize database connection
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { countries } });

// List of countries with their data
const countryData = [
  // This list contains all countries with ISO codes, names, currency codes, symbols, regions, 
  // and estimated footprint factors
  
  // North America
  { 
    code: "us", 
    name: "United States", 
    currencyCode: "USD", 
    currencySymbol: "$", 
    region: "North America",
    averageFootprint: 16.1,
    electricityFactor: 0.42,
    gasFactor: 5.3,
    transportFactor: 0.39,
    foodFactor: 1.7
  },
  { 
    code: "ca", 
    name: "Canada", 
    currencyCode: "CAD", 
    currencySymbol: "C$", 
    region: "North America",
    averageFootprint: 15.4,
    electricityFactor: 0.14,
    gasFactor: 5.3,
    transportFactor: 0.39,
    foodFactor: 1.7
  },
  { 
    code: "mx", 
    name: "Mexico", 
    currencyCode: "MXN", 
    currencySymbol: "$", 
    region: "North America",
    averageFootprint: 3.7,
    electricityFactor: 0.45,
    gasFactor: 5.3,
    transportFactor: 0.39,
    foodFactor: 1.4
  },
  
  // Europe
  { 
    code: "uk", 
    name: "United Kingdom", 
    currencyCode: "GBP", 
    currencySymbol: "£", 
    region: "Europe",
    averageFootprint: 5.5,
    electricityFactor: 0.23,
    gasFactor: 5.3,
    transportFactor: 0.32,
    foodFactor: 1.7
  },
  { 
    code: "de", 
    name: "Germany", 
    currencyCode: "EUR", 
    currencySymbol: "€", 
    region: "Europe",
    averageFootprint: 9.4,
    electricityFactor: 0.37,
    gasFactor: 5.3,
    transportFactor: 0.32,
    foodFactor: 1.7
  },
  { 
    code: "fr", 
    name: "France", 
    currencyCode: "EUR", 
    currencySymbol: "€", 
    region: "Europe",
    averageFootprint: 5.0,
    electricityFactor: 0.09,
    gasFactor: 5.3,
    transportFactor: 0.32,
    foodFactor: 1.7
  },
  { 
    code: "it", 
    name: "Italy", 
    currencyCode: "EUR", 
    currencySymbol: "€", 
    region: "Europe",
    averageFootprint: 5.8,
    electricityFactor: 0.33,
    gasFactor: 5.3,
    transportFactor: 0.32,
    foodFactor: 1.7
  },
  { 
    code: "es", 
    name: "Spain", 
    currencyCode: "EUR", 
    currencySymbol: "€", 
    region: "Europe",
    averageFootprint: 5.4,
    electricityFactor: 0.24,
    gasFactor: 5.3,
    transportFactor: 0.32,
    foodFactor: 1.7
  },
  
  // Asia
  { 
    code: "in", 
    name: "India", 
    currencyCode: "INR", 
    currencySymbol: "₹", 
    region: "Asia",
    averageFootprint: 1.9,
    electricityFactor: 0.82,
    gasFactor: 5.3,
    transportFactor: 0.35,
    foodFactor: 1.2
  },
  { 
    code: "cn", 
    name: "China", 
    currencyCode: "CNY", 
    currencySymbol: "¥", 
    region: "Asia",
    averageFootprint: 7.4,
    electricityFactor: 0.63,
    gasFactor: 5.3,
    transportFactor: 0.35,
    foodFactor: 1.3
  },
  { 
    code: "jp", 
    name: "Japan", 
    currencyCode: "JPY", 
    currencySymbol: "¥", 
    region: "Asia",
    averageFootprint: 9.0,
    electricityFactor: 0.47,
    gasFactor: 5.3,
    transportFactor: 0.33,
    foodFactor: 1.7
  },
  { 
    code: "sg", 
    name: "Singapore", 
    currencyCode: "SGD", 
    currencySymbol: "S$", 
    region: "Asia",
    averageFootprint: 8.3,
    electricityFactor: 0.41,
    gasFactor: 5.3,
    transportFactor: 0.33,
    foodFactor: 1.7
  },
  
  // Oceania
  { 
    code: "au", 
    name: "Australia", 
    currencyCode: "AUD", 
    currencySymbol: "A$", 
    region: "Oceania",
    averageFootprint: 15.4,
    electricityFactor: 0.79,
    gasFactor: 5.3,
    transportFactor: 0.38,
    foodFactor: 1.7
  },
  { 
    code: "nz", 
    name: "New Zealand", 
    currencyCode: "NZD", 
    currencySymbol: "NZ$", 
    region: "Oceania",
    averageFootprint: 7.7,
    electricityFactor: 0.15,
    gasFactor: 5.3,
    transportFactor: 0.38,
    foodFactor: 1.7
  },
  
  // Africa
  { 
    code: "za", 
    name: "South Africa", 
    currencyCode: "ZAR", 
    currencySymbol: "R", 
    region: "Africa",
    averageFootprint: 8.3,
    electricityFactor: 0.92,
    gasFactor: 5.3,
    transportFactor: 0.36,
    foodFactor: 1.4
  },
  { 
    code: "ng", 
    name: "Nigeria", 
    currencyCode: "NGN", 
    currencySymbol: "₦", 
    region: "Africa",
    averageFootprint: 0.5,
    electricityFactor: 0.44,
    gasFactor: 5.3,
    transportFactor: 0.36,
    foodFactor: 1.2
  },
  { 
    code: "eg", 
    name: "Egypt", 
    currencyCode: "EGP", 
    currencySymbol: "E£", 
    region: "Africa",
    averageFootprint: 2.5,
    electricityFactor: 0.48,
    gasFactor: 5.3,
    transportFactor: 0.36,
    foodFactor: 1.3
  },
  
  // South America
  { 
    code: "br", 
    name: "Brazil", 
    currencyCode: "BRL", 
    currencySymbol: "R$", 
    region: "South America",
    averageFootprint: 2.2,
    electricityFactor: 0.09,
    gasFactor: 5.3,
    transportFactor: 0.34,
    foodFactor: 1.6
  },
  { 
    code: "ar", 
    name: "Argentina", 
    currencyCode: "ARS", 
    currencySymbol: "$", 
    region: "South America",
    averageFootprint: 4.5,
    electricityFactor: 0.35,
    gasFactor: 5.3,
    transportFactor: 0.34,
    foodFactor: 1.7
  },
  { 
    code: "cl", 
    name: "Chile", 
    currencyCode: "CLP", 
    currencySymbol: "$", 
    region: "South America",
    averageFootprint: 4.7,
    electricityFactor: 0.42,
    gasFactor: 5.3,
    transportFactor: 0.34,
    foodFactor: 1.6
  },
  
  // Global default
  {
    code: "gl", 
    name: "Global", 
    currencyCode: "USD", 
    currencySymbol: "$", 
    region: "Global",
    averageFootprint: 4.8,  // Global average carbon footprint
    electricityFactor: 0.475,
    gasFactor: 5.3,
    transportFactor: 0.37,
    foodFactor: 1.7
  },
  
  // Custom/Other option
  {
    code: "ot", 
    name: "Other", 
    currencyCode: "USD", 
    currencySymbol: "$", 
    region: "Custom",
    averageFootprint: 4.8,  // Uses global average
    electricityFactor: 0.475,
    gasFactor: 5.3,
    transportFactor: 0.37,
    foodFactor: 1.7
  }
];

// Function to insert country data
async function seedCountries() {
  console.log("Starting to seed countries database...");
  
  // Clear existing data to avoid duplicates
  try {
    await db.delete(countries);
    console.log("Cleared existing country data");
  } catch (error) {
    console.error("Error clearing country data:", error);
  }
  
  // Insert new country data
  try {
    const insertedCountries = await db.insert(countries).values(countryData).returning();
    console.log(`Successfully inserted ${insertedCountries.length} countries`);
  } catch (error) {
    console.error("Error inserting countries:", error);
  }
  
  // Close the database connection
  await pool.end();
  console.log("Database connection closed");
}

// Run the seeding function
seedCountries()
  .then(() => console.log("Country seeding complete"))
  .catch(error => console.error("Error seeding countries:", error));