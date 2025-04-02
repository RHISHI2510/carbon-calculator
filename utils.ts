import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals = 1): string {
  return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatCO2(value: number): string {
  return `${formatNumber(value)} tonnes CO₂e`;
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function getComparisonToAverage(total: number, location: string): { value: number; isBetter: boolean } {
  // Average values by country (tonnes CO2e per person per year)
  const averages: Record<string, number> = {
    us: 16.0,
    uk: 10.0,
    ca: 14.2,
    au: 15.5,
    in: 1.9, // India has one of the lowest per-capita carbon footprints globally
    global: 12.0,
  };
  
  const average = averages[location] || averages.global;
  const difference = average - total;
  const percentDifference = Math.round((difference / average) * 100);
  
  return {
    value: Math.abs(percentDifference),
    isBetter: difference > 0
  };
}

export function getCarbonBudget(total: number): number {
  // Global per-person carbon budget to stay within 1.5°C warming is ~2.5 tonnes per year
  const budget = 2.5;
  const percentage = Math.min(Math.round((total / budget) * 100), 100);
  return percentage;
}

export function getIconForCategory(category: string): string {
  switch (category) {
    case 'home':
      return 'home-smile-line';
    case 'transport':
      return 'car-line';
    case 'food':
      return 'restaurant-line';
    default:
      return 'leaf-line';
  }
}

export function getColorForCategory(category: string): string {
  switch (category) {
    case 'home':
      return 'primary';
    case 'transport':
      return 'secondary';
    case 'food':
      return 'accent';
    default:
      return 'neutral';
  }
}

import { BASE_INCOME_RANGES, CURRENCY_BY_LOCATION } from './constants';

export function getLocationBasedIncomeRanges(location: string = 'us') {
  const currencyInfo = CURRENCY_BY_LOCATION[location as keyof typeof CURRENCY_BY_LOCATION] || CURRENCY_BY_LOCATION.other;
  const { symbol, rate } = currencyInfo;
  
  // Format a number to show with thousands separator and no decimal places
  const formatCurrency = (value: number): string => {
    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Convert USD to local currency with proper formatting
  const toLocalCurrency = (valueUSD: number): string => {
    return `${symbol}${formatCurrency(valueUSD * rate)}`;
  };
  
  // Generate the income ranges based on the currency conversion
  return [
    { value: "low", label: `Below ${toLocalCurrency(BASE_INCOME_RANGES[0].threshold)}` },
    { 
      value: "medium-low", 
      label: `${toLocalCurrency(BASE_INCOME_RANGES[0].threshold)} - ${toLocalCurrency(BASE_INCOME_RANGES[1].threshold)}` 
    },
    { 
      value: "medium", 
      label: `${toLocalCurrency(BASE_INCOME_RANGES[1].threshold)} - ${toLocalCurrency(BASE_INCOME_RANGES[2].threshold)}` 
    },
    { 
      value: "medium-high", 
      label: `${toLocalCurrency(BASE_INCOME_RANGES[2].threshold)} - ${toLocalCurrency(BASE_INCOME_RANGES[3].threshold)}` 
    },
    { value: "high", label: `Above ${toLocalCurrency(BASE_INCOME_RANGES[3].threshold)}` },
    { value: "prefer-not", label: "Prefer not to say" }
  ];
}
