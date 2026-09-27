import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Download, FileJson, Image, Upload, Check, AlertCircle } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';

export const ExportModal = ({
  isOpen,
  onClose,
  treeData,
  exportRef,
  onImportTree,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importError, setImportError] = useState('');
  const importInputRef = useRef(null);

  if (!isOpen) return null;

  // Export as PNG image
  const handleExportPNG = async () => {
    if (!exportRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(exportRef.current, {
        quality: 0.95,
        backgroundColor: '#090d16',
        filter: (node) => {
          // exclude quick floating popovers if any
          return !node.classList?.contains('no-export');
        }
      });
      const link = document.createElement('a');
      link.download = `family-tree-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating image', err);
      alert('Failed to generate PNG. Please try zooming out or exporting JSON.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export as JSON backup
  const handleExportJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(treeData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `family-tree-backup-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (e) {
      console.error('JSON export failed', e);
    }
  };

  // Import JSON File
  const handleImportJSON = (e) => {
    setImportError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && parsed.name) {
          onImportTree(parsed);
          onClose();
        } else {
          setImportError('Invalid family tree JSON structure.');
        }
      } catch (err) {
        setImportError('Unable to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md modal-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Export & Backup</h3>
              <p className="text-xs text-slate-400">Save as high-res image or portable JSON</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Options */}
        <div className="p-6 space-y-4">
          {exportSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Export downloaded successfully!</span>
            </div>
          )}

          {importError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {/* Export High-Res Image button */}
          <button
            onClick={handleExportPNG}
            disabled={isExporting}
            className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 flex items-center gap-4 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <Image className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                {isExporting ? 'Generating Image...' : 'Export as PNG Picture'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">High-resolution snapshot of entire hierarchy</p>
            </div>
          </button>

          {/* Export JSON button */}
          <button
            onClick={handleExportJSON}
            className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 flex items-center gap-4 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <FileJson className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                Export JSON Backup
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Full tree data including photos and bios</p>
            </div>
          </button>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Import</span>
            {/* Import JSON button */}
            <button
              onClick={() => importInputRef.current?.click()}
              className="w-full p-3.5 rounded-2xl bg-slate-950/40 border border-dashed border-slate-700 hover:border-indigo-400/60 flex items-center justify-center gap-2.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>Import Existing JSON Family Tree</span>
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
