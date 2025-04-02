export const COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "in", label: "India" },
  { value: "other", label: "Other" }
];

export const HOUSEHOLD_SIZES = [
  { value: "1", label: "1 person" },
  { value: "2", label: "2 people" },
  { value: "3", label: "3 people" },
  { value: "4", label: "4 people" },
  { value: "5+", label: "5+ people" }
];

// Maps location codes to currency symbols and approximate exchange rates
export const CURRENCY_BY_LOCATION = {
  us: { symbol: '$', rate: 1 },
  ca: { symbol: 'C$', rate: 1.35 },
  uk: { symbol: '£', rate: 0.78 },
  au: { symbol: 'A$', rate: 1.49 },
  in: { symbol: '₹', rate: 83.5 },
  other: { symbol: '$', rate: 1 }
};

// Base income ranges in USD that will be converted to local currency
export const BASE_INCOME_RANGES = [
  { value: "low", threshold: 30000 },
  { value: "medium-low", threshold: 60000 },
  { value: "medium", threshold: 100000 },
  { value: "medium-high", threshold: 150000 }
];

// The actual income ranges for UI will be dynamically generated based on location
export const INCOME_RANGES = [
  { value: "low", label: "Below $30,000" },
  { value: "medium-low", label: "$30,000 - $60,000" },
  { value: "medium", label: "$60,000 - $100,000" },
  { value: "medium-high", label: "$100,000 - $150,000" },
  { value: "high", label: "Above $150,000" },
  { value: "prefer-not", label: "Prefer not to say" }
];

export const HOME_TYPES = [
  { id: "apartment", label: "Apartment", icon: "building-4-line" },
  { id: "house", label: "House", icon: "home-4-line" },
  { id: "other", label: "Other", icon: "building-2-line" }
];

export const TRANSPORT_TYPES = [
  { id: "car", label: "Car", icon: "car-line" },
  { id: "publicTransport", label: "Public Transit", icon: "bus-line" },
  { id: "bike", label: "Bicycle", icon: "bike-line" },
  { id: "walking", label: "Walking", icon: "walk-line" },
  { id: "flight", label: "Flight", icon: "flight-takeoff-line" }
];

export const CAR_TYPES = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV/Crossover" },
  { value: "truck", label: "Truck" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" }
];

export const RENEWABLE_SOURCES = [
  { value: "solar", label: "Solar Panels" },
  { value: "wind", label: "Wind Power" },
  { value: "greenEnergy", label: "Green Energy Provider" }
];

export const CALCULATOR_STEPS = [
  { id: 1, title: "Profile" },
  { id: 2, title: "Home" },
  { id: 3, title: "Transport" },
  { id: 4, title: "Results" }
];

export const DEFAULT_FORM_VALUES = {
  calculationType: "individual" as "individual" | "business",
  location: "",
  householdSize: 1,
  incomeRange: "",
  homeType: "apartment",
  homeSize: 0,
  homeUnit: "sqft" as "sqft" | "sqm",
  electricityUsage: 0,
  gasUsage: 0,
  renewableSources: [],
  primaryTransport: "car",
  // Car specific fields
  carType: "sedan",
  fuelEfficiency: 0,
  annualMileage: 12000,
  // Public transit specific fields
  weeklyBusRides: 0,
  avgCommuteDistance: 0,
  // Bicycle specific fields
  weeklyBikeMiles: 0,
  // Walking specific fields
  weeklyWalkingMiles: 0,
  // Flight specific fields
  shortFlights: 0,
  longFlights: 0,
  avgFlightDistance: 1000 // Default average flight distance in miles
};
