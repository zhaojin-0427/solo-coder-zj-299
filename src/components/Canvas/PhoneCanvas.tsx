import { useRef, forwardRef } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import { phoneModels } from "@/data/phoneModels";
import { CaseRenderer } from "./CaseRenderer";
import { DraggableElement } from "./DraggableElement";
import { cn } from "@/lib/utils";

interface PhoneCanvasProps {
  className?: string;
}

export const PhoneCanvas = forwardRef<HTMLDivElement, PhoneCanvasProps>(
  ({ className }, ref) => {
    const phoneModelId = useDesignStore((state) => state.phoneModel);
    const caseTemplate = useDesignStore((state) => state.caseTemplate);
    const caseColor = useDesignStore((state) => state.caseColor);
    const elements = useDesignStore((state) => state.elements);
    const selectElement = useDesignStore((state) => state.selectElement);

    const containerRef = useRef<HTMLDivElement>(null);

    const phoneModel = phoneModels.find((m) => m.id === phoneModelId) || phoneModels[0];

    const handleCanvasClick = () => {
      selectElement(null);
    };

    const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

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
            {sortedElements.map((element) => (
              <DraggableElement
                key={element.id}
                element={element}
                containerRef={containerRef}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

PhoneCanvas.displayName = "PhoneCanvas";
