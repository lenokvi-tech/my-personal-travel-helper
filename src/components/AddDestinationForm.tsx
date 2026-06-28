import React, { useState } from 'react';
import { Plus, Compass, Sparkles } from 'lucide-react';

interface AddDestinationFormProps {
  onAdd: (name: string, notes?: string) => void;
  isAdding: boolean;
}

const POPULAR_SUGGESTIONS = [
  { name: 'Kyoto, Japan', category: 'Culture' },
  { name: 'Reykjavik, Iceland', category: 'Adventure' },
  { name: 'Rome, Italy', category: 'History' },
  { name: 'Machu Picchu, Peru', category: 'Wonders' },
  { name: 'Bali, Indonesia', category: 'Relax' },
  { name: 'Cape Town, South Africa', category: 'Nature' },
];

export default function AddDestinationForm({ onAdd, isAdding }: AddDestinationFormProps) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), notes.trim() || undefined);
    setName('');
    setNotes('');
  };

  return (
    <div id="add-destination-section" className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Compass className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="font-sans font-semibold text-lg text-slate-800">Add Dream Destination</h2>
          <p className="text-xs text-slate-500">Where is your heart pointing next?</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="destination-name" className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
            Destination Name
          </label>
          <input
            id="destination-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Santorini, Greece or Kyoto, Japan"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 hover:bg-slate-50 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="destination-notes" className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
            Personal Notes <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            id="destination-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Celebratory trip, honeymoon, or solo food tour ideas..."
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 hover:bg-slate-50 transition-colors resize-none"
          />
        </div>

        <button
          id="btn-add-destination"
          type="submit"
          disabled={isAdding || !name.trim()}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-medium text-sm transition-all shadow-sm shadow-indigo-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Adding Destination...' : 'Add to Dream List'}</span>
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-400 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Quick Recommendations
        </p>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.name}
              type="button"
              onClick={() => {
                onAdd(suggestion.name, `Exploring ${suggestion.category} and highlights!`);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-xs text-slate-600 border border-slate-100 transition-colors font-medium flex items-center gap-1"
            >
              <span>{suggestion.name}</span>
              <span className="text-[10px] bg-slate-200/50 hover:bg-indigo-200/50 text-slate-500 px-1 rounded">
                {suggestion.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
