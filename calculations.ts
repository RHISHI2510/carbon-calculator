import type { CalculatorFormType } from "@shared/schema";
import { apiRequest } from "./queryClient";

// Interface for calculation results
export interface FootprintResults {
  totalEmissions: number;
  homeEmissions: number;
  transportEmissions: number;
  foodEmissions: number;
}

// Default results object
export const DEFAULT_RESULTS: FootprintResults = {
  totalEmissions: 0,
  homeEmissions: 0,
  transportEmissions: 0,
  foodEmissions: 0
};

// Function to calculate carbon footprint by making API request
export async function calculateFootprint(formData: CalculatorFormType): Promise<FootprintResults> {
  try {
    // Convert form data to the expected format for the API
    const requestData = {
      ...formData,
      householdSize: Number(formData.householdSize || 1),
      homeSize: Number(formData.homeSize || 0),
      electricityUsage: Number(formData.electricityUsage || 0),
      gasUsage: Number(formData.gasUsage || 0),
      fuelEfficiency: Number(formData.fuelEfficiency || 0),
      annualMileage: Number(formData.annualMileage || 0),
      weeklyBusRides: Number(formData.weeklyBusRides || 0),
      avgCommuteDistance: Number(formData.avgCommuteDistance || 0),
      weeklyBikeMiles: Number(formData.weeklyBikeMiles || 0),
      weeklyWalkingMiles: Number(formData.weeklyWalkingMiles || 0),
      shortFlights: Number(formData.shortFlights || 0),
      longFlights: Number(formData.longFlights || 0),
      avgFlightDistance: Number(formData.avgFlightDistance || 0)
    };

    // Make the API request
    const response = await apiRequest("POST", "/api/calculate-footprint", requestData);
    const data = await response.json();

    return {
      totalEmissions: data.totalEmissions || 0,
      homeEmissions: data.homeEmissions || 0,
      transportEmissions: data.transportEmissions || 0,
      foodEmissions: data.foodEmissions || 0
    };
  } catch (error) {
    console.error("Error calculating footprint:", error);
    throw new Error("Failed to calculate carbon footprint");
  }
}
