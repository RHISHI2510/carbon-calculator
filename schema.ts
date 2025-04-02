import { pgTable, text, serial, integer, boolean, real, jsonb, timestamp, primaryKey, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User account schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Countries data for accurate regional calculations
export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 2 }).notNull().unique(),
  name: text("name").notNull(),
  currencyCode: varchar("currency_code", { length: 3 }).notNull(),
  currencySymbol: varchar("currency_symbol", { length: 10 }).notNull(),
  region: varchar("region", { length: 50 }).notNull(),
  averageFootprint: real("average_footprint"),
  electricityFactor: real("electricity_factor"),
  gasFactor: real("gas_factor"),
  transportFactor: real("transport_factor"),
  foodFactor: real("food_factor"),
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
});

export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Country = typeof countries.$inferSelect;

// Emission factors for different activities and regions
export const emissionFactors = pgTable("emission_factors", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 50 }).notNull(),
  subcategory: varchar("subcategory", { length: 50 }).notNull(),
  countryCode: varchar("country_code", { length: 20 }).notNull(),
  value: real("value").notNull(),
  unit: varchar("unit", { length: 20 }).notNull(),
  description: text("description"),
  year: integer("year").notNull(),
});

export const insertEmissionFactorSchema = createInsertSchema(emissionFactors).omit({
  id: true,
});

export type InsertEmissionFactor = z.infer<typeof insertEmissionFactorSchema>;
export type EmissionFactor = typeof emissionFactors.$inferSelect;

// Carbon footprint calculation schema
export const footprints = pgTable("footprints", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  calculationType: text("calculation_type").notNull(), // individual or business
  location: text("location").notNull(),
  householdSize: integer("household_size"),
  incomeRange: text("income_range"),
  // Home energy section
  homeType: text("home_type"),
  homeSize: real("home_size"),
  homeUnit: text("home_unit"), // sqft or sqm
  electricityUsage: real("electricity_usage"),
  gasUsage: real("gas_usage"),
  renewableSources: text("renewable_sources").array(),
  // Transportation section
  primaryTransport: text("primary_transport"),
  carType: text("car_type"),
  fuelEfficiency: real("fuel_efficiency"),
  annualMileage: integer("annual_mileage"),
  // Public transit specific fields
  weeklyBusRides: real("weekly_bus_rides"),
  avgCommuteDistance: real("avg_commute_distance"),
  // Bicycle specific fields
  weeklyBikeMiles: real("weekly_bike_miles"),
  // Walking specific fields
  weeklyWalkingMiles: real("weekly_walking_miles"),
  // Flight specific fields
  shortFlights: integer("short_flights"),
  longFlights: integer("long_flights"),
  avgFlightDistance: real("avg_flight_distance"),
  // Results
  totalEmissions: real("total_emissions"),
  homeEmissions: real("home_emissions"),
  transportEmissions: real("transport_emissions"),
  foodEmissions: real("food_emissions"),
  recommendations: jsonb("recommendations"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFootprintSchema = createInsertSchema(footprints)
  .omit({ id: true, userId: true, recommendations: true, createdAt: true, 
    totalEmissions: true, homeEmissions: true, transportEmissions: true, foodEmissions: true });

export type InsertFootprint = z.infer<typeof insertFootprintSchema>;
export type Footprint = typeof footprints.$inferSelect;

// Form schema with validations for client-side
export const calculatorFormSchema = z.object({
  calculationType: z.enum(['individual', 'business']),
  location: z.string().min(1, { message: "Location is required" }),
  householdSize: z.number().nullable().optional(),
  incomeRange: z.string().optional(),
  // Home energy section
  homeType: z.string().optional(),
  homeSize: z.number().optional(),
  homeUnit: z.enum(['sqft', 'sqm']).optional(),
  electricityUsage: z.number().optional(),
  gasUsage: z.number().optional(),
  renewableSources: z.array(z.string()).optional(),
  // Transportation section
  primaryTransport: z.string().optional(),
  // Car specific fields
  carType: z.string().optional(),
  fuelEfficiency: z.number().optional(),
  annualMileage: z.number().optional(),
  // Public transit specific fields
  weeklyBusRides: z.number().optional(),
  avgCommuteDistance: z.number().optional(),
  // Bicycle specific fields
  weeklyBikeMiles: z.number().optional(),
  // Walking specific fields
  weeklyWalkingMiles: z.number().optional(),
  // Flight specific fields
  shortFlights: z.number().optional(),
  longFlights: z.number().optional(),
  avgFlightDistance: z.number().optional(),
});

export type CalculatorFormType = z.infer<typeof calculatorFormSchema>;

// Schema for AI recommendations request
export const recommendationRequestSchema = z.object({
  footprintData: calculatorFormSchema,
  totalEmissions: z.number(),
  homeEmissions: z.number(),
  transportEmissions: z.number(),
  foodEmissions: z.number(),
});

export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;

// Schema for recommendation responses
export const recommendationSchema = z.object({
  id: z.string(),
  category: z.enum(['home', 'transport', 'food', 'general']),
  title: z.string(),
  description: z.string(),
  iconName: z.string(),
  potentialReduction: z.number(),
});

export type Recommendation = z.infer<typeof recommendationSchema>;

// Training dataset for machine learning model improvement
export const trainingData = pgTable("training_data", {
  id: serial("id").primaryKey(),
  footprintId: integer("footprint_id").references(() => footprints.id),
  countryCode: varchar("country_code", { length: 20 }).notNull(),
  inputData: jsonb("input_data").notNull(),
  verifiedEmissions: real("verified_emissions"),
  source: text("source"),
  collectionMethod: text("collection_method"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTrainingDataSchema = createInsertSchema(trainingData).omit({
  id: true,
  createdAt: true,
});

export type InsertTrainingData = z.infer<typeof insertTrainingDataSchema>;
export type TrainingData = typeof trainingData.$inferSelect;

// Custom emission factors that can be provided by users (requires verification)
export const customEmissionFactors = pgTable("custom_emission_factors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  category: varchar("category", { length: 50 }).notNull(),
  subcategory: varchar("subcategory", { length: 50 }).notNull(),
  countryCode: varchar("country_code", { length: 20 }).notNull(),
  value: real("value").notNull(),
  unit: varchar("unit", { length: 20 }).notNull(),
  source: text("source"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCustomEmissionFactorSchema = createInsertSchema(customEmissionFactors).omit({
  id: true,
  verified: true,
  createdAt: true,
});

export type InsertCustomEmissionFactor = z.infer<typeof insertCustomEmissionFactorSchema>;
export type CustomEmissionFactor = typeof customEmissionFactors.$inferSelect;
