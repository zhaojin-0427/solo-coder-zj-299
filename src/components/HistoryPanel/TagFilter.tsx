import { ALL_TAGS } from "@/types";
import { cn } from "@/lib/utils";
import type { ProjectTag } from "@/types";

interface TagFilterProps {
  selectedTags: ProjectTag[];
  onTagToggle: (tag: ProjectTag) => void;
  onClear: () => void;
}

export function TagFilter({ selectedTags, onTagToggle, onClear }: TagFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={onClear}
        className={cn(
          "px-3 py-1 text-xs font-medium rounded-full transition-all",
          selectedTags.length === 0
            ? "bg-rose-400 text-white shadow-md"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        )}
      >
        全部
      </button>
      {ALL_TAGS.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full transition-all",
              isSelected
                ? "bg-rose-400 text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
