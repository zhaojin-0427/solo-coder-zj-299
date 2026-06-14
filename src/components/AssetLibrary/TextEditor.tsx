import { useState } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const presetColors = [
  "#333333",
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#9B59B6",
  "#FF8E53",
  "#FFFFFF",
];

const presetTexts = ["我的手机壳", "LOVE", "2024", "幸运", "加油!", "❤️"];

export function TextEditor() {
  const [text, setText] = useState("");
  const [color, setColor] = useState("#333333");
  const addElement = useDesignStore((state) => state.addElement);

  const handleAddText = () => {
    const content = text.trim() || "双击编辑";
    addElement({
      type: "text",
      content,
      x: 50,
      y: 50,
      width: 120,
      height: 32,
      rotation: 0,
      opacity: 1,
      color,
      scale: 1,
      fontSize: 18,
      fontWeight: 600,
    });
    setText("");
  };

  const handlePresetClick = (preset: string) => {
    addElement({
      type: "text",
      content: preset,
      x: 50,
      y: 50,
      width: 100,
      height: 32,
      rotation: 0,
      opacity: 1,
      color,
      scale: 1,
      fontSize: 18,
      fontWeight: 600,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-gray-500 mb-2 block">输入文字</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入文字内容..."
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-200 focus:border-cream-300"
          />
          <button
            onClick={handleAddText}
            className="px-3 py-2 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 mb-2 block">文字颜色</label>
        <div className="flex gap-2 flex-wrap">
          {presetColors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110",
                color === c ? "border-rose-400 scale-110" : "border-gray-200"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-7 h-7 rounded-full cursor-pointer border-2 border-gray-200"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 mb-2 block">快捷文字</label>
        <div className="flex gap-2 flex-wrap">
          {presetTexts.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-cream-100 hover:text-rose-500 transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
