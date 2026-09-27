import { useState, useRef, useCallback, useEffect } from 'react';

export const usePanZoom = (initialScale = 1, minScale = 0.2, maxScale = 2.5) => {
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const touchDistanceRef = useRef(null);
  const containerRef = useRef(null);

  // Center a specific node ID or root in the viewport
  const centerNode = useCallback((nodeElementId, customScale = null) => {
    const el = document.getElementById(nodeElementId);
    const container = containerRef.current;
    if (!el || !container) return;

    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (customScale !== null) {
      setScale(customScale);
    }

    const currentScale = customScale !== null ? customScale : scale;
    
    // Calculate the center offset
    const offsetX = (containerRect.width / 2) - (elRect.left - containerRect.left + (elRect.width / 2));
    const offsetY = (containerRect.height / 3) - (elRect.top - containerRect.top + (elRect.height / 2));

    setPosition(prev => ({
      x: prev.x + offsetX,
      y: prev.y + offsetY
    }));
  }, [scale]);

  // Auto-fit & Center the entire tree within the viewport
  const fitToScreen = useCallback((targetElement = null) => {
    const container = containerRef.current;
    if (!container) return;

    const treeEl = targetElement || container.querySelector('#tree-export-root');
    if (!treeEl) return;

    const containerWidth = container.clientWidth || window.innerWidth;
    const containerHeight = container.clientHeight || (window.innerHeight - 120);

    const treeWidth = treeEl.scrollWidth || 600;
    const treeHeight = treeEl.scrollHeight || 600;

    // Calculate optimal scale with safety margins
    const scaleX = (containerWidth * 0.9) / treeWidth;
    const scaleY = (containerHeight * 0.8) / treeHeight;
    const optimalScale = Math.min(Math.max(Math.min(scaleX, scaleY), minScale), 1.1);

    const roundedScale = Number(optimalScale.toFixed(2));
    setScale(roundedScale);

    // Center horizontally and place near the top
    setPosition({
      x: 0,
      y: window.innerWidth < 640 ? 30 : 50
    });
  }, [minScale]);

  const resetView = useCallback(() => {
    fitToScreen();
  }, [fitToScreen]);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.15, maxScale));
  }, [maxScale]);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.15, minScale));
  }, [minScale]);

  const setZoom = useCallback((newScale) => {
    setScale(Math.max(minScale, Math.min(newScale, maxScale)));
  }, [minScale, maxScale]);

  // Handle mouse down for panning
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('textarea') || e.target.closest('.no-pan')) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  }, [position]);

  // Handle mouse move
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  }, [isDragging]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mobile Touch handlers (Drag + Pinch-to-zoom)
  const handleTouchStart = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('textarea') || e.target.closest('.no-pan') || e.target.closest('.modal-container') || e.target.closest('.drawer-container')) return;

    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      };
      touchDistanceRef.current = null;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
    }
  }, [position]);

  const handleTouchMove = useCallback((e) => {
    if (e.target.closest('.modal-container') || e.target.closest('.drawer-container')) return;

    if (e.touches.length === 1 && isDragging) {
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - dragStartRef.current.x,
        y: e.touches[0].clientY - dragStartRef.current.y
      });
    } else if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      e.preventDefault();
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / touchDistanceRef.current;
      setScale(prev => {
        const next = prev * ratio;
        return Math.min(Math.max(next, minScale), maxScale);
      });
      touchDistanceRef.current = currentDist;
    }
  }, [isDragging, minScale, maxScale]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    touchDistanceRef.current = null;
  }, []);

  // Handle wheel zoom
  const handleWheel = useCallback((e) => {
    if (e.target.closest('.modal-container') || e.target.closest('.drawer-container')) return;
    e.preventDefault();

    const zoomFactor = -e.deltaY * 0.0015;
    setScale(prev => {
      const nextScale = Math.min(Math.max(prev + zoomFactor, minScale), maxScale);
      return Number(nextScale.toFixed(3));
    });
  }, [minScale, maxScale]);

  // Auto-center on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fitToScreen();
    }, 150);
    return () => clearTimeout(timer);
  }, [fitToScreen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return {
    scale,
    position,
    isDragging,
    containerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    zoomIn,
    zoomOut,
    setZoom,
    resetView,
    fitToScreen,
    setPosition,
    centerNode
  };
};
