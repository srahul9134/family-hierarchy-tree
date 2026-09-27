import React, { useState } from 'react';
import { 
  GitFork, 
  Search, 
  Download, 
  BarChart3, 
  Sparkles, 
  X,
  ChevronRight,
  Maximize2,
  ListTree
} from 'lucide-react';
import { searchTree } from '../utils/treeCalculations';

export const Header = ({
  treeData,
  viewMode = 'canvas',
  setViewMode,
  onOpenStats,
  onOpenTemplates,
  onOpenExport,
  onSelectMember,
  onFocusMember,
  onFitToScreen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchResults = searchTree(treeData, searchQuery);

  return (
    <header className="relative z-30 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 bg-slate-900/95 border-b border-slate-800 backdrop-blur-xl">
      {/* Left: Brand / Logo */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-2 ring-white/10">
          <GitFork className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm sm:text-lg font-bold text-white tracking-tight flex items-center gap-1 font-sans">
              Ancestry<span className="text-indigo-400">Tree</span>
            </h1>
            <span className="hidden lg:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Hierarchy
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-slate-400">
            Interactive multi-generation family trees
          </p>
        </div>
      </div>

      {/* Center: Search Bar (Desktop / Tablet) */}
      <div className="hidden sm:block relative flex-1 max-w-xs sm:max-w-md mx-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search relatives, roles, locations..."
            className="w-full pl-9 pr-8 py-2 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchFocused && searchQuery.trim().length > 0 && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsSearchFocused(false)} 
            />
            <div className="absolute left-0 right-0 top-12 z-50 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl p-2 max-h-72 overflow-y-auto space-y-1 backdrop-blur-2xl">
              {searchResults.length > 0 ? (
                searchResults.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => {
                      onFocusMember(member.id);
                      onSelectMember(member);
                      setIsSearchFocused(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
                          {member.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {member.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {member.title || member.relationship} {member.location ? `• ${member.location}` : ''}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No relatives matched "{searchQuery}"
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Desktop View Switcher (Tree vs List) */}
        <div className="hidden sm:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('canvas')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'canvas' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 rotate-180" />
            <span>Tree</span>
          </button>
          <button
            onClick={() => setViewMode('outline')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'outline' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>

        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="sm:hidden p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4 text-indigo-400" />
        </button>

        {/* Fit to screen (only in canvas mode) */}
        {viewMode === 'canvas' && (
          <button
            onClick={onFitToScreen}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
            title="Fit tree to screen"
          >
            <Maximize2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden xl:inline">Fit</span>
          </button>
        )}

        {/* Analytics Stats */}
        <button
          onClick={onOpenStats}
          className="hidden sm:flex p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 items-center gap-1.5 transition-colors"
          title="Tree Analytics"
        >
          <BarChart3 className="w-4 h-4 text-purple-400" />
          <span className="hidden lg:inline">Analytics</span>
        </button>

        {/* Templates */}
        <button
          onClick={onOpenTemplates}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
          title="Lineage Templates"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="hidden lg:inline">Templates</span>
        </button>

        {/* Export / Backup */}
        <button
          onClick={onOpenExport}
          className="hidden sm:flex p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 items-center gap-1.5 transition-colors"
          title="Export / Backup"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span className="hidden lg:inline">Export</span>
        </button>
      </div>

      {/* Mobile Search Overlay Input */}
      {isMobileSearchOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 p-3 bg-slate-900 border-b border-slate-800 shadow-2xl z-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member name, role, city..."
              className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery('');
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {searchQuery.trim().length > 0 && (
            <div className="mt-2 bg-slate-950 rounded-xl border border-slate-800 p-1 max-h-60 overflow-y-auto space-y-1">
              {searchResults.length > 0 ? (
                searchResults.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => {
                      onFocusMember(member.id);
                      onSelectMember(member);
                      setIsMobileSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg active:bg-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-7 h-7 rounded-lg object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
                          {member.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-white">{member.name}</p>
                        <p className="text-[10px] text-slate-400">{member.title || member.relationship}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                ))
              ) : (
                <p className="p-3 text-center text-xs text-slate-400">No results found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
