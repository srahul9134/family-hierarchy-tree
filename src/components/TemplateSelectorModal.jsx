import React from 'react';
import { motion } from 'framer-motion';
import { X, Users, Crown, PlusCircle, Sparkles } from 'lucide-react';
import { sampleTemplates } from '../data/sampleTrees';

export const TemplateSelectorModal = ({ isOpen, onClose, onSelectTemplate }) => {
  if (!isOpen) return null;

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Crown':
        return <Crown className="w-6 h-6 text-amber-400" />;
      case 'PlusCircle':
        return <PlusCircle className="w-6 h-6 text-emerald-400" />;
      default:
        return <Users className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md modal-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Choose Family Hierarchy Template</h3>
              <p className="text-xs text-slate-400">Select a prebuilt lineage or start clean</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Templates */}
        <div className="p-6 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {sampleTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onSelectTemplate(template.tree);
                onClose();
              }}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 cursor-pointer transition-all flex items-start gap-4 group shadow-md"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                {getIcon(template.icon)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {template.title}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {template.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
