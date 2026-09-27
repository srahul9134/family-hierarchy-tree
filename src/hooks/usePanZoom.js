import { useState, useRef, useCallback, useEffect } from 'react';

export const usePanZoom = (initialScale = 1, minScale = 0.3, maxScale = 2.5) => {
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Center the view on initial load or reset
  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

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
    // Only pan if left click and not clicking on interactive buttons/inputs
    if (e.button !== 0) return;
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.no-pan')) return;

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

  // Center specific element / node in view
  const centerNode = useCallback((nodeElementId) => {
    const el = document.getElementById(nodeElementId);
    const container = containerRef.current;
    if (!el || !container) return;

    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // calculate offset to center
    const offsetX = (containerRect.width / 2) - (elRect.left - containerRect.left + (elRect.width / 2));
    const offsetY = (containerRect.height / 2) - (elRect.top - containerRect.top + (elRect.height / 2));

    setPosition(prev => ({
      x: prev.x + offsetX,
      y: prev.y + offsetY
    }));
  }, []);

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
    zoomIn,
    zoomOut,
    setZoom,
    resetView,
    setPosition,
    centerNode
  };
};
