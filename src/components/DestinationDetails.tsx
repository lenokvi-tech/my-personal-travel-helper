import React, { useState } from 'react';
import { TravelInsights } from '../types';
import BudgetCalculator from './BudgetCalculator';
import { 
  Calendar, 
  Plane, 
  Hotel, 
  Compass, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Tag, 
  Clock, 
  TrendingDown,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface DestinationDetailsProps {
  insights: TravelInsights;
}

type TabType = 'overview' | 'flights' | 'hotels' | 'tours' | 'budget';

export default function DestinationDetails({ insights }: DestinationDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const {
    destinationName,
    bestTimeToVisit,
    flights,
    hotels,
    tours,
    generalBudgetEstimate
  } = insights;

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'overview', 
      label: 'When to Go', 
      icon: <Calendar className="w-4 h-4" /> 
    },
    { 
      id: 'flights', 
      label: 'Flights', 
      icon: <Plane className="w-4 h-4" /> 
    },
    { 
      id: 'hotels', 
      label: 'Where to Stay', 
      icon: <Hotel className="w-4 h-4" /> 
    },
    { 
      id: 'tours', 
      label: 'Tours & Fun', 
      icon: <Compass className="w-4 h-4" /> 
    },
    { 
      id: 'budget', 
      label: 'Budget Estimator', 
      icon: <DollarSign className="w-4 h-4" /> 
    }
  ];

  return (
    <div id="destination-details-container" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated AI Itinerary & Insights</span>
          </div>
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-white mb-2">
            {destinationName}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-200">Daily Est:</span> {generalBudgetEstimate.totalDailyEstimatedBudget}/day
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 hidden md:inline" />
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-200">Best Season:</span> {bestTimeToVisit.months}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="flex border-b border-slate-150 overflow-x-auto scrollbar-none bg-slate-50/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-button-${tab.id}`}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        
        {/* TAB 1: OVERVIEW & BEST TIME */}
        {activeTab === 'overview' && (
          <div id="tab-content-overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Highlight Stats Card */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Optimal Travel Window
                  </span>
                  <h3 className="font-sans font-bold text-xl text-indigo-900 mb-2">
                    {bestTimeToVisit.months}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {bestTimeToVisit.weatherDescription}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-200/60">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Avg Temperature</span>
                    <span className="text-sm font-bold text-slate-800">{bestTimeToVisit.avgTemperature}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Crowd Density</span>
                    <span className={`text-sm font-bold ${
                      bestTimeToVisit.crowdLevel === 'High' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>{bestTimeToVisit.crowdLevel}</span>
                  </div>
                </div>
              </div>

              {/* Price level card */}
              <div className="bg-indigo-50/40 rounded-xl p-5 border border-indigo-100/50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-2">
                    Price Efficiency Index
                  </span>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-extrabold text-indigo-950">
                      {bestTimeToVisit.priceIndex} Season
                    </span>
                    <span className="text-xs text-indigo-600 font-medium">relative cost index</span>
                  </div>
                  <p className="text-sm text-indigo-950/70 leading-relaxed">
                    Traveling during these months offers the ultimate compromise between beautiful local weather conditions and pocket-friendly flight and hotel rates.
                  </p>
                </div>

                <div className="bg-white/80 border border-indigo-100 p-3 rounded-lg flex items-center gap-2 text-xs text-indigo-900 font-medium mt-4">
                  <TrendingDown className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Cost Estimations indicate this is the smartest seasonal sweet spot.</span>
                </div>
              </div>
            </div>

            {/* Pros and Cons lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Pros List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Why travel during this window
                </h4>
                <ul className="space-y-2">
                  {bestTimeToVisit.pros.map((pro, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-start gap-2.5">
                      <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  Drawbacks / What to watch out for
                </h4>
                <ul className="space-y-2">
                  {bestTimeToVisit.cons.map((con, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-start gap-2.5">
                      <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLIGHTS */}
        {activeTab === 'flights' && (
          <div id="tab-content-flights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Flight Cost Summary */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-center flex flex-col justify-center items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Est. Round-Trip Price
                </span>
                <span className="text-3xl font-extrabold text-indigo-950">
                  {flights.avgCostRange}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">per traveler</span>

                <div className="w-full border-t border-slate-200 my-4 pt-3">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">Best Months to Reserve</span>
                  <span className="text-sm font-bold text-slate-700">{flights.bestMonthsToBook}</span>
                </div>
              </div>

              {/* Flight Insights & Tips */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Recommended Airlines
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {flights.recommendedAirlines.map((airline) => (
                      <span
                        key={airline}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold"
                      >
                        {airline}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Flight Booking & Saving Tips
                  </h4>
                  <ul className="space-y-2.5">
                    {flights.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-500 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: HOTELS */}
        {activeTab === 'hotels' && (
          <div id="tab-content-hotels" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Hotel Cost and general tips column */}
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Est. Nightly Rate
                  </span>
                  <span className="text-3xl font-extrabold text-indigo-950">
                    {hotels.avgCostPerNightRange}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">budget to mid-range stays</span>
                </div>

                <div className="bg-white border border-slate-100 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Lodging Hacks
                  </h4>
                  <ul className="space-y-2">
                    {hotels.tips.map((tip, index) => (
                      <li key={index} className="text-xs text-slate-600 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Neighborhoods & Hotels columns */}
              <div className="md:col-span-2 space-y-5">
                {/* Recommended Neighborhoods */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Recommended Neighborhoods
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hotels.recommendedNeighborhoods.map((area) => (
                      <div
                        key={area.name}
                        className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/30 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                            {area.name}
                          </span>
                          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {area.priceLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {area.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specific Budget Hotel Suggestions */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Recommended Budget & Quality Stays
                  </h4>
                  <div className="space-y-2.5">
                    {hotels.budgetHotelSuggestions.map((hotel) => (
                      <div
                        key={hotel.name}
                        className="p-3 bg-white border border-slate-150 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-shadow"
                      >
                        <div>
                          <span className="text-xs font-semibold text-slate-800 block">
                            {hotel.name}
                          </span>
                          <span className="text-xs text-slate-500 font-sans mt-0.5 block">
                            {hotel.highlight}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg self-start sm:self-auto flex-shrink-0">
                          ~{hotel.estimatedPrice}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: TOURS */}
        {activeTab === 'tours' && (
          <div id="tab-content-tours" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Must-Do Tours & Local Activities
              </h3>
              <span className="text-xs text-indigo-600 font-medium">Curated by travel agents</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tours.map((tour) => (
                <div
                  key={tour.name}
                  className="bg-white border border-slate-100 p-4 rounded-xl shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                        {tour.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                        {tour.estimatedCost}
                      </span>
                    </div>

                    <h4 className="font-sans font-semibold text-sm text-slate-800 mb-1.5">
                      {tour.name}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      {tour.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {tour.duration}
                    </span>
                    <span className="italic text-indigo-600/80 font-medium max-w-[65%] truncate" title={tour.highlight}>
                      ★ {tour.highlight}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BUDGET PLANNER */}
        {activeTab === 'budget' && (
          <div id="tab-content-budget" className="space-y-4">
            <BudgetCalculator insights={insights} />
          </div>
        )}

      </div>
    </div>
  );
}
