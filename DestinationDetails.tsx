import { useState, useEffect } from 'react';
import { TravelInsights } from '../types';
import { DollarSign, Users, Calendar, Plane, Hotel, Check, Sparkles, AlertCircle } from 'lucide-react';

interface BudgetCalculatorProps {
  insights: TravelInsights;
}

// Helper to extract numbers from currency strings
function parsePrice(str: string, defaultVal: number): number {
  if (!str) return defaultVal;
  // Match all numbers in the string
  const matches = str.replace(/,/g, '').match(/\d+/g);
  if (!matches || matches.length === 0) return defaultVal;
  
  // If we have a range, average it
  if (matches.length >= 2) {
    const val1 = parseInt(matches[0], 10);
    const val2 = parseInt(matches[1], 10);
    return Math.round((val1 + val2) / 2);
  }
  
  return parseInt(matches[0], 10);
}

export default function BudgetCalculator({ insights }: BudgetCalculatorProps) {
  // Parse defaults from insights
  const defaultFlight = parsePrice(insights.flights.avgCostRange, 600);
  const defaultHotel = parsePrice(insights.hotels.avgCostPerNightRange, 100);
  const defaultDaily = parsePrice(insights.generalBudgetEstimate.totalDailyEstimatedBudget, 75);

  // Calculator State
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const [flightCost, setFlightCost] = useState(defaultFlight);
  const [hotelCost, setHotelCost] = useState(defaultHotel);
  const [dailySpending, setDailySpending] = useState(defaultDaily);
  const [targetBudget, setTargetBudget] = useState<number>(2000);
  
  // Selected tours for calculation
  const [selectedTours, setSelectedTours] = useState<boolean[]>([]);

  // Initialize/reset selections when insights change
  useEffect(() => {
    const flight = parsePrice(insights.flights.avgCostRange, 600);
    const hotel = parsePrice(insights.hotels.avgCostPerNightRange, 100);
    const daily = parsePrice(insights.generalBudgetEstimate.totalDailyEstimatedBudget, 75);

    setFlightCost(flight);
    setHotelCost(hotel);
    setDailySpending(daily);
    setSelectedTours(new Array(insights.tours.length).fill(true));

    // Dynamic initial target budget based on baseline flight and hotel costs
    const rooms = Math.ceil(2 / 2); // default 2 travelers
    const baseline = (flight * 2) + (hotel * rooms * 7); // default 7 days
    setTargetBudget(Math.max(1000, Math.round((baseline * 1.15) / 100) * 100));
  }, [insights]);

  const toggleTour = (index: number) => {
    const updated = [...selectedTours];
    updated[index] = !updated[index];
    setSelectedTours(updated);
  };

  // Calculate costs
  const roomsNeeded = Math.ceil(travelers / 2);
  const totalFlights = flightCost * travelers;
  const totalHotels = hotelCost * roomsNeeded * days;
  const totalDaily = dailySpending * travelers * days;
  
  // Sum up selected tours
  const totalTours = insights.tours.reduce((sum, tour, idx) => {
    if (selectedTours[idx]) {
      const tourPrice = parsePrice(tour.estimatedCost, 0);
      return sum + (tourPrice * travelers);
    }
    return sum;
  }, 0);

  const grandTotal = totalFlights + totalHotels + totalDaily + totalTours;
  const perPersonCost = Math.round(grandTotal / travelers);

  // Gemini suggested baseline calculations
  const suggestedFlightTotal = defaultFlight * travelers;
  const suggestedHotelTotal = defaultHotel * roomsNeeded * days;
  const suggestedBaseTotal = suggestedFlightTotal + suggestedHotelTotal;

  const isOverBudget = grandTotal > targetBudget;
  const budgetDifference = grandTotal - targetBudget;

  return (
    <div id="budget-calculator-container" className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-sans font-semibold text-base text-slate-800">Trip Budget Estimator</h3>
          <p className="text-xs text-slate-500">Estimate real costs & customize your stay</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Target Budget & AI Cost Benchmark Comparison Panel */}
        <div className="col-span-12 bg-white rounded-xl border border-indigo-100 p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-semibold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Target Budget Tracker & AI Benchmark
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Set your maximum target cost and compare it against Gemini-suggested averages for flights and hotels.
              </p>
            </div>

            {/* Input for target budget */}
            <div className="flex items-center gap-2.5">
              <label htmlFor="target-budget-input" className="text-xs font-bold text-slate-600 whitespace-nowrap">
                My Target Budget:
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 text-xs font-semibold">
                  $
                </span>
                <input
                  id="target-budget-input"
                  type="number"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-32 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg pl-6 pr-3 py-1.5 text-xs font-bold text-slate-850 focus:outline-hidden transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-100">
            {/* My Target Budget Card */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  My Target Goal
                </span>
                <span className="text-lg font-extrabold text-slate-800">${targetBudget.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-medium italic">
                {targetBudget > 0 ? "Manually defined limit" : "Enter target above"}
              </p>
            </div>

            {/* Gemini Suggested Baseline Flights & Hotels Card */}
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                    AI Base Suggested
                  </span>
                  <span className="text-[9px] bg-indigo-100/70 text-indigo-700 px-1.5 py-0.2 rounded font-bold uppercase tracking-wide">
                    Flights + Stay
                  </span>
                </div>
                <span className="text-lg font-extrabold text-indigo-950">${suggestedBaseTotal.toLocaleString()}</span>
              </div>
              
              <div className="text-[10px] text-slate-500 mt-2 flex flex-col gap-0.5">
                <div className="flex justify-between">
                  <span>Flights ({travelers}x avg):</span>
                  <span className="font-semibold text-slate-700">${suggestedFlightTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hotel ({days}d avg):</span>
                  <span className="font-semibold text-slate-700">${suggestedHotelTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Current Custom Total vs Target Budget Card */}
            <div className={`p-3 rounded-xl border flex flex-col justify-between ${
              isOverBudget 
                ? 'bg-rose-50/50 border-rose-250 text-rose-950' 
                : 'bg-emerald-50/50 border-emerald-250 text-emerald-950'
            }`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block">
                  Your Current Total
                </span>
                <span className="text-lg font-extrabold">${grandTotal.toLocaleString()}</span>
              </div>
              
              <div className="text-[10px] mt-2 font-bold flex items-center gap-1">
                {isOverBudget ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                    <span className="text-rose-700">Over target by ${budgetDifference.toLocaleString()}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-emerald-700">Under target by ${Math.abs(budgetDifference).toLocaleString()}!</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Progress Indicator Bars */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Visual Budget Benchmarks
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Bar 1: Your Customized Trip Cost */}
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span className="font-medium">Your Customized Total Cost</span>
                  <span className="font-bold text-slate-800">
                    ${grandTotal.toLocaleString()} / {targetBudget > 0 ? `$${targetBudget.toLocaleString()}` : '—'}
                  </span>
                </div>
                <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, targetBudget > 0 ? (grandTotal / targetBudget) * 100 : 100)}%` }}
                  />
                </div>
              </div>

              {/* Bar 2: Gemini suggested Flight + Hotel averages */}
              <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span className="font-medium">AI Suggested Flight + Stay Average</span>
                  <span className="font-bold text-slate-800">
                    ${suggestedBaseTotal.toLocaleString()} / {targetBudget > 0 ? `$${targetBudget.toLocaleString()}` : '—'}
                  </span>
                </div>
                <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${suggestedBaseTotal > targetBudget ? 'bg-amber-500' : 'bg-indigo-600'}`}
                    style={{ width: `${Math.min(100, targetBudget > 0 ? (suggestedBaseTotal / targetBudget) * 100 : 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Sliders and Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Travelers */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-2xs">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                Travelers
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-bold text-slate-800 w-8 text-right">
                  {travelers}
                </span>
              </div>
            </div>

            {/* Days */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-2xs">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Trip Duration
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-bold text-slate-800 w-8 text-right">
                  {days}d
                </span>
              </div>
            </div>
          </div>

          {/* Cost Estimates Inputs */}
          <div className="space-y-3">
            {/* Flight price input */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-slate-400" />
                  Flight (Per Person)
                </span>
                <span className="text-xs text-indigo-600 font-medium">Est: {insights.flights.avgCostRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  value={flightCost}
                  onChange={(e) => setFlightCost(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-800 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Hotel price input */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Hotel className="w-3.5 h-3.5 text-slate-400" />
                  Hotel (Per Night)
                </span>
                <span className="text-xs text-indigo-600 font-medium">Est: {insights.hotels.avgCostPerNightRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  value={hotelCost}
                  onChange={(e) => setHotelCost(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-800 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 italic">
                Booking {roomsNeeded} room{roomsNeeded > 1 ? 's' : ''} based on {travelers} traveler{travelers > 1 ? 's' : ''}.
              </p>
            </div>

            {/* Daily spending per person input */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  Daily Spending (Per Person)
                </span>
                <span className="text-xs text-indigo-600 font-medium">Est: {insights.generalBudgetEstimate.totalDailyEstimatedBudget}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  value={dailySpending}
                  onChange={(e) => setDailySpending(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-800 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">
                Covers food, local transport, souvenirs, and miscellaneous costs.
              </p>
            </div>
          </div>

          {/* Tours Selector Checkboxes */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
              Include Tours & Activities
            </span>
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {insights.tours.map((tour, idx) => {
                const checked = selectedTours[idx] ?? false;
                return (
                  <label
                    key={tour.name}
                    className={`flex items-start gap-3 p-2 rounded-lg border transition-colors cursor-pointer text-xs ${
                      checked
                        ? 'bg-indigo-50/50 border-indigo-100 text-slate-800'
                        : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTour(idx)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      checked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold truncate">{tour.name}</span>
                        <span className="font-bold text-slate-700 flex-shrink-0">{tour.estimatedCost}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">
                        {tour.category} • {tour.duration}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cost Summary Card */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-slate-900 rounded-2xl p-6 text-white h-full flex flex-col justify-between shadow-lg shadow-slate-950/15">
            <div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Estimated Trip Total
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  {travelers} Person{travelers > 1 ? 's' : ''}, {days} Days
                </span>
              </div>

              {/* Total Cost Display */}
              <div className="mb-6">
                <div className="text-4xl font-extrabold tracking-tight flex items-baseline">
                  <span className="text-2xl text-slate-400 font-medium">$</span>
                  <span>{grandTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  ~${perPersonCost.toLocaleString()} per person
                </p>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-xs">
                {/* Flights */}
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    Flights ({travelers}x)
                  </span>
                  <span className="font-mono font-medium">${totalFlights.toLocaleString()}</span>
                </div>

                {/* Hotel */}
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                    Accommodation ({roomsNeeded} rm • {days} nights)
                  </span>
                  <span className="font-mono font-medium">${totalHotels.toLocaleString()}</span>
                </div>

                {/* Daily Spending */}
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Daily Budget ({days}d • {travelers}x)
                  </span>
                  <span className="font-mono font-medium">${totalDaily.toLocaleString()}</span>
                </div>

                {/* Selected Tours */}
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Selected Activities
                  </span>
                  <span className="font-mono font-medium">${totalTours.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* AI Advisor Badge */}
            <div className="mt-8 pt-4 border-t border-slate-800">
              <div className="flex items-start gap-2.5 bg-slate-850 p-3 rounded-xl border border-slate-800/80">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  <span className="font-semibold text-white">Smart Tip: </span>
                  {grandTotal > 2000 ? (
                    <span>To trim your budget, focus on the accommodation budget. Lodging represents a large percentage of expenses for {days} days!</span>
                  ) : (
                    <span>This represents a very lean budget! Check out the lodging tips tab to save even more on stay costs.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
