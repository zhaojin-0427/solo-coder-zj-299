import { useState } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import { getAssetsByType } from "@/data/assets";
import { AssetCategoryTabs } from "./AssetCategoryTabs";
import { AssetCard } from "./AssetCard";
import { TextEditor } from "./TextEditor";
import { Search } from "lucide-react";
import type { AssetCategory } from "@/types";

export function AssetLibrary() {
  const [activeTab, setActiveTab] = useState<AssetCategory>("sticker");
  const [searchQuery, setSearchQuery] = useState("");
  const addElement = useDesignStore((state) => state.addElement);

  const assets = getAssetsByType(activeTab);
  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssetClick = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;

    addElement({
      type: asset.type,
      assetId: asset.id,
      x: 50,
      y: 50,
      width: asset.defaultWidth,
      height: asset.defaultHeight,
      rotation: 0,
      opacity: 1,
      scale: 1,
    });
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-soft overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-3">素材库</h2>
        <AssetCategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab !== "text" && (
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索素材..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cream-200 focus:bg-white transition-all"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "text" ? (
          <TextEditor />
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onClick={() => handleAssetClick(asset.id)}
              />
            ))}
          </div>
        )}

        {activeTab !== "text" && filteredAssets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <Search className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">没有找到相关素材</p>
          </div>
        )}
      </div>
    </div>
  );
}
