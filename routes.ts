import { Router, type Express, type Request, type Response, type NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertFootprintSchema, 
  recommendationRequestSchema,
  insertCountrySchema,
  insertTrainingDataSchema,
  insertEmissionFactorSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { db } from "./db";

// Extend Express Request to include session
declare global {
  namespace Express {
    interface Request {
      session?: {
        userId?: number;
        [key: string]: any;
      };
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = Router();
  
  // Route to calculate carbon footprint
  apiRouter.post("/calculate-footprint", async (req, res) => {
    try {
      // Add default values for required fields if missing
      const requestData = {
        ...req.body,
        location: req.body.location || 'global' // Provide default location if not provided
      };
      
      // Log the data being processed
      console.log("Processing footprint calculation data:", requestData);
      
      // Validate the input data
      const footprintData = insertFootprintSchema.parse(requestData);
      
      // Store the footprint data
      const userId = req.session?.userId;
      const footprint = await storage.createFootprint(footprintData, userId);
      
      // Calculate emissions based on the input data
      const result = await calculateFootprint(footprintData);
      console.log("Calculation result:", result);
      
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error("Validation error:", validationError.message);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error calculating footprint:", error);
      return res.status(500).json({ message: "Failed to calculate carbon footprint" });
    }
  });
  
  // Route to get AI-powered recommendations
  apiRouter.post("/recommendations", async (req, res) => {
    try {
      // Add default values for required fields if missing
      const requestData = {
        ...req.body,
        footprintData: {
          ...req.body.footprintData,
          location: req.body.footprintData?.location || 'global',
          calculationType: req.body.footprintData?.calculationType || 'individual'
        }
      };
      
      console.log("Processing recommendation request data:", requestData);
      
      // Validate the request
      const recommendationRequest = recommendationRequestSchema.parse(requestData);
      
      // Generate recommendations based on footprint data
      const recommendations = await generateRecommendations(recommendationRequest);
      console.log("Generated recommendations:", recommendations.length);
      
      return res.status(200).json({ recommendations });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error("Validation error in recommendations:", validationError.message);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error generating recommendations:", error);
      return res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });
  
  // Helper function to calculate footprint
  async function calculateFootprint(data: any) {
    // Home energy emissions calculation
    let homeEmissions = 0;
    if (data.electricityUsage) {
      const electricityFactor = await storage.getEmissionFactor('electricity', data.location || 'global');
      homeEmissions += data.electricityUsage * electricityFactor * 12 / 1000; // Convert to tonnes CO2e per year
    }
    
    if (data.gasUsage) {
      const gasFactor = await storage.getEmissionFactor('natural_gas', 'global');
      homeEmissions += data.gasUsage * gasFactor * 12 / 1000; // Convert to tonnes CO2e per year
    }
    
    // Apply home type modifier
    if (data.homeType) {
      const homeTypeFactor = await storage.getEmissionFactor('home', data.homeType);
      homeEmissions *= homeTypeFactor;
    }
    
    // Reduce emissions if renewable sources are used
    if (data.renewableSources && data.renewableSources.length > 0) {
      const reductionFactor = 0.15 * data.renewableSources.length; // 15% reduction per renewable source
      homeEmissions *= (1 - Math.min(reductionFactor, 0.6)); // Cap at 60% reduction
    }
    
    // Transportation emissions calculation
    let transportEmissions = 0;
    
    // Car emissions
    if (data.primaryTransport === 'car' && data.annualMileage) {
      const carType = data.carType || 'sedan';
      const carFactor = await storage.getEmissionFactor('car', carType);
      transportEmissions += data.annualMileage * carFactor / 1000; // Convert to tonnes CO2e
    } 
    // Public transport emissions
    else if (data.primaryTransport === 'publicTransport') {
      const ptFactor = await storage.getEmissionFactor('public_transport', 'global');
      // Calculate annual emissions based on weekly rides and average distance
      if (data.weeklyBusRides && data.avgCommuteDistance) {
        const annualTransitMiles = data.weeklyBusRides * data.avgCommuteDistance * 52;
        transportEmissions += annualTransitMiles * ptFactor / 1000; // Convert to tonnes CO2e
      } else {
        // Fallback for older form data
        if (data.annualMileage) {
          transportEmissions += data.annualMileage * ptFactor / 1000;
        }
      }
    }
    // Bicycle and walking have zero direct emissions
    else if (data.primaryTransport === 'bike' || data.primaryTransport === 'walking') {
      transportEmissions += 0; // Zero direct emissions
    }
    // Primary transportation is flight
    else if (data.primaryTransport === 'flight') {
      const shortFlightFactor = await storage.getEmissionFactor('flight', 'short');
      const mediumFlightFactor = await storage.getEmissionFactor('flight', 'medium');
      const longFlightFactor = await storage.getEmissionFactor('flight', 'long');
      const rfFactor = await storage.getEmissionFactor('flight', 'rf_factor');
      
      if (data.shortFlights) {
        // Short-haul flight - less efficient per mile, typical distance 500 miles
        let flightDistance = data.avgFlightDistance || 500; // Default short flight distance if not provided
        if (flightDistance > 1000) flightDistance = 500; // Override if user provided a long distance for short flights
        
        // Apply radiative forcing factor to account for non-CO2 effects at altitude
        transportEmissions += data.shortFlights * shortFlightFactor * flightDistance * 2 * rfFactor / 1000; // Round trip
      }
      
      // Medium flights are typically 1000-2000 miles
      // Since we don't have a medium flight count field yet, we'll estimate from the averages if appropriate
      if (data.avgFlightDistance && data.avgFlightDistance >= 1000 && data.avgFlightDistance <= 2000) {
        // If the user's average flight distance is in the medium range, allocate some emissions there
        const mediumFlightEstimate = Math.round((data.shortFlights || 0) * 0.3 + (data.longFlights || 0) * 0.3);
        if (mediumFlightEstimate > 0) {
          transportEmissions += mediumFlightEstimate * mediumFlightFactor * data.avgFlightDistance * 2 * rfFactor / 1000;
        }
      }
      
      if (data.longFlights) {
        // Long-haul flight - more efficient per mile but longer distance, typical 2500+ miles
        let flightDistance = data.avgFlightDistance || 2500; // Default long flight distance if not provided
        if (flightDistance < 1000) flightDistance = 2500; // Override if user provided a short distance for long flights
        
        // Apply radiative forcing factor
        transportEmissions += data.longFlights * longFlightFactor * flightDistance * 2 * rfFactor / 1000; // Round trip
      }
    }
    
    // Secondary Flight emissions (when flight is not primary transport)
    if (data.primaryTransport !== 'flight') {
      if (data.shortFlights) {
        const shortFlightFactor = await storage.getEmissionFactor('flight', 'short');
        const rfFactor = await storage.getEmissionFactor('flight', 'rf_factor');
        // Use standard distance for short flights
        const shortFlightDistance = 500; // miles per short flight
        transportEmissions += data.shortFlights * shortFlightFactor * shortFlightDistance * 2 * rfFactor / 1000; // Round trip, convert to tonnes CO2e
      }
      
      if (data.longFlights) {
        const longFlightFactor = await storage.getEmissionFactor('flight', 'long');
        const rfFactor = await storage.getEmissionFactor('flight', 'rf_factor');
        // Use standard distance for long flights
        const longFlightDistance = 2500; // miles per long flight
        transportEmissions += data.longFlights * longFlightFactor * longFlightDistance * 2 * rfFactor / 1000; // Round trip, convert to tonnes CO2e
      }
    }
    
    // Food & consumption emissions - estimated based on household size and income
    let foodEmissions = 1.7; // Default average food emissions in tonnes CO2e
    
    if (data.householdSize) {
      foodEmissions = await storage.getEmissionFactor('food', 'average');
      
      // Adjust based on income if available
      if (data.incomeRange) {
        if (data.incomeRange === 'high') {
          foodEmissions *= 1.2; // 20% higher than average
        } else if (data.incomeRange === 'low') {
          foodEmissions *= 0.8; // 20% lower than average
        }
      }
    }
    
    // Calculate total emissions
    const totalEmissions = homeEmissions + transportEmissions + foodEmissions;
    
    // Return the results
    return {
      totalEmissions: parseFloat(totalEmissions.toFixed(1)),
      homeEmissions: parseFloat(homeEmissions.toFixed(1)),
      transportEmissions: parseFloat(transportEmissions.toFixed(1)),
      foodEmissions: parseFloat(foodEmissions.toFixed(1)),
    };
  }
  
  // Helper function to generate recommendations
  async function generateRecommendations(data: any) {
    // Simple recommendation generation based on the footprint data
    const recommendations = [];
    
    // Home energy recommendations
    if (data.homeEmissions > 2) {
      recommendations.push({
        id: "rec1",
        category: "home",
        title: "Optimize Home Heating & Cooling",
        description: "Installing a programmable thermostat and adjusting your temperature by just 1-2 degrees can save up to 10% on your annual energy bill and reduce emissions.",
        iconName: "home-smile-line",
        potentialReduction: 0.5
      });
    }
    
    if (!data.footprintData.renewableSources || !data.footprintData.renewableSources.includes('greenEnergy')) {
      recommendations.push({
        id: "rec2",
        category: "home",
        title: "Switch to Renewable Energy",
        description: "Many utility companies offer green energy options. Switching to a renewable energy plan could eliminate most of your electricity-related emissions.",
        iconName: "plug-line",
        potentialReduction: 1.2
      });
    }
    
    // Transportation recommendations
    if (data.footprintData.primaryTransport === 'car' && data.transportEmissions > 2) {
      recommendations.push({
        id: "rec3",
        category: "transport",
        title: "Consider Carpooling or Public Transit",
        description: "Based on your location and commute distance, carpooling with colleagues or taking public transit twice a week could significantly reduce your transportation emissions.",
        iconName: "car-line",
        potentialReduction: 0.7
      });
    }
    
    // Flight-specific recommendations - more detailed based on flight patterns
    if (data.footprintData.primaryTransport === 'flight') {
      recommendations.push({
        id: "rec3a",
        category: "transport",
        title: "Consider Alternative Transport Modes",
        description: "For domestic travel under 500 miles, trains or buses typically have 1/5 the carbon footprint of flying. For necessary flights, choose direct routes to reduce emissions by avoiding multiple takeoffs.",
        iconName: "train-line",
        potentialReduction: 1.5
      });
      
      // Add specific advice for frequent flyers
      if (data.footprintData.shortFlights > 5 || data.footprintData.longFlights > 2) {
        recommendations.push({
          id: "rec3b",
          category: "transport",
          title: "Consolidate Business Travel",
          description: "As a frequent flyer, consider consolidating business trips to reduce total flights. Each takeoff and landing contributes significantly to emissions, so fewer, longer trips are better than frequent short ones.",
          iconName: "briefcase-4-line",
          potentialReduction: 1.2
        });
      }
    }
    
    // Different recommendations based on flight patterns
    if (data.footprintData.longFlights > 0) {
      recommendations.push({
        id: "rec4a",
        category: "transport",
        title: "Offset Long-Haul Flight Emissions",
        description: "Long-haul flights contribute significantly to your carbon footprint. Consider high-quality carbon offsetting programs for essential travel, which fund renewable energy, forest conservation, or carbon capture projects.",
        iconName: "flight-takeoff-line",
        potentialReduction: 0.8
      });
    } else if (data.footprintData.shortFlights > 3) {
      recommendations.push({
        id: "rec4b",
        category: "transport",
        title: "Reduce Short-Haul Flights",
        description: "Short flights are actually less efficient per mile than longer ones because takeoff requires significant fuel. Consider trains, buses or carpooling for shorter trips under 500 miles when possible.",
        iconName: "road-map-line",
        potentialReduction: 0.6
      });
    }
    
    // Food & consumption recommendations
    recommendations.push({
      id: "rec5",
      category: "food",
      title: "Reduce Food Waste",
      description: "Plan meals, store food properly, and compost scraps to reduce the emissions associated with food production and waste.",
      iconName: "restaurant-line",
      potentialReduction: 0.3
    });
    
    if (data.foodEmissions > 1.5) {
      recommendations.push({
        id: "rec6",
        category: "food",
        title: "Adopt a Plant-Rich Diet",
        description: "Reducing meat consumption, especially beef and lamb, can significantly lower your dietary carbon footprint.",
        iconName: "plant-line",
        potentialReduction: 0.5
      });
    }
    
    return recommendations;
  }
  
  // Route to get all countries for location selection
  apiRouter.get("/countries", async (req, res) => {
    try {
      const countries = await storage.getAllCountries();
      res.status(200).json({ countries });
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });
  
  // Route to get a specific country by code
  apiRouter.get("/countries/:code", async (req, res) => {
    try {
      const country = await storage.getCountryByCode(req.params.code);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.status(200).json({ country });
    } catch (error) {
      console.error("Error fetching country:", error);
      res.status(500).json({ message: "Failed to fetch country" });
    }
  });
  
  // Route to submit training data for improving calculations
  apiRouter.post("/training-data", async (req, res) => {
    try {
      if (!req.body.inputData || !req.body.countryCode) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const trainingData = await storage.saveTrainingData(
        req.body.inputData,
        req.body.countryCode,
        req.body.footprintId
      );
      
      res.status(201).json({ message: "Training data submitted successfully", id: trainingData.id });
    } catch (error) {
      console.error("Error submitting training data:", error);
      res.status(500).json({ message: "Failed to submit training data" });
    }
  });
  
  // Route to update footprint results after calculation
  apiRouter.put("/footprints/:id", async (req, res) => {
    try {
      const footprintId = parseInt(req.params.id);
      
      if (isNaN(footprintId)) {
        return res.status(400).json({ message: "Invalid footprint ID" });
      }
      
      const { totalEmissions, homeEmissions, transportEmissions, foodEmissions, recommendations } = req.body;
      
      if (totalEmissions === undefined || homeEmissions === undefined || 
          transportEmissions === undefined || foodEmissions === undefined) {
        return res.status(400).json({ message: "Missing required emission values" });
      }
      
      const updatedFootprint = await storage.updateFootprintResults(
        footprintId,
        totalEmissions,
        homeEmissions,
        transportEmissions,
        foodEmissions,
        recommendations
      );
      
      res.status(200).json({ message: "Footprint updated successfully", footprint: updatedFootprint });
    } catch (error) {
      console.error("Error updating footprint:", error);
      res.status(500).json({ message: "Failed to update footprint" });
    }
  });
  
  // Register API routes
  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  return httpServer;
}
