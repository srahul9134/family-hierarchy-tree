import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  Heart, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Eye, 
  MoreHorizontal,
  Sparkles,
  Users
} from 'lucide-react';
import { generateDefaultAvatar } from '../utils/imageHelpers';

export const TreeNode = ({
  node,
  depth = 0,
  isSelected,
  isHighlighted,
  onSelect,
  onAddChild,
  onAddSpouse,
  onEdit,
  onDelete,
  onToggleCollapse,
  orientation = 'vertical', // 'vertical' or 'horizontal'
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isCollapsed = Boolean(node.collapsed);
  const primaryAvatar = generateDefaultAvatar(node.name, node.gender);

  const getGenderAccent = (gender) => {
    switch (gender) {
      case 'male':
        return {
          border: 'border-blue-500/40 hover:border-blue-400',
          glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          dot: 'bg-blue-400',
        };
      case 'female':
        return {
          border: 'border-rose-500/40 hover:border-rose-400',
          glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400',
        };
      default:
        return {
          border: 'border-emerald-500/40 hover:border-emerald-400',
          glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
    }
  };

  const accent = getGenderAccent(node.gender);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      id={`node-${node.id}`}
      className="relative flex flex-col items-center group cursor-pointer select-none"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node);
      }}
    >
      {/* Node Container Card with Glassmorphism */}
      <div 
        className={`
          relative flex items-center p-3.5 rounded-2xl transition-all duration-300 backdrop-blur-xl
          ${isSelected 
            ? 'bg-slate-900/95 ring-2 ring-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.4)] scale-[1.03]' 
            : 'bg-slate-900/80 hover:bg-slate-800/90 shadow-xl'
          }
          ${isHighlighted ? 'ring-4 ring-amber-400 animate-pulse' : ''}
          border ${accent.border} ${accent.glow}
          min-w-[240px] max-w-[310px]
        `}
      >
        {/* Generation Depth Tag */}
        <div className="absolute -top-2.5 -left-2 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <span>Gen {depth + 1}</span>
        </div>

        {/* Primary Person Section */}
        <div className="flex items-center gap-3.5 flex-1">
          {/* Avatar with Photo */}
          <div className="relative flex-shrink-0">
            {node.avatar ? (
              <img
                src={node.avatar}
                alt={node.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/10 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${primaryAvatar.color.bg} flex items-center justify-center font-bold text-lg text-white shadow-md ring-2 ring-white/10 group-hover:scale-105 transition-transform duration-300`}
              >
                {primaryAvatar.initials}
              </div>
            )}
            
            {/* Gender / Deceased status dot */}
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                node.isDeceased ? 'bg-slate-500' : accent.dot
              } shadow-sm`}
              title={node.isDeceased ? 'Deceased' : (node.gender || 'Unknown')}
            />
          </div>

          {/* Info Details */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-semibold text-sm text-slate-100 truncate group-hover:text-indigo-300 transition-colors">
                {node.name || 'Unnamed Member'}
              </h3>
              {node.isDeceased && (
                <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                  (Dec.)
                </span>
              )}
            </div>

            <p className="text-xs text-indigo-300/80 font-medium truncate mt-0.5">
              {node.title || node.relationship || 'Family Member'}
            </p>

            {node.birthDate && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 truncate">
                <Calendar className="w-3 h-3 text-slate-500 flex-shrink-0" />
                <span>
                  {new Date(node.birthDate).getFullYear() || node.birthDate}
                  {node.deathDate ? ` – ${new Date(node.deathDate).getFullYear() || node.deathDate}` : ''}
                </span>
              </div>
            )}

            {node.location && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 truncate">
                <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                <span className="truncate">{node.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Spouse Tag / Sub-Avatar if present */}
        {node.spouse && node.spouse.name && (
          <div 
            className="flex flex-col items-center justify-center pl-2 ml-1 border-l border-slate-800 flex-shrink-0"
            title={`Spouse: ${node.spouse.name}`}
          >
            <div className="relative">
              {node.spouse.avatar ? (
                <img
                  src={node.spouse.avatar}
                  alt={node.spouse.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-rose-400/40 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-rose-400/40 shadow-sm">
                  {generateDefaultAvatar(node.spouse.name, node.spouse.gender || 'female').initials}
                </div>
              )}
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400 absolute -bottom-1 -right-1" />
            </div>
            <span className="text-[10px] text-slate-400 font-medium max-w-[50px] truncate mt-1 text-center">
              {node.spouse.name.split(' ')[0]}
            </span>
          </div>
        )}

        {/* Hover Action Menu Trigger */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickMenu(!showQuickMenu);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Options"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Floating Quick Action Popover */}
        <AnimatePresence>
          {showQuickMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-9 z-50 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-1.5 w-44 backdrop-blur-2xl flex flex-col gap-1 no-pan"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onSelect(node);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-slate-800 hover:text-indigo-300 text-left transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>View Full Profile</span>
              </button>

              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onAddChild(node);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-slate-800 hover:text-emerald-300 text-left transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add Child</span>
              </button>

              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onAddSpouse(node);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-slate-800 hover:text-rose-300 text-left transition-colors"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>{node.spouse ? 'Edit Spouse' : 'Add Spouse'}</span>
              </button>

              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onEdit(node);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-slate-800 hover:text-amber-300 text-left transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit Details</span>
              </button>

              <div className="h-px bg-slate-800 my-0.5" />

              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onDelete(node);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 text-left transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Delete Branch</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse / Expand Indicator with Child Count */}
      {hasChildren && (
        <div className="relative mt-2 z-10">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse(node.id);
            }}
            className={`
              flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shadow-md
              ${isCollapsed 
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/30' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }
            `}
            title={isCollapsed ? `Expand ${node.children.length} children` : 'Collapse children'}
          >
            {isCollapsed ? (
              <>
                <ChevronRight className="w-3 h-3" />
                <span>{node.children.length} {node.children.length === 1 ? 'child' : 'children'}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                <span>{node.children.length}</span>
              </>
            )}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};
