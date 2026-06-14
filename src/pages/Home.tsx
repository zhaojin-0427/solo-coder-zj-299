import { useRef, useState } from "react";
import { Toolbar } from "@/components/Toolbar";
import { PhoneCanvas } from "@/components/Canvas/PhoneCanvas";
import { AssetLibrary } from "@/components/AssetLibrary/AssetLibrary";
import { ColorPanel } from "@/components/ColorPanel/ColorPanel";
import { PropertyPanel } from "@/components/PropertyPanel/PropertyPanel";
import { HistoryPanel } from "@/components/HistoryPanel/HistoryPanel";
import { ExportModal } from "@/components/Modals/ExportModal";
import { ShoppingListModal } from "@/components/Modals/ShoppingListModal";
import { exportAsImage } from "@/utils/exportImage";
import { generateShoppingList } from "@/utils/shoppingList";
import { useDesignStore } from "@/store/useDesignStore";

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShoppingModal, setShowShoppingModal] = useState(false);

  const elements = useDesignStore((state) => state.elements);
  const caseTemplate = useDesignStore((state) => state.caseTemplate);
  const projectName = useDesignStore((state) => state.projectName);

  const handleExportPNG = async () => {
    if (canvasRef.current) {
      await exportAsImage(canvasRef.current, projectName || "phone-case-design");
    }
  };

  const shoppingItems = generateShoppingList(elements, caseTemplate);

  return (
    <div className="min-h-screen flex flex-col w-full max-w-screen overflow-x-hidden">
      <Toolbar
        canvasRef={canvasRef}
        onExport={() => setShowExportModal(true)}
        onShoppingList={() => setShowShoppingModal(true)}
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-2 sm:gap-3 p-2 sm:p-3 pt-2 pb-4 overflow-hidden w-full max-w-screen">
        <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 order-2 lg:order-1 stagger-in stagger-1">
          <AssetLibrary />
        </aside>

        <main className="flex-1 flex flex-col gap-2 sm:gap-3 order-1 lg:order-2 min-h-0 overflow-hidden w-full min-w-0">
          <div className="flex-1 flex items-center justify-center bg-white/40 rounded-2xl backdrop-blur-sm border border-white/60 relative overflow-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/30 via-transparent to-violet-50/30 pointer-events-none" />
            <PhoneCanvas ref={canvasRef} />
          </div>

          <div className="flex-shrink-0 w-full min-w-0">
            <HistoryPanel />
          </div>
        </main>

        <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-2 sm:space-y-3 order-3 stagger-in stagger-3">
          <ColorPanel />
          <PropertyPanel />
        </aside>
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExportPNG={handleExportPNG}
      />

      <ShoppingListModal
        isOpen={showShoppingModal}
        onClose={() => setShowShoppingModal(false)}
        items={shoppingItems}
      />
    </div>
  );
}
