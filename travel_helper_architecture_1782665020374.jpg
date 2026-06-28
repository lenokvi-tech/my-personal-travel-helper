export interface BudgetBreakdown {
  flights: number;
  hotels: number;
  tours: number;
  dailySpending: number;
  days: number;
}

export interface NeighborhoodSuggestion {
  name: string;
  description: string;
  priceLevel: string;
}

export interface HotelSuggestion {
  name: string;
  estimatedPrice: string;
  highlight: string;
}

export interface BestTimeToVisit {
  months: string;
  weatherDescription: string;
  avgTemperature: string;
  crowdLevel: 'Low' | 'Medium' | 'High' | string;
  priceIndex: 'Budget' | 'Moderate' | 'Expensive' | string;
  pros: string[];
  cons: string[];
}

export interface FlightInsights {
  avgCostRange: string;
  bestMonthsToBook: string;
  recommendedAirlines: string[];
  tips: string[];
}

export interface HotelInsights {
  avgCostPerNightRange: string;
  recommendedNeighborhoods: NeighborhoodSuggestion[];
  budgetHotelSuggestions: HotelSuggestion[];
  tips: string[];
}

export interface TourSuggestion {
  name: string;
  category: 'Sightseeing' | 'Adventure' | 'Food & Culture' | 'Nature' | string;
  estimatedCost: string;
  duration: string;
  description: string;
  highlight: string;
}

export interface TravelInsights {
  destinationName: string;
  bestTimeToVisit: BestTimeToVisit;
  flights: FlightInsights;
  hotels: HotelInsights;
  tours: TourSuggestion[];
  generalBudgetEstimate: {
    totalDailyEstimatedBudget: string;
    costBreakdownText: string;
  };
}

export interface DreamDestination {
  id: string;
  name: string;
  notes?: string;
  addedAt: string;
  insights?: TravelInsights;
  status: 'pending' | 'loading' | 'completed' | 'error';
  errorMessage?: string;
}
