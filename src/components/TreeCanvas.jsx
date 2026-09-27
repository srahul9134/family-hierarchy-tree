import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { TreeBranchConnector } from './TreeBranchConnector';

export const TreeCanvas = ({
  treeData,
  selectedMemberId,
  highlightedIds = [],
  onSelect,
  onAddChild,
  onAddSpouse,
  onEdit,
  onDelete,
  onToggleCollapse,
  onAddRootParent,
  panZoom,
  exportRef,
}) => {
  const {
    scale,
    position,
    isDragging,
    containerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    fitToScreen,
  } = panZoom;

  // Auto-fit when treeData loads or structure updates
  useEffect(() => {
    fitToScreen();
  }, [treeData?.id, fitToScreen]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`
        relative w-full h-full overflow-hidden bg-grid-pattern select-none touch-none flex items-start justify-center
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
      `}
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 50% 15%, rgba(99, 102, 241, 0.15) 0%, transparent 70%),
          linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 36px 36px, 36px 36px',
        overscrollBehavior: 'none',
        touchAction: 'none',
      }}
    >
      {/* Subtle floating ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />

      {/* Canvas World Transform Container with Centered Origin */}
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'top center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
        className="inline-flex flex-col items-center justify-start p-6 sm:p-12"
      >
        {/* Export capture container */}
        <div 
          ref={exportRef} 
          id="tree-export-root"
          className="p-4 sm:p-8 rounded-3xl flex flex-col items-center"
        >
          {/* Add Ancestor / Parent above the Root button */}
          <div className="mb-3 sm:mb-5 flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddRootParent}
              className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-900/95 hover:bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 text-[11px] sm:text-xs font-medium flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all hover:border-indigo-400 no-pan"
              title="Add a father/mother ancestor above this current root"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add Earlier Ancestor</span>
            </motion.button>
            <div className="w-0.5 h-3 sm:h-4 bg-indigo-500/40" />
          </div>

          {/* Root Tree */}
          {treeData ? (
            <TreeBranchConnector
              node={treeData}
              depth={0}
              selectedMemberId={selectedMemberId}
              highlightedIds={highlightedIds}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onAddSpouse={onAddSpouse}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleCollapse={onToggleCollapse}
            />
          ) : (
            <div className="text-center py-20 text-slate-400">
              <p className="text-base sm:text-lg">No family tree data available.</p>
              <button
                onClick={onAddRootParent}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm"
              >
                Create Root Member
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
