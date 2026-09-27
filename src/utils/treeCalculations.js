// Tree manipulation and layout calculation utilities

// Deep clone tree structure
export const cloneTree = (node) => {
  if (!node) return null;
  return JSON.parse(JSON.stringify(node));
};

// Flatten tree into an array of nodes with metadata (depth, parentId, etc.)
export const flattenTree = (node, depth = 0, parentId = null, list = []) => {
  if (!node) return list;
  
  const flattenedNode = {
    ...node,
    depth,
    parentId,
    hasChildren: Boolean(node.children && node.children.length > 0),
    childCount: node.children ? node.children.length : 0,
  };
  
  list.push(flattenedNode);

  if (node.children && node.children.length > 0) {
    node.children.forEach(child => flattenTree(child, depth + 1, node.id, list));
  }

  return list;
};

// Calculate tree statistics
export const getTreeStats = (rootNode) => {
  if (!rootNode) return { total: 0, generations: 0, males: 0, females: 0, living: 0, deceased: 0 };
  
  const flat = flattenTree(rootNode);
  let maxDepth = 0;
  let males = 0;
  let females = 0;
  let others = 0;
  let living = 0;
  let deceased = 0;
  let totalPhotos = 0;

  flat.forEach(member => {
    if (member.depth > maxDepth) maxDepth = member.depth;
    
    // Count member
    if (member.gender === 'male') males++;
    else if (member.gender === 'female') females++;
    else others++;

    if (member.isDeceased) deceased++;
    else living++;

    if (member.avatar) totalPhotos++;

    // Also count spouse if present
    if (member.spouse && member.spouse.name) {
      if (member.spouse.gender === 'female') females++;
      else if (member.spouse.gender === 'male') males++;
      else others++;

      if (member.spouse.avatar) totalPhotos++;
    }
  });

  return {
    totalMembers: flat.length + flat.filter(m => m.spouse && m.spouse.name).length,
    directBloodlines: flat.length,
    generations: maxDepth + 1,
    males,
    females,
    others,
    living,
    deceased,
    totalPhotos,
  };
};

// Find a node by ID in tree
export const findNodeById = (node, id) => {
  if (!node) return null;
  if (node.id === id) return node;
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
};

// Find parent node of a given node ID
export const findParentNode = (root, targetId) => {
  if (!root || root.id === targetId) return null;

  if (root.children && root.children.length > 0) {
    for (const child of root.children) {
      if (child.id === targetId) return root;
      const foundInChild = findParentNode(child, targetId);
      if (foundInChild) return foundInChild;
    }
  }
  return null;
};

// Add a child node
export const addChildToNode = (root, parentId, newChildData) => {
  const newTree = cloneTree(root);
  const parent = findNodeById(newTree, parentId);
  if (!parent) return newTree;

  if (!parent.children) {
    parent.children = [];
  }

  const newChild = {
    id: `person-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: newChildData.name || 'New Member',
    title: newChildData.title || 'Child',
    relationship: newChildData.relationship || 'Child',
    gender: newChildData.gender || 'male',
    birthDate: newChildData.birthDate || '',
    deathDate: newChildData.deathDate || '',
    isDeceased: Boolean(newChildData.isDeceased),
    location: newChildData.location || '',
    occupation: newChildData.occupation || '',
    bio: newChildData.bio || '',
    avatar: newChildData.avatar || '',
    spouse: newChildData.spouse || null,
    collapsed: false,
    children: [],
  };

  parent.children.push(newChild);
  parent.collapsed = false; // ensure expanded
  return newTree;
};

// Add a new root ancestor above current root
export const addParentToRoot = (currentRoot, parentData) => {
  const newRootId = `person-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const newRoot = {
    id: newRootId,
    name: parentData.name || 'Senior Ancestor',
    title: parentData.title || 'Patriarch',
    relationship: 'Parent / Ancestor',
    gender: parentData.gender || 'male',
    birthDate: parentData.birthDate || '',
    deathDate: parentData.deathDate || '',
    isDeceased: Boolean(parentData.isDeceased),
    location: parentData.location || '',
    occupation: parentData.occupation || '',
    bio: parentData.bio || '',
    avatar: parentData.avatar || '',
    spouse: parentData.spouse || null,
    collapsed: false,
    children: [cloneTree(currentRoot)],
  };
  return newRoot;
};

// Update node data
export const updateNodeData = (root, nodeId, updatedFields) => {
  const newTree = cloneTree(root);
  const node = findNodeById(newTree, nodeId);
  if (!node) return newTree;

  Object.assign(node, updatedFields);
  return newTree;
};

// Delete node (and all descendants)
export const deleteNodeFromTree = (root, nodeId) => {
  if (root.id === nodeId) {
    return null; // Root deleted
  }

  const newTree = cloneTree(root);
  const parent = findParentNode(newTree, nodeId);
  if (!parent || !parent.children) return newTree;

  parent.children = parent.children.filter(child => child.id !== nodeId);
  return newTree;
};

// Toggle collapse state for subtree
export const toggleNodeCollapse = (root, nodeId) => {
  const newTree = cloneTree(root);
  const node = findNodeById(newTree, nodeId);
  if (node) {
    node.collapsed = !node.collapsed;
  }
  return newTree;
};

// Expand or Collapse all nodes
export const setAllCollapsed = (node, collapsed = true) => {
  if (!node) return null;
  const copy = { ...node, collapsed };
  if (copy.children && copy.children.length > 0) {
    copy.children = copy.children.map(child => setAllCollapsed(child, collapsed));
  }
  return copy;
};

// Search through hierarchy
export const searchTree = (node, query) => {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const flat = flattenTree(node);
  
  return flat.filter(m => {
    const nameMatch = m.name && m.name.toLowerCase().includes(q);
    const titleMatch = m.title && m.title.toLowerCase().includes(q);
    const bioMatch = m.bio && m.bio.toLowerCase().includes(q);
    const locationMatch = m.location && m.location.toLowerCase().includes(q);
    const spouseMatch = m.spouse && m.spouse.name && m.spouse.name.toLowerCase().includes(q);
    return nameMatch || titleMatch || bioMatch || locationMatch || spouseMatch;
  });
};
