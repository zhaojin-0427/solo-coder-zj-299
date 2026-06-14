import { useState, useRef, useCallback } from "react";
import { useDesignStore } from "@/store/useDesignStore";

interface UseDragOptions {
  elementId: string;
  containerRef: React.RefObject<HTMLDivElement>;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function useDrag({ elementId, containerRef, onDragStart, onDragEnd }: UseDragOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; elX: number; elY: number } | null>(null);
  const updateElement = useDesignStore((state) => state.updateElement);
  const selectElement = useDesignStore((state) => state.selectElement);
  const pushHistory = useDesignStore((state) => state.pushHistory);
  const elements = useDesignStore((state) => state.elements);

  const element = elements.find((el) => el.id === elementId);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!element || !containerRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);

      setIsDragging(true);
      selectElement(elementId);

      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        elX: element.x,
        elY: element.y,
      };

      onDragStart?.();
    },
    [element, containerRef, elementId, selectElement, onDragStart]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !dragStartRef.current || !element || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      const dx = ((e.clientX - dragStartRef.current.x) / containerWidth) * 100;
      const dy = ((e.clientY - dragStartRef.current.y) / containerHeight) * 100;

      let newX = dragStartRef.current.elX + dx;
      let newY = dragStartRef.current.elY + dy;

      const elementWidthPercent = (element.width / containerWidth) * 100;
      const elementHeightPercent = (element.height / containerHeight) * 100;

      newX = Math.max(-elementWidthPercent / 2, Math.min(100 - elementWidthPercent / 2, newX));
      newY = Math.max(-elementHeightPercent / 2, Math.min(100 - elementHeightPercent / 2, newY));

      updateElement(elementId, { x: newX, y: newY });
    },
    [isDragging, element, containerRef, elementId, updateElement]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;

      const target = e.currentTarget as HTMLElement;
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }

      setIsDragging(false);
      dragStartRef.current = null;
      pushHistory();
      onDragEnd?.();
    },
    [isDragging, pushHistory, onDragEnd]
  );

  return {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}

interface UseResizeOptions {
  elementId: string;
  containerRef: React.RefObject<HTMLDivElement>;
  onResizeEnd?: () => void;
}

export function useResize({ elementId, containerRef, onResizeEnd }: UseResizeOptions) {
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number; scale: number } | null>(null);
  const updateElement = useDesignStore((state) => state.updateElement);
  const pushHistory = useDesignStore((state) => state.pushHistory);
  const elements = useDesignStore((state) => state.elements);

  const element = elements.find((el) => el.id === elementId);

  const handleResizeStart = useCallback(
    (e: React.PointerEvent) => {
      if (!element || !containerRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);

      setIsResizing(true);

      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: element.width,
        height: element.height,
        scale: element.scale || 1,
      };
    },
    [element, containerRef]
  );

  const handleResizeMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isResizing || !resizeStartRef.current || !element) return;

      const dx = e.clientX - resizeStartRef.current.x;
      const dy = e.clientY - resizeStartRef.current.y;

      const delta = Math.max(dx, dy);
      const scaleChange = delta / 100;
      const newScale = Math.max(0.3, Math.min(3, resizeStartRef.current.scale + scaleChange));

      updateElement(elementId, {
        scale: newScale,
        width: resizeStartRef.current.width * (newScale / resizeStartRef.current.scale),
        height: resizeStartRef.current.height * (newScale / resizeStartRef.current.scale),
      });
    },
    [isResizing, element, elementId, updateElement]
  );

  const handleResizeEnd = useCallback(
    (e: React.PointerEvent) => {
      if (!isResizing) return;

      const target = e.currentTarget as HTMLElement;
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }

      setIsResizing(false);
      resizeStartRef.current = null;
      pushHistory();
      onResizeEnd?.();
    },
    [isResizing, pushHistory, onResizeEnd]
  );

  return {
    isResizing,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
  };
}

interface UseRotateOptions {
  elementId: string;
  onRotateEnd?: () => void;
}

export function useRotate({ elementId, onRotateEnd }: UseRotateOptions) {
  const [isRotating, setIsRotating] = useState(false);
  const rotateStartRef = useRef<{ angle: number; startAngle: number; centerX: number; centerY: number } | null>(null);
  const updateElement = useDesignStore((state) => state.updateElement);
  const pushHistory = useDesignStore((state) => state.pushHistory);
  const elements = useDesignStore((state) => state.elements);
  const elementRef = useRef<HTMLDivElement>(null);

  const element = elements.find((el) => el.id === elementId);

  const handleRotateStart = useCallback(
    (e: React.PointerEvent) => {
      if (!element || !elementRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

      setIsRotating(true);
      rotateStartRef.current = {
        angle: element.rotation,
        startAngle,
        centerX,
        centerY,
      };
    },
    [element]
  );

  const handleRotateMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isRotating || !rotateStartRef.current || !element) return;

      const { centerX, centerY, startAngle, angle } = rotateStartRef.current;
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      const deltaAngle = currentAngle - startAngle;

      updateElement(elementId, { rotation: angle + deltaAngle });
    },
    [isRotating, element, elementId, updateElement]
  );

  const handleRotateEnd = useCallback(
    (e: React.PointerEvent) => {
      if (!isRotating) return;

      const target = e.currentTarget as HTMLElement;
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }

      setIsRotating(false);
      rotateStartRef.current = null;
      pushHistory();
      onRotateEnd?.();
    },
    [isRotating, pushHistory, onRotateEnd]
  );

  return {
    isRotating,
    elementRef,
    handleRotateStart,
    handleRotateMove,
    handleRotateEnd,
  };
}
