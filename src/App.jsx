import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFamilyTree } from './hooks/useFamilyTree';
import { usePanZoom } from './hooks/usePanZoom';
import { Header } from './components/Header';
import { TreeCanvas } from './components/TreeCanvas';
import { VerticalOutlineView } from './components/VerticalOutlineView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ControlsOverlay } from './components/ControlsOverlay';
import { MemberModal } from './components/MemberModal';
import { MemberDetailDrawer } from './components/MemberDetailDrawer';
import { TreeStatsModal } from './components/TreeStatsModal';
import { TemplateSelectorModal } from './components/TemplateSelectorModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const {
    treeData,
    setTreeData,
    selectedMemberId,
    setSelectedMemberId,
    selectedMember,
    selectedMemberParent,
    addChild,
    addParent,
    updateMember,
    deleteMember,
    toggleCollapse,
    expandAll,
    collapseAll,
    loadTemplate,
    resetToDefault,
    undo,
    canUndo,
  } = useFamilyTree();

  const panZoom = usePanZoom(1);
  const exportRef = useRef(null);

  // View mode: 'canvas' or 'outline'
  const [viewMode, setViewMode] = useState(() => {
    return window.innerWidth < 640 ? 'canvas' : 'canvas';
  });

  // Modals & Drawers state
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Member Modal State
  const [memberModalConfig, setMemberModalConfig] = useState({
    isOpen: false,
    mode: 'edit',
    targetNode: null,
  });

  // Open Modal Helpers
  const handleOpenAddChild = useCallback((parentNode) => {
    setMemberModalConfig({
      isOpen: true,
      mode: 'add-child',
      targetNode: parentNode,
    });
  }, []);

  const handleOpenAddSpouse = useCallback((node) => {
    setMemberModalConfig({
      isOpen: true,
      mode: 'add-spouse',
      targetNode: node,
    });
  }, []);

  const handleOpenEdit = useCallback((node) => {
    setMemberModalConfig({
      isOpen: true,
      mode: 'edit',
      targetNode: node,
    });
  }, []);

  const handleOpenAddRootParent = useCallback(() => {
    setMemberModalConfig({
      isOpen: true,
      mode: 'add-parent',
      targetNode: treeData,
    });
  }, [treeData]);

  // Handle Form Submission from Modal
  const handleModalSubmit = useCallback((data) => {
    const { mode, targetNode } = memberModalConfig;

    if (mode === 'add-child' && targetNode) {
      addChild(targetNode.id, data);
    } else if (mode === 'add-parent') {
      addParent(data);
    } else if (mode === 'edit' && targetNode) {
      updateMember(targetNode.id, data);
    } else if (mode === 'add-spouse' && targetNode) {
      updateMember(targetNode.id, { spouse: data.spouse });
    }
  }, [memberModalConfig, addChild, addParent, updateMember]);

  // Handle Member selection
  const handleSelectMember = useCallback((node) => {
    setSelectedMemberId(node.id);
    setIsDrawerOpen(true);
  }, [setSelectedMemberId]);

  // Focus and center member on canvas
  const handleFocusMember = useCallback((memberId) => {
    if (viewMode !== 'canvas') {
      setViewMode('canvas');
    }
    setTimeout(() => {
      panZoom.centerNode(`node-${memberId}`);
    }, 100);
  }, [panZoom, viewMode]);

  // Handle Delete with confirmation
  const handleDeleteMember = useCallback((node) => {
    const confirmMessage = `Are you sure you want to delete ${node.name || 'this member'} and all their descendants?`;
    if (window.confirm(confirmMessage)) {
      deleteMember(node.id);
      setIsDrawerOpen(false);
    }
  }, [deleteMember]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsStatsOpen(false);
        setIsTemplatesOpen(false);
        setIsExportOpen(false);
        setIsDrawerOpen(false);
        setMemberModalConfig(prev => ({ ...prev, isOpen: false }));
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        if (canUndo) {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, undo]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#090d16] text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Navbar */}
      <Header
        treeData={treeData}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onSelectMember={handleSelectMember}
        onFocusMember={handleFocusMember}
        onFitToScreen={panZoom.fitToScreen}
      />

      {/* Main Content Area */}
      <main className="relative flex-1 w-full h-full overflow-hidden pb-12 sm:pb-0">
        {viewMode === 'canvas' ? (
          <>
            <TreeCanvas
              treeData={treeData}
              selectedMemberId={selectedMemberId}
              onSelect={handleSelectMember}
              onAddChild={handleOpenAddChild}
              onAddSpouse={handleOpenAddSpouse}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteMember}
              onToggleCollapse={toggleCollapse}
              onAddRootParent={handleOpenAddRootParent}
              panZoom={panZoom}
              exportRef={exportRef}
            />

            {/* Floating Controls Overlay */}
            <ControlsOverlay
              panZoom={panZoom}
              onExpandAll={expandAll}
              onCollapseAll={collapseAll}
              onUndo={undo}
              canUndo={canUndo}
            />
          </>
        ) : (
          <VerticalOutlineView
            treeData={treeData}
            selectedMemberId={selectedMemberId}
            onSelect={handleSelectMember}
            onAddChild={handleOpenAddChild}
            onAddSpouse={handleOpenAddSpouse}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteMember}
            onToggleCollapse={toggleCollapse}
            onAddRootParent={handleOpenAddRootParent}
          />
        )}

        {/* Member Profile Drawer */}
        <MemberDetailDrawer
          member={selectedMember}
          parentMember={selectedMemberParent}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onEdit={handleOpenEdit}
          onAddChild={handleOpenAddChild}
          onAddSpouse={handleOpenAddSpouse}
          onDelete={handleDeleteMember}
          onFocusMember={handleFocusMember}
        />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAddModal={() => handleOpenAddChild(treeData)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Add / Edit Member Modal */}
      <MemberModal
        isOpen={memberModalConfig.isOpen}
        mode={memberModalConfig.mode}
        targetNode={memberModalConfig.targetNode}
        onClose={() => setMemberModalConfig(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleModalSubmit}
      />

      {/* Statistics & Demographics Modal */}
      <TreeStatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        treeData={treeData}
      />

      {/* Templates Selector Modal */}
      <TemplateSelectorModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={loadTemplate}
      />

      {/* Export / Backup Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        treeData={treeData}
        exportRef={exportRef}
        onImportTree={(importedTree) => {
          setTreeData(importedTree);
        }}
      />
    </div>
  );
}
