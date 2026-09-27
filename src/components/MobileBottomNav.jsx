import React from 'react';
import { GitFork, ListTree, Plus, BarChart3, Download } from 'lucide-react';

export const MobileBottomNav = ({
  viewMode,
  setViewMode,
  onOpenAddModal,
  onOpenStats,
  onOpenExport,
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around shadow-2xl safe-bottom">
      {/* Tree Canvas View Tab */}
      <button
        onClick={() => setViewMode('canvas')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
          viewMode === 'canvas'
            ? 'text-indigo-400 bg-indigo-500/15'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <GitFork className="w-5 h-5 rotate-180" />
        <span className="text-[10px] font-medium">Tree View</span>
      </button>

      {/* Outline List View Tab */}
      <button
        onClick={() => setViewMode('outline')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
          viewMode === 'outline'
            ? 'text-indigo-400 bg-indigo-500/15'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <ListTree className="w-5 h-5" />
        <span className="text-[10px] font-medium">List View</span>
      </button>

      {/* Quick Add Button (Center FAB) */}
      <button
        onClick={onOpenAddModal}
        className="w-11 h-11 -mt-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 border-2 border-slate-900 active:scale-95 transition-transform"
        title="Add Family Member"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Analytics Tab */}
      <button
        onClick={onOpenStats}
        className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
      >
        <BarChart3 className="w-5 h-5 text-purple-400" />
        <span className="text-[10px] font-medium">Analytics</span>
      </button>

      {/* Export / Backup Tab */}
      <button
        onClick={onOpenExport}
        className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
      >
        <Download className="w-5 h-5 text-emerald-400" />
        <span className="text-[10px] font-medium">Export</span>
      </button>
    </div>
  );
};
