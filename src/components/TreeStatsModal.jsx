import React from 'react';
import { motion } from 'framer-motion';
import { X, Users, Layers, Heart, Camera, Activity, Award } from 'lucide-react';
import { getTreeStats } from '../utils/treeCalculations';

export const TreeStatsModal = ({ isOpen, onClose, treeData }) => {
  if (!isOpen) return null;

  const stats = getTreeStats(treeData);

  const statCards = [
    {
      label: 'Total Family Members',
      value: stats.totalMembers,
      subtext: `${stats.directBloodlines} bloodline lineage`,
      icon: Users,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      label: 'Generations Depth',
      value: stats.generations,
      subtext: `From Root to Grandchildren`,
      icon: Layers,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'Photo Portraits',
      value: stats.totalPhotos,
      subtext: `${Math.round((stats.totalPhotos / (stats.totalMembers || 1)) * 100)}% visual coverage`,
      icon: Camera,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Living Relatives',
      value: stats.living,
      subtext: `${stats.deceased} ancestors remembered`,
      icon: Activity,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md modal-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Family Tree Analytics</h3>
              <p className="text-xs text-slate-400">Demographics, lineage depths & statistics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            {statCards.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">{item.label}</span>
                    <div className={`p-1.5 rounded-lg border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold text-white tracking-tight">{item.value}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.subtext}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gender Demographics Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Gender Distribution</span>
              <span>{stats.males} Male • {stats.females} Female</span>
            </div>

            {/* Visual multi-segmented bar */}
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(stats.males / (stats.totalMembers || 1)) * 100}%` }}
                className="bg-blue-500 h-full transition-all duration-500"
                title={`Males: ${stats.males}`}
              />
              <div
                style={{ width: `${(stats.females / (stats.totalMembers || 1)) * 100}%` }}
                className="bg-rose-500 h-full transition-all duration-500"
                title={`Females: ${stats.females}`}
              />
              <div
                style={{ width: `${(stats.others / (stats.totalMembers || 1)) * 100}%` }}
                className="bg-emerald-500 h-full transition-all duration-500"
                title={`Others: ${stats.others}`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Male ({Math.round((stats.males / (stats.totalMembers || 1)) * 100)}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Female ({Math.round((stats.females / (stats.totalMembers || 1)) * 100)}%)</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-slate-200 transition-colors"
          >
            Close Overview
          </button>
        </div>
      </motion.div>
    </div>
  );
};
