import type { Recommendation, RecommendationRequest } from "@shared/schema";
import { apiRequest } from "./queryClient";

// Function to get AI-powered recommendations
export async function getRecommendations(data: RecommendationRequest): Promise<Recommendation[]> {
  try {
    const response = await apiRequest("POST", "/api/recommendations", data);
    const result = await response.json();
    
    return result.recommendations || [];
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return [];
  }
}
