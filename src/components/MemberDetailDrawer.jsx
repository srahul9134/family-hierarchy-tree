import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Edit3, 
  Trash2, 
  UserPlus, 
  Heart, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Users, 
  Focus,
  ChevronRight
} from 'lucide-react';
import { generateDefaultAvatar } from '../utils/imageHelpers';

export const MemberDetailDrawer = ({
  member,
  parentMember,
  isOpen,
  onClose,
  onEdit,
  onAddChild,
  onAddSpouse,
  onDelete,
  onFocusMember,
}) => {
  if (!isOpen || !member) return null;

  const defaultAvatar = generateDefaultAvatar(member.name, member.gender);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm drawer-container">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative z-10 w-full sm:max-w-md bg-slate-900 border-l border-slate-700/80 h-full flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Top Header Banner */}
        <div className="relative h-36 sm:h-44 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-950 flex items-start justify-between p-4 sm:p-5 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-[11px] sm:text-xs font-semibold text-indigo-300">
              {member.title || member.relationship || 'Family Profile'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onFocusMember(member.id)}
              className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Center on canvas"
            >
              <Focus className="w-4 h-4 text-indigo-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Overlapping Avatar */}
          <div className="absolute -bottom-8 sm:-bottom-10 left-4 sm:left-6">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-slate-900 shadow-2xl"
              />
            ) : (
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${defaultAvatar.color.bg} flex items-center justify-center font-bold text-xl sm:text-2xl text-white shadow-2xl ring-4 ring-slate-900`}
              >
                {defaultAvatar.initials}
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto pt-10 sm:pt-14 px-4 sm:px-6 pb-6 space-y-5 sm:space-y-6">
          {/* Name & Primary Info */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-white">{member.name}</h2>
              {member.isDeceased && (
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                  Deceased
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-indigo-300 font-medium mt-0.5">{member.title || member.relationship}</p>
          </div>

          {/* Quick Action Buttons Grid */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onAddChild(member)}
              className="p-2 sm:p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-[11px] sm:text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Child</span>
            </button>

            <button
              onClick={() => onEdit(member)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-[11px] sm:text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>Edit Details</span>
            </button>

            <button
              onClick={() => onAddSpouse(member)}
              className="p-2 sm:p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] sm:text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>Spouse</span>
            </button>
          </div>

          {/* Milestones & Meta */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5 sm:space-y-3">
            {member.birthDate && (
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>
                  <strong>Born:</strong> {member.birthDate}
                  {member.deathDate && ` • Passed: ${member.deathDate}`}
                </span>
              </div>
            )}

            {member.location && (
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                <span>
                  <strong>Location:</strong> {member.location}
                </span>
              </div>
            )}

            {member.occupation && (
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>Profession:</strong> {member.occupation}
                </span>
              </div>
            )}
          </div>

          {/* Biography */}
          {member.bio && (
            <div className="space-y-1.5">
              <h4 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">Biography & Story</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                {member.bio}
              </p>
            </div>
          )}

          {/* Spouse Card if exists */}
          {member.spouse && member.spouse.name && (
            <div className="space-y-2">
              <h4 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Spouse / Partner</span>
              </h4>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-rose-950/10 border border-rose-500/20">
                {member.spouse.avatar ? (
                  <img
                    src={member.spouse.avatar}
                    alt={member.spouse.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover ring-1 ring-rose-400"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {generateDefaultAvatar(member.spouse.name, member.spouse.gender || 'female').initials}
                  </div>
                )}
                <div>
                  <h5 className="text-xs sm:text-sm font-semibold text-white">{member.spouse.name}</h5>
                  <p className="text-[11px] sm:text-xs text-rose-300/80">{member.spouse.title || 'Spouse'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Immediate Lineage (Parents and Children) */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Direct Family Lineage</span>
            </h4>

            {/* Parent info */}
            {parentMember ? (
              <div
                onClick={() => onFocusMember(parentMember.id)}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
                    P
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white group-hover:text-indigo-300 transition-colors">
                      {parentMember.name}
                    </p>
                    <p className="text-[10px] text-slate-400">Parent / Ancestor</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Root Ancestor (No parent recorded)</p>
            )}

            {/* Children List */}
            {member.children && member.children.length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Children ({member.children.length}):</span>
                <div className="space-y-1.5">
                  {member.children.map((child) => (
                    <div
                      key={child.id}
                      onClick={() => onFocusMember(child.id)}
                      className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        {child.avatar ? (
                          <img src={child.avatar} alt={child.name} className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover" />
                        ) : (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-indigo-600/20 text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                            {child.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-white group-hover:text-indigo-300 transition-colors">
                            {child.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{child.title || 'Child'}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No children added yet.</p>
            )}
          </div>

          {/* Delete Button */}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => onDelete(member)}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete This Branch</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
