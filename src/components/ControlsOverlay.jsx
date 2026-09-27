import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronDownSquare, 
  ChevronUpSquare, 
  Undo2,
  Maximize2
} from 'lucide-react';

export const ControlsOverlay = ({
  panZoom,
  onExpandAll,
  onCollapseAll,
  onUndo,
  canUndo,
}) => {
  const { scale, zoomIn, zoomOut, resetView, fitToScreen } = panZoom;

  return (
    <>
      {/* Floating Canvas Action Dock (Bottom Right) */}
      <div className="absolute bottom-4 sm:bottom-6 right-3 sm:right-6 z-30 flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl no-pan">
        {/* Undo button */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Undo last change"
        >
          <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <div className="w-px h-4 sm:h-5 bg-slate-800 my-auto" />

        {/* Fit to screen */}
        <button
          onClick={fitToScreen}
          className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Fit to screen"
        >
          <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
        </button>

        {/* Expand All */}
        <button
          onClick={onExpandAll}
          className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Expand all branches"
        >
          <ChevronDownSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
        </button>

        {/* Collapse All */}
        <button
          onClick={onCollapseAll}
          className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Collapse all branches"
        >
          <ChevronUpSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
        </button>

        <div className="w-px h-4 sm:h-5 bg-slate-800 my-auto" />

        {/* Zoom Out */}
        <button
          onClick={zoomOut}
          className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Zoom Level Indicator & Reset */}
        <button
          onClick={resetView}
          className="px-1.5 sm:px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-semibold text-indigo-300 hover:bg-slate-800 transition-colors min-w-[42px] sm:min-w-[52px] text-center"
          title="Reset zoom to 100%"
        >
          {Math.round(scale * 100)}%
        </button>

        {/* Zoom In */}
        <button
          onClick={zoomIn}
          className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Interactive Helper Hint (Bottom Left) */}
      <div className="hidden md:flex absolute bottom-6 left-6 z-20 items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 backdrop-blur-md pointer-events-none shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Drag canvas to pan • Pinch / Scroll to zoom • Tap card for details</span>
      </div>
    </>
  );
};
