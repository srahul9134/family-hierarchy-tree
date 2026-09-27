import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreeNode } from './TreeNode';

export const TreeBranchConnector = ({
  node,
  depth = 0,
  selectedMemberId,
  highlightedIds = [],
  onSelect,
  onAddChild,
  onAddSpouse,
  onEdit,
  onDelete,
  onToggleCollapse,
  orientation = 'vertical',
}) => {
  if (!node) return null;

  const hasChildren = node.children && node.children.length > 0;
  const isCollapsed = Boolean(node.collapsed);
  const isSelected = selectedMemberId === node.id;
  const isHighlighted = highlightedIds.includes(node.id);

  return (
    <div className="flex flex-col items-center">
      {/* Current Node */}
      <TreeNode
        node={node}
        depth={depth}
        isSelected={isSelected}
        isHighlighted={isHighlighted}
        onSelect={onSelect}
        onAddChild={onAddChild}
        onAddSpouse={onAddSpouse}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleCollapse={onToggleCollapse}
        orientation={orientation}
      />

      {/* Children Branches */}
      <AnimatePresence>
        {hasChildren && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center w-full"
          >
            {/* Vertical stem line going down from parent */}
            <div className="w-0.5 h-8 bg-gradient-to-b from-indigo-500/80 to-slate-700 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-indigo-400 to-transparent animate-pulse" />
            </div>

            {/* If multiple children: render horizontal connecting bus bar */}
            <div className="relative flex justify-center w-full">
              {node.children.length > 1 && (
                <div 
                  className="absolute top-0 h-0.5 bg-slate-700/90 border-t border-indigo-500/30"
                  style={{
                    left: `calc(${100 / (node.children.length * 2)}%)`,
                    right: `calc(${100 / (node.children.length * 2)}%)`,
                  }}
                />
              )}

              {/* Children Nodes Container */}
              <div className="flex justify-center items-start gap-8 sm:gap-12 md:gap-16 pt-0">
                {node.children.map((child, index) => (
                  <div key={child.id || index} className="relative flex flex-col items-center">
                    {/* Vertical connecting line from bus bar into child */}
                    <div className="w-0.5 h-8 bg-slate-700 relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500/60 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    </div>

                    {/* Recursive branch */}
                    <TreeBranchConnector
                      node={child}
                      depth={depth + 1}
                      selectedMemberId={selectedMemberId}
                      highlightedIds={highlightedIds}
                      onSelect={onSelect}
                      onAddChild={onAddChild}
                      onAddSpouse={onAddSpouse}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleCollapse={onToggleCollapse}
                      orientation={orientation}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
