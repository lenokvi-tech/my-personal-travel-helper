import React from 'react';
import { DreamDestination } from '../types';
import { motion } from 'motion/react';
import { Trash2, Sparkles, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface DestinationListProps {
  destinations: DreamDestination[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onGetInsights: (id: string, e: React.MouseEvent) => void;
}

export default function DestinationList({
  destinations,
  selectedId,
  onSelect,
  onDelete,
  onGetInsights,
}: DestinationListProps) {
  if (destinations.length === 0) {
    return (
      <div id="empty-list-placeholder" className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-5 h-5 text-slate-400" />
        </div>
        <h3 className="font-sans font-medium text-slate-700 text-sm mb-1">Your dream list is empty</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Add some dream destinations above or tap one of the quick recommendation tags to start planning!
        </p>
      </div>
    );
  }

  return (
    <div id="destination-list" className="space-y-3">
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Dream List ({destinations.length})
        </h3>
        <span className="text-[10px] text-slate-400">Click to view details</span>
      </div>

      {destinations.map((dest, index) => {
        const isSelected = selectedId === dest.id;
        const hasInsights = dest.status === 'completed';
        const isLoading = dest.status === 'loading';
        const isError = dest.status === 'error';

        return (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            id={`destination-card-${dest.id}`}
            onClick={() => onSelect(dest.id)}
            className={`group relative rounded-xl border p-4 transition-all cursor-pointer select-none ${
              isSelected
                ? 'bg-indigo-50/75 border-indigo-200 shadow-sm shadow-indigo-100'
                : 'bg-white hover:bg-slate-50/80 border-slate-100 shadow-xs'
            }`}
          >
            {/* Top Row with status & name */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <h4 className={`font-sans font-medium text-sm truncate ${
                  isSelected ? 'text-indigo-900' : 'text-slate-800'
                }`}>
                  {dest.name}
                </h4>
                {dest.notes && (
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-sans italic">
                    "{dest.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Status indicator */}
                {isLoading && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    Analyzing
                  </span>
                )}
                {hasInsights && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <CheckCircle className="w-3 h-3" />
                    Ready
                  </span>
                )}
                {isError && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-rose-50 text-rose-600 border border-rose-100">
                    <AlertTriangle className="w-3 h-3" />
                    Failed
                  </span>
                )}
                {!isLoading && !hasInsights && !isError && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-150">
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">
                Added {new Date(dest.addedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>

              <div className="flex items-center gap-1">
                {/* Find Insights Button */}
                {!hasInsights && !isLoading && (
                  <button
                    id={`btn-get-insights-${dest.id}`}
                    type="button"
                    onClick={(e) => onGetInsights(dest.id, e)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Get Insights</span>
                  </button>
                )}

                {hasInsights && !isLoading && (
                  <button
                    id={`btn-reanalyze-${dest.id}`}
                    type="button"
                    onClick={(e) => onGetInsights(dest.id, e)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Refresh</span>
                  </button>
                )}

                {isError && !isLoading && (
                  <button
                    id={`btn-retry-${dest.id}`}
                    type="button"
                    onClick={(e) => onGetInsights(dest.id, e)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                )}

                {/* Delete Button */}
                <button
                  id={`btn-delete-${dest.id}`}
                  type="button"
                  onClick={(e) => onDelete(dest.id, e)}
                  className="p-1 rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  title="Remove Destination"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Message Tooltip-style inline if exists */}
            {isError && dest.errorMessage && (
              <div className="mt-2 p-2 bg-rose-50 text-[11px] text-rose-600 rounded-lg border border-rose-100 font-sans">
                {dest.errorMessage}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
