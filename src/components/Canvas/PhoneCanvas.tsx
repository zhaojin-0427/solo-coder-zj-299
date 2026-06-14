import { useRef, forwardRef } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import { phoneModels } from "@/data/phoneModels";
import { CaseRenderer } from "./CaseRenderer";
import { DraggableElement } from "./DraggableElement";
import { getAssetById } from "@/data/assets";
import { cn } from "@/lib/utils";
import type { CanvasElement } from "@/types";

interface PhoneCanvasProps {
  className?: string;
}

export const PhoneCanvas = forwardRef<HTMLDivElement, PhoneCanvasProps>(
  ({ className }, ref) => {
    const phoneModelId = useDesignStore((state) => state.phoneModel);
    const caseTemplate = useDesignStore((state) => state.caseTemplate);
    const caseColor = useDesignStore((state) => state.caseColor);
    const elements = useDesignStore((state) => state.elements);
    const recommendations = useDesignStore((state) => state.recommendations);
    const previewSchemeId = useDesignStore((state) => state.previewSchemeId);
    const selectElement = useDesignStore((state) => state.selectElement);

    const displayElements = previewSchemeId
      ? recommendations.find((r) => r.id === previewSchemeId)?.elements || elements
      : elements;

    const containerRef = useRef<HTMLDivElement>(null);

    const phoneModel = phoneModels.find((m) => m.id === phoneModelId) || phoneModels[0];

    const handleCanvasClick = () => {
      selectElement(null);
    };

    const sortedElements = [...displayElements].sort((a, b) => a.zIndex - b.zIndex);

    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div
          ref={(el) => {
            (containerRef as React.MutableRefObject<HTMLDivElement>).current = el;
            if (typeof ref === "function") {
              ref(el);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLDivElement>).current = el;
            }
          }}
          className="relative shadow-phone"
          style={{
            width: phoneModel.width,
            height: phoneModel.height,
            borderRadius: phoneModel.cornerRadius,
          }}
          onClick={handleCanvasClick}
        >
          <CaseRenderer
            phoneModel={phoneModel}
            caseTemplate={caseTemplate}
            caseColor={caseColor}
          />

          <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: phoneModel.cornerRadius }}>
            {sortedElements.map((element) =>
              previewSchemeId ? (
                <PreviewElement key={element.id} element={element} />
              ) : (
                <DraggableElement
                  key={element.id}
                  element={element}
                  containerRef={containerRef}
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }
);

PhoneCanvas.displayName = "PhoneCanvas";

function PreviewElement({ element }: { element: CanvasElement }) {
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
          {element.content || "文字"}
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

  return (
    <div
      className="absolute select-none pointer-events-none"
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: element.width,
        height: element.height,
        transform: `translate(-50%, -50%) rotate(${element.rotation}deg) scale(${element.scale || 1})`,
        opacity: element.opacity,
        zIndex: element.zIndex,
      }}
    >
      <div className="w-full h-full">{renderContent()}</div>
    </div>
  );
}
