import { useDesignStore } from "@/store/useDesignStore";
import { Palette, Droplets, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseTemplate } from "@/types";

const presetColors = [
  "#FFFFFF",
  "#FFE4E6",
  "#FECDD3",
  "#FDA4AF",
  "#FB7185",
  "#F43F5E",
  "#E11D48",
  "#BE123C",
  "#FDE68A",
  "#FCD34D",
  "#FBBF24",
  "#F59E0B",
  "#D97706",
  "#B45309",
  "#92400E",
  "#78350F",
  "#BBF7D0",
  "#86EFAC",
  "#4ADE80",
  "#22C55E",
  "#16A34A",
  "#15803D",
  "#166534",
  "#14532D",
  "#BFDBFE",
  "#93C5FD",
  "#60A5FA",
  "#3B82F6",
  "#2563EB",
  "#1D4ED8",
  "#1E40AF",
  "#1E3A8A",
  "#DDD6FE",
  "#C4B5FD",
  "#A78BFA",
  "#8B5CF6",
  "#7C3AED",
  "#6D28D9",
  "#5B21B6",
  "#4C1D95",
  "#FBCFE8",
  "#F9A8D4",
  "#F472B6",
  "#EC4899",
  "#DB2777",
  "#BE185D",
  "#9D174D",
  "#831843",
  "#F3F4F6",
  "#E5E7EB",
  "#D1D5DB",
  "#9CA3AF",
  "#6B7280",
  "#4B5563",
  "#374151",
  "#1F2937",
];

const templates: { id: CaseTemplate; label: string; icon: typeof Droplets }[] = [
  { id: "transparent", label: "透明壳", icon: Droplets },
  { id: "solid", label: "纯色壳", icon: Palette },
  { id: "mirror", label: "镜面壳", icon: Sparkles },
];

const gradientPresets = [
  { name: "樱花粉", colors: ["#FF9A9E", "#FECFEF"] },
  { name: "薄荷绿", colors: ["#A8E6CF", "#DCEDC1"] },
  { name: "天空蓝", colors: ["#89F7FE", "#66A6FF"] },
  { name: "夕阳橙", colors: ["#FFD3A5", "#FD6585"] },
  { name: "梦幻紫", colors: ["#C471F5", "#FA71CD"] },
  { name: "极光绿", colors: ["#43E97B", "#38F9D7"] },
];

export function ColorPanel() {
  const caseTemplate = useDesignStore((state) => state.caseTemplate);
  const caseColor = useDesignStore((state) => state.caseColor);
  const setCaseTemplate = useDesignStore((state) => state.setCaseTemplate);
  const setCaseColor = useDesignStore((state) => state.setCaseColor);

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Palette className="w-5 h-5 text-rose-400" />
          配色面板
        </h2>
      </div>

      <div className="p-4 space-y-5">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-2 block">壳模板</label>
          <div className="grid grid-cols-3 gap-2">
            {templates.map((template) => {
              const Icon = template.icon;
              const isActive = caseTemplate === template.id;
              return (
                <button
                  key={template.id}
                  onClick={() => setCaseTemplate(template.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-medium transition-all",
                    isActive
                      ? "bg-cream-100 text-rose-500 ring-2 ring-cream-200"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {template.label}
                </button>
              );
            })}
          </div>
        </div>

        {caseTemplate === "solid" && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">壳颜色</label>
              <div className="grid grid-cols-8 gap-1.5">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCaseColor(color)}
                    className={cn(
                      "w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110",
                      caseColor === color ? "border-rose-400 scale-110 ring-2 ring-rose-200" : "border-gray-200"
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="color"
                  value={caseColor}
                  onChange={(e) => setCaseColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                />
                <input
                  type="text"
                  value={caseColor}
                  onChange={(e) => setCaseColor(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">渐变配色</label>
              <div className="grid grid-cols-3 gap-2">
                {gradientPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setCaseColor(preset.colors[0])}
                    className="relative h-10 rounded-lg overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, ${preset.colors[0]} 0%, ${preset.colors[1]} 100%)`,
                    }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/0 group-hover:text-white/90 transition-colors bg-black/0 group-hover:bg-black/30">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
