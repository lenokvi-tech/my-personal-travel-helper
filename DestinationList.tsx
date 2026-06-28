import React, { useState, useEffect } from 'react';
import { DreamDestination, TravelInsights } from './types';
import AddDestinationForm from './components/AddDestinationForm';
import DestinationList from './components/DestinationList';
import DestinationDetails from './components/DestinationDetails';
import { 
  Compass, 
  MapPin, 
  Plane, 
  Hotel, 
  Info, 
  Sparkles, 
  Globe2, 
  AlertTriangle,
  FileText
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'personal_travel_helper_destinations';

// Some cool default suggestions to populate the app if empty so it looks full & stunning on first load!
const DEFAULT_DESTINATIONS: DreamDestination[] = [
  {
    id: 'kyoto-default',
    name: 'Kyoto, Japan',
    notes: 'Keen to experience historic temples, cherry blossoms, and incredible street food.',
    addedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    status: 'pending',
  },
  {
    id: 'reykjavik-default',
    name: 'Reykjavik, Iceland',
    notes: 'Hoping to see the Northern Lights and soak in the Blue Lagoon.',
    addedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    status: 'pending',
  }
];

export default function App() {
  const [destinations, setDestinations] = useState<DreamDestination[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false);
  const [systemError, setSystemError] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DreamDestination[];
        setDestinations(parsed);
        if (parsed.length > 0) {
          setSelectedId(parsed[0].id);
        }
      } else {
        setDestinations(DEFAULT_DESTINATIONS);
        setSelectedId(DEFAULT_DESTINATIONS[0].id);
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
      setDestinations(DEFAULT_DESTINATIONS);
      setSelectedId(DEFAULT_DESTINATIONS[0].id);
    }
  }, []);

  // Save to local storage
  const saveDestinations = (updated: DreamDestination[]) => {
    setDestinations(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Error writing to localStorage", e);
    }
  };

  const handleAddDestination = (name: string, notes?: string) => {
    const newDest: DreamDestination = {
      id: `dest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      notes,
      addedAt: new Date().toISOString(),
      status: 'pending',
    };
    const updated = [newDest, ...destinations];
    saveDestinations(updated);
    setSelectedId(newDest.id);
    setSystemError(null);
  };

  const handleDeleteDestination = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = destinations.filter(d => d.id !== id);
    saveDestinations(updated);
    if (selectedId === id) {
      setSelectedId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleGetInsights = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const targetIndex = destinations.findIndex(d => d.id === id);
    if (targetIndex === -1) return;

    const dest = destinations[targetIndex];
    setSystemError(null);

    // Update state to loading
    const updatedLoading = [...destinations];
    updatedLoading[targetIndex] = {
      ...dest,
      status: 'loading',
      errorMessage: undefined
    };
    saveDestinations(updatedLoading);

    try {
      const response = await fetch('/api/travel-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination: dest.name }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error status ${response.status}`);
      }

      const insightsData = await response.json() as TravelInsights;

      const updatedCompleted = [...destinations];
      updatedCompleted[targetIndex] = {
        ...dest,
        insights: insightsData,
        status: 'completed',
        errorMessage: undefined
      };
      saveDestinations(updatedCompleted);
    } catch (err: any) {
      console.error("Failed to fetch travel insights:", err);
      const updatedError = [...destinations];
      updatedError[targetIndex] = {
        ...dest,
        status: 'error',
        errorMessage: err.message || 'An error occurred while generating insights.'
      };
      saveDestinations(updatedError);
      
      // If the error looks API key related, set a system error tip
      if (err.message?.includes('GEMINI_API_KEY') || err.message?.includes('API key')) {
        setSystemError("Gemini API Key is missing or invalid. Please check your AI Studio secrets setting to provide your API key.");
      }
    }
  };

  const handleSelectDestination = (id: string) => {
    setSelectedId(id);
    setSystemError(null);
  };

  const selectedDest = destinations.find(d => d.id === selectedId);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col antialiased">
      {/* Top Header Navigation */}
      <header id="app-header" className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/25">
              <Globe2 className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="font-sans font-extrabold text-base text-slate-800 leading-none flex items-center gap-1.5">
                My Personal Travel Helper
              </h1>
              <p className="text-xs text-slate-500 mt-1">Smart flight, hotel, and tour planner powered by Gemini AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AI Assistant Ready
            </span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* System Error Banner */}
        {systemError && (
          <div id="system-error-banner" className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <span className="font-bold">Important Notice:</span> {systemError}
              <p className="mt-1 text-xs text-amber-700">
                You can add and manage destinations in your browser locally, but to retrieve real AI-powered travel costs, hotel regions, and optimal tour packages, you must set your <code className="bg-amber-100 px-1 rounded font-mono font-semibold">GEMINI_API_KEY</code> secret via the sidebar panel.
              </p>
            </div>
          </div>
        )}

        {/* Dual Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Inputs and list of items (5 Columns) */}
          <section className="lg:col-span-5 space-y-6">
            <AddDestinationForm 
              onAdd={handleAddDestination} 
              isAdding={loadingInsights} 
            />

            <DestinationList
              destinations={destinations}
              selectedId={selectedId}
              onSelect={handleSelectDestination}
              onDelete={handleDeleteDestination}
              onGetInsights={handleGetInsights}
            />
          </section>

          {/* Right Panel: Selected Destination Insights & Calculator (7 Columns) */}
          <section className="lg:col-span-7">
            {selectedDest ? (
              <div id="details-section" className="space-y-6">
                
                {/* Pending or Error States */}
                {selectedDest.status === 'pending' && (
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-xs flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                      <Sparkles className="w-7 h-7 animate-bounce" />
                    </div>
                    <h3 className="font-sans font-bold text-slate-800 text-lg mb-2">
                      Ready to analyze {selectedDest.name}?
                    </h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                      Click the "Analyze & Find Travel Deals" button below. Gemini will scan real-time estimates to deliver the cheapest months to visit, flight deals, hotel districts, and top tours.
                    </p>
                    <button
                      id={`btn-analyze-large-${selectedDest.id}`}
                      onClick={() => handleGetInsights(selectedDest.id)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                    >
                      <Sparkles className="w-4.5 h-4.5" />
                      <span>Analyze & Find Travel Deals</span>
                    </button>
                  </div>
                )}

                {selectedDest.status === 'loading' && (
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-xs flex flex-col items-center justify-center min-h-[400px]">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Compass className="w-6 h-6 text-indigo-600 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="font-sans font-bold text-slate-800 text-lg mb-1">
                      Consulting Local Travel Experts...
                    </h3>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto mb-4">
                      Calculating standard flight ranges, finding budget hotels, mapping neighborhoods, and planning best tours for <span className="font-semibold text-slate-700">{selectedDest.name}</span>.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-100">
                      <span className="flex items-center gap-1">
                        <Plane className="w-3.5 h-3.5 text-indigo-400" /> Flights
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <Hotel className="w-3.5 h-3.5 text-indigo-400" /> Lodging
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-indigo-400" /> Top Tours
                      </span>
                    </div>
                  </div>
                )}

                {selectedDest.status === 'error' && (
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-xs flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <h3 className="font-sans font-bold text-slate-800 text-lg mb-2">
                      Analysis Failed
                    </h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                      {selectedDest.errorMessage || "We ran into an unexpected issue while planning your stay. Please try again."}
                    </p>
                    <button
                      id={`btn-retry-large-${selectedDest.id}`}
                      onClick={() => handleGetInsights(selectedDest.id)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                    >
                      <Sparkles className="w-4.5 h-4.5" />
                      <span>Retry Analysis</span>
                    </button>
                  </div>
                )}

                {/* Successful Loaded State */}
                {selectedDest.status === 'completed' && selectedDest.insights && (
                  <DestinationDetails insights={selectedDest.insights} />
                )}

              </div>
            ) : (
              <div id="no-selection-placeholder" className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-xs flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-14 h-14 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mb-4">
                  <Globe2 className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="font-sans font-bold text-slate-700 text-base mb-1.5">No Destination Selected</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Add your custom dream destinations on the left, or select one from the list to display flight, hotel, and tour recommendations instantly.
                </p>
              </div>
            )}
          </section>

        </div>
      </main>

      {/* Footer info */}
      <footer className="mt-auto py-8 bg-white border-t border-slate-100 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 My Personal Travel Helper. Powered securely by Gemini 3.5 Flash.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Secure Server Proxy</span>
            <span>•</span>
            <span>No Cookies Tracked</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
