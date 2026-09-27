import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown, 
  UserPlus, 
  Heart, 
  Edit3, 
  Trash2, 
  MapPin, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { generateDefaultAvatar } from '../utils/imageHelpers';

// Recursive item component for mobile outline tree
const OutlineNode = ({
  node,
  depth = 0,
  selectedMemberId,
  onSelect,
  onAddChild,
  onAddSpouse,
  onEdit,
  onDelete,
  onToggleCollapse,
}) => {
  if (!node) return null;

  const hasChildren = node.children && node.children.length > 0;
  const isCollapsed = Boolean(node.collapsed);
  const isSelected = selectedMemberId === node.id;
  const avatar = generateDefaultAvatar(node.name, node.gender);

  return (
    <div className="flex flex-col w-full">
      {/* Node Card Row */}
      <div 
        className="flex items-center gap-2 py-2"
        style={{ paddingLeft: `${Math.min(depth * 18, 90)}px` }}
      >
        {/* Tree branch connector line indicator */}
        {depth > 0 && (
          <div className="flex items-center text-slate-600 flex-shrink-0">
            <div className="w-3 h-px bg-slate-700" />
          </div>
        )}

        {/* Expand / Collapse Button */}
        {hasChildren ? (
          <button
            onClick={() => onToggleCollapse(node.id)}
            className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center flex-shrink-0 border border-slate-700"
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-indigo-400" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          </div>
        )}

        {/* Card Body */}
        <div
          onClick={() => onSelect(node)}
          className={`
            flex-1 flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer backdrop-blur-md
            ${isSelected 
              ? 'bg-slate-900 border-indigo-500/80 shadow-[0_0_20px_rgba(99,102,241,0.25)] ring-1 ring-indigo-400' 
              : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800/90'
            }
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {node.avatar ? (
                <img src={node.avatar} alt={node.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10" />
              ) : (
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatar.color.bg} flex items-center justify-center text-xs font-bold text-white`}>
                  {avatar.initials}
                </div>
              )}
              {node.isDeceased && (
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-slate-500 border border-slate-900" />
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-semibold text-xs sm:text-sm text-white truncate">
                  {node.name}
                </h4>
                {node.isDeceased && (
                  <span className="text-[9px] text-slate-400 bg-slate-800 px-1 rounded">Dec.</span>
                )}
              </div>
              <p className="text-[11px] text-indigo-300 font-medium truncate">
                {node.title || node.relationship || 'Family Member'}
              </p>
              {node.location && (
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 truncate">
                  <MapPin className="w-2.5 h-2.5 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{node.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Action summary */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {node.spouse && node.spouse.name && (
              <div 
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px]"
                title={`Spouse: ${node.spouse.name}`}
              >
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                <span className="max-w-[45px] truncate">{node.spouse.name.split(' ')[0]}</span>
              </div>
            )}
            
            {hasChildren && (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-semibold">
                {node.children.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Recursive Children Rows */}
      <AnimatePresence>
        {hasChildren && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full relative"
          >
            {/* Indent Guide Line */}
            <div 
              className="absolute top-0 bottom-0 w-px bg-slate-800"
              style={{ left: `${Math.min(depth * 18 + 12, 102)}px` }}
            />

            {node.children.map((child) => (
              <OutlineNode
                key={child.id}
                node={child}
                depth={depth + 1}
                selectedMemberId={selectedMemberId}
                onSelect={onSelect}
                onAddChild={onAddChild}
                onAddSpouse={onAddSpouse}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleCollapse={onToggleCollapse}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const VerticalOutlineView = ({
  treeData,
  selectedMemberId,
  onSelect,
  onAddChild,
  onAddSpouse,
  onEdit,
  onDelete,
  onToggleCollapse,
  onAddRootParent,
}) => {
  if (!treeData) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p className="text-sm">No family members in this hierarchy.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto p-3 sm:p-6 max-w-2xl mx-auto pb-24">
      {/* Top Banner with Root Actions */}
      <div className="mb-4 flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-white">Family Lineage Outline</h3>
          <p className="text-xs text-slate-400">Tap to view profiles or expand branches</p>
        </div>
        <button
          onClick={onAddRootParent}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
        >
          <span>+ Ancestor</span>
        </button>
      </div>

      {/* Recursive Root Nodes */}
      <div className="space-y-1">
        <OutlineNode
          node={treeData}
          depth={0}
          selectedMemberId={selectedMemberId}
          onSelect={onSelect}
          onAddChild={onAddChild}
          onAddSpouse={onAddSpouse}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleCollapse={onToggleCollapse}
        />
      </div>
    </div>
  );
};
