import { useDesignStore } from "@/store/useDesignStore";
import { Settings, Trash2, ArrowUp, ArrowDown, RotateCw, Maximize2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export function PropertyPanel() {
  const selectedElementId = useDesignStore((state) => state.selectedElementId);
  const elements = useDesignStore((state) => state.elements);
  const updateElement = useDesignStore((state) => state.updateElement);
  const deleteElement = useDesignStore((state) => state.deleteElement);
  const moveElementUp = useDesignStore((state) => state.moveElementUp);
  const moveElementDown = useDesignStore((state) => state.moveElementDown);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  if (!selectedElement) {
    return (
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            属性面板
          </h2>
        </div>
        <div className="p-8 text-center text-gray-400">
          <Settings className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">选择元素以编辑属性</p>
        </div>
      </div>
    );
  }

  const handleSliderChange = (key: string, value: number) => {
    updateElement(selectedElement.id, { [key]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          属性面板
        </h2>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {selectedElement.type === "sticker" && "贴纸"}
            {selectedElement.type === "charm" && "挂件"}
            {selectedElement.type === "lens-ring" && "镜头圈"}
            {selectedElement.type === "text" && "文字"}
          </span>
          <button
            onClick={() => deleteElement(selectedElement.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3 h-3" />
                大小
              </span>
              <span>{Math.round(selectedElement.scale * 100)}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="300"
              value={(selectedElement.scale || 1) * 100}
              onChange={(e) => handleSliderChange("scale", Number(e.target.value) / 100)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="flex items-center gap-1">
                <RotateCw className="w-3 h-3" />
                旋转
              </span>
              <span>{Math.round(selectedElement.rotation)}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={selectedElement.rotation}
              onChange={(e) => handleSliderChange("rotation", Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>透明度</span>
              <span>{Math.round(selectedElement.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={selectedElement.opacity * 100}
              onChange={(e) => handleSliderChange("opacity", Number(e.target.value) / 100)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              图层
            </span>
            <span>第 {selectedElement.zIndex} 层</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => moveElementUp(selectedElement.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-colors",
                "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <ArrowUp className="w-3.5 h-3.5" />
              上移
            </button>
            <button
              onClick={() => moveElementDown(selectedElement.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-colors",
                "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <ArrowDown className="w-3.5 h-3.5" />
              下移
            </button>
          </div>
        </div>

        {selectedElement.type === "text" && (
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">文字内容</label>
              <input
                type="text"
                value={selectedElement.content || ""}
                onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-200"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">文字颜色</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedElement.color || "#333333"}
                  onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                />
                <input
                  type="text"
                  value={selectedElement.color || "#333333"}
                  onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-200"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>字号</span>
                <span>{selectedElement.fontSize || 16}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="48"
                value={selectedElement.fontSize || 16}
                onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
