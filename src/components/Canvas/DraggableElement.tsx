import { useRef } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import { useDrag, useResize, useRotate } from "@/hooks/useDrag";
import { getAssetById } from "@/data/assets";
import { Trash2, Move } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CanvasElement } from "@/types";

interface DraggableElementProps {
  element: CanvasElement;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function DraggableElement({ element, containerRef }: DraggableElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const selectedElementId = useDesignStore((state) => state.selectedElementId);
  const selectElement = useDesignStore((state) => state.selectElement);
  const deleteElement = useDesignStore((state) => state.deleteElement);

  const isSelected = selectedElementId === element.id;

  const { isDragging, handlePointerDown, handlePointerMove, handlePointerUp } = useDrag({
    elementId: element.id,
    containerRef,
  });

  const { isResizing, handleResizeStart, handleResizeMove, handleResizeEnd } = useResize({
    elementId: element.id,
    containerRef,
  });

  const {
    isRotating,
    elementRef: rotateElementRef,
    handleRotateStart,
    handleRotateMove,
    handleRotateEnd,
  } = useRotate({
    elementId: element.id,
  });

  const asset = element.assetId ? getAssetById(element.assetId) : null;

  const renderContent = () => {
    if (element.type === "text") {
      return (
        <div
          className="w-full h-full flex items-center justify-center whitespace-nowrap"
          style={{
            color: element.color || "#333",
            fontSize: element.fontSize || 16,
            fontWeight: element.fontWeight || 500,
            fontFamily: "'Noto Sans SC', sans-serif",
          }}
        >
          {element.content || "双击编辑"}
        </div>
      );
    }

    if (asset) {
      return (
        <img
          src={asset.thumbnail}
          alt={asset.name}
          className="w-full h-full object-contain select-none pointer-events-none"
          draggable={false}
        />
      );
    }

    return null;
  };

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElement(element.id);
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute cursor-move select-none",
        isDragging && "cursor-grabbing z-50",
        isSelected && "ring-2 ring-blue-400 ring-offset-2"
      )}
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: element.width,
        height: element.height,
        transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
        opacity: element.opacity,
        zIndex: element.zIndex,
        transition: isDragging || isResizing || isRotating ? "none" : "box-shadow 0.2s",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleElementClick}
    >
      <div
        ref={(el) => {
          if (el) {
            (rotateElementRef as React.MutableRefObject<HTMLDivElement>).current = el;
          }
        }}
        className="w-full h-full"
      >
        {renderContent()}
      </div>

      {isSelected && (
        <>
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-lg cursor-pointer"
            onClick={handleDelete}
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </div>

          <div
            className="absolute -bottom-2 -right-2 w-5 h-5 bg-blue-500 rounded-full cursor-se-resize border-2 border-white shadow-md flex items-center justify-center"
            onPointerDown={handleResizeStart}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
            onPointerCancel={handleResizeEnd}
          >
            <div className="w-2 h-2 border-r-2 border-b-2 border-white" />
          </div>

          <div
            className="absolute -top-8 -right-2 w-5 h-5 bg-purple-500 rounded-full cursor-pointer border-2 border-white shadow-md flex items-center justify-center"
            onPointerDown={handleRotateStart}
            onPointerMove={handleRotateMove}
            onPointerUp={handleRotateEnd}
            onPointerCancel={handleRotateEnd}
          >
            <Move className="w-3 h-3 text-white" />
          </div>
        </>
      )}
    </div>
  );
}
