import { useState, useEffect, useCallback } from 'react';
import { defaultFamily } from '../data/sampleTrees';
import {
  addChildToNode,
  addParentToRoot,
  updateNodeData,
  deleteNodeFromTree,
  toggleNodeCollapse,
  setAllCollapsed,
  cloneTree,
  findNodeById,
  findParentNode,
  flattenTree
} from '../utils/treeCalculations';

const LOCAL_STORAGE_KEY = 'ancestry_tree_data_v1';

export const useFamilyTree = () => {
  const [treeData, setTreeData] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {
      console.error('Error loading saved tree from localStorage', e);
    }
    return defaultFamily;
  });

  // Undo / Redo history
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Selected member for detail view or modal
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  // Save to localStorage
  useEffect(() => {
    if (treeData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(treeData));
    }
  }, [treeData]);

  // Update tree with history push
  const applyTreeUpdate = useCallback((newTree) => {
    if (!newTree) return;
    setTreeData((prev) => {
      setHistory(h => [...h.slice(0, historyIndex + 1), cloneTree(prev)]);
      setHistoryIndex(idx => idx + 1);
      return newTree;
    });
  }, [historyIndex]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex >= 0 && history[historyIndex]) {
      const previousState = history[historyIndex];
      setHistoryIndex(idx => idx - 1);
      setTreeData(previousState);
    }
  }, [historyIndex, history]);

  // Can undo/redo
  const canUndo = historyIndex >= 0;

  // Add Child
  const addChild = useCallback((parentId, childData) => {
    const updated = addChildToNode(treeData, parentId, childData);
    applyTreeUpdate(updated);
  }, [treeData, applyTreeUpdate]);

  // Add Parent / Ancestor on top
  const addParent = useCallback((parentData) => {
    const updated = addParentToRoot(treeData, parentData);
    applyTreeUpdate(updated);
  }, [treeData, applyTreeUpdate]);

  // Update Member
  const updateMember = useCallback((memberId, data) => {
    const updated = updateNodeData(treeData, memberId, data);
    applyTreeUpdate(updated);
  }, [treeData, applyTreeUpdate]);

  // Delete Member
  const deleteMember = useCallback((memberId) => {
    if (treeData && treeData.id === memberId) {
      // Trying to delete root
      const fallback = {
        id: `root-${Date.now()}`,
        name: 'New Family Root',
        title: 'Patriarch',
        relationship: 'Root',
        gender: 'male',
        birthDate: '',
        deathDate: '',
        isDeceased: false,
        location: '',
        occupation: '',
        bio: 'Click edit to configure this profile.',
        avatar: '',
        children: []
      };
      applyTreeUpdate(fallback);
      setSelectedMemberId(null);
      return;
    }
    const updated = deleteNodeFromTree(treeData, memberId);
    applyTreeUpdate(updated);
    if (selectedMemberId === memberId) {
      setSelectedMemberId(null);
    }
  }, [treeData, selectedMemberId, applyTreeUpdate]);

  // Toggle Collapse
  const toggleCollapse = useCallback((nodeId) => {
    const updated = toggleNodeCollapse(treeData, nodeId);
    setTreeData(updated); // do not push to undo history for cosmetic toggles
  }, [treeData]);

  // Expand All / Collapse All
  const expandAll = useCallback(() => {
    const updated = setAllCollapsed(treeData, false);
    setTreeData(updated);
  }, [treeData]);

  const collapseAll = useCallback(() => {
    const updated = setAllCollapsed(treeData, true);
    setTreeData(updated);
  }, [treeData]);

  // Load custom template
  const loadTemplate = useCallback((templateTree) => {
    applyTreeUpdate(cloneTree(templateTree));
  }, [applyTreeUpdate]);

  // Reset to default
  const resetToDefault = useCallback(() => {
    applyTreeUpdate(cloneTree(defaultFamily));
  }, [applyTreeUpdate]);

  // Helper to find selected member object
  const selectedMember = selectedMemberId ? findNodeById(treeData, selectedMemberId) : null;
  const selectedMemberParent = selectedMemberId ? findParentNode(treeData, selectedMemberId) : null;

  return {
    treeData,
    setTreeData: applyTreeUpdate,
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
  };
};
