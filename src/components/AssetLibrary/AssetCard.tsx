import { cn } from "@/lib/utils";
import type { Asset } from "@/types";

interface AssetCardProps {
  asset: Asset;
  onClick: () => void;
}

export function AssetCard({ asset, onClick }: AssetCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full aspect-square bg-white rounded-xl p-3",
        "border border-gray-100 shadow-soft",
        "hover:shadow-pop hover:-translate-y-0.5 hover:border-cream-200",
        "transition-all duration-200 ease-out",
        "flex items-center justify-center"
      )}
    >
      <img
        src={asset.thumbnail}
        alt={asset.name}
        className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-200"
        draggable={false}
      />
      <div className="absolute bottom-1.5 left-0 right-0 text-center">
        <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {asset.name}
        </span>
      </div>
    </button>
  );
}
