import { Sticker, Sparkles, Camera, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssetCategory } from "@/types";

interface AssetCategoryTabsProps {
  activeTab: AssetCategory;
  onTabChange: (tab: AssetCategory) => void;
}

const tabs: { id: AssetCategory; label: string; icon: typeof Sticker }[] = [
  { id: "sticker", label: "贴纸", icon: Sticker },
  { id: "charm", label: "挂件", icon: Sparkles },
  { id: "lens-ring", label: "镜头圈", icon: Camera },
  { id: "text", label: "文字", icon: Type },
];

export function AssetCategoryTabs({ activeTab, onTabChange }: AssetCategoryTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200",
              isActive
                ? "bg-white text-rose-500 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
