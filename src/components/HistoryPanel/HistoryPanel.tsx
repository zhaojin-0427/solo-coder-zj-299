import { useState, type ComponentType } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import { useMultiSceneStore } from "@/store/useMultiSceneStore";
import { TagFilter } from "./TagFilter";
import { ProjectCard } from "./ProjectCard";
import { History, ChevronDown, ChevronUp, Plus, ArrowUpDown, Clock, DollarSign, Layers, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectTag, SortOption, HistoryItemType, SceneGroup } from "@/types";
import { generateShoppingList, calculateTotal } from "@/utils/shoppingList";

export function HistoryPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedTags, setSelectedTags] = useState<ProjectTag[]>([]);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [typeFilter, setTypeFilter] = useState<HistoryItemType | "all">("all");

  const projects = useDesignStore((state) => state.projects);
  const currentProjectId = useDesignStore((state) => state.currentProjectId);
  const historySortOption = useDesignStore((state) => state.historySortOption);
  const setHistorySortOption = useDesignStore((state) => state.setHistorySortOption);
  const getSortedProjects = useDesignStore((state) => state.getSortedProjects);
  const loadProject = useDesignStore((state) => state.loadProject);

  const sceneGroups = useMultiSceneStore((s) => s.sceneGroups);
  const loadSceneGroup = useMultiSceneStore((s) => s.loadSceneGroup);
  const setCurrentGroup = useMultiSceneStore((s) => s.setCurrentGroup);
  const setOpen = useMultiSceneStore((s) => s.setOpen);
  const deleteSceneGroup = useMultiSceneStore((s) => s.deleteSceneGroup);

  const sortedProjects = getSortedProjects();
  const filteredProjects = selectedTags.length === 0
    ? sortedProjects
    : sortedProjects.filter((p) => p.tags.some((t) => selectedTags.includes(t)));

  const filteredSceneGroups = selectedTags.length === 0
    ? sceneGroups
    : sceneGroups.filter((g) => {
        const tags = [...new Set(g.scenes.flatMap((s) => s.tags))];
        return tags.some((t) => selectedTags.includes(t));
      });

  const sortOptions: { value: SortOption; label: string; icon: ComponentType<{ className?: string }> }[] = [
    { value: "recent", label: "最近更新", icon: Clock },
    { value: "price-asc", label: "价格从低到高", icon: DollarSign },
    { value: "asset-count", label: "素材数量", icon: Layers },
  ];

  const currentSortOption = sortOptions.find((o) => o.value === historySortOption);

  const handleTagToggle = (tag: ProjectTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleLoadProject = (projectId: string) => {
    loadProject(projectId);
  };

  const handleLoadSceneGroup = (groupId: string) => {
    loadSceneGroup(groupId);
    setCurrentGroup(groupId);
    setOpen(true);
  };

  const displayProjects = typeFilter === "scene-group" ? [] : filteredProjects;
  const displayGroups = typeFilter === "single" ? [] : filteredSceneGroups;

  const totalCount = (typeFilter === "scene-group" ? 0 : projects.length) + (typeFilter === "single" ? 0 : sceneGroups.length);

  return (
    <div className="bg-white rounded-t-2xl shadow-soft overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-3 flex items-center justify-between bg-gradient-to-r from-cream-50 to-lavender-50 hover:from-cream-100 hover:to-lavender-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-rose-400" />
          <h2 className="text-base font-bold text-gray-800">我的方案</h2>
          <span className="px-2 py-0.5 text-xs font-medium bg-white/80 text-gray-500 rounded-full">
            {totalCount} 个方案
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex gap-1 flex-shrink-0">
                {(["all", "single", "scene-group"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={cn(
                      "px-2 py-1 text-[10px] rounded-full transition-all",
                      typeFilter === type
                        ? "bg-rose-500 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                  >
                    {type === "all" ? "全部" : type === "single" ? "单方案" : "场景组"}
                  </button>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <TagFilter selectedTags={selectedTags} onTagToggle={handleTagToggle} onClear={() => setSelectedTags([])} />
              </div>
            </div>

            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs text-gray-600 transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{currentSortOption?.label || "排序"}</span>
              </button>

              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-pop overflow-hidden z-10 animate-scale-in">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setHistorySortOption(option.value);
                          setShowSortMenu(false);
                        }}
                        className={cn(
                          "w-full px-3 py-2 text-left text-xs flex items-center gap-2 transition-colors",
                          historySortOption === option.value
                            ? "bg-violet-50 text-violet-600"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {(displayProjects.length > 0 || displayGroups.length > 0) ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {displayProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isActive={currentProjectId === project.id}
                  onLoad={() => handleLoadProject(project.id)}
                />
              ))}

              {displayGroups.map((group) => (
                <SceneGroupCard
                  key={group.id}
                  group={group}
                  onLoad={() => handleLoadSceneGroup(group.id)}
                  onDelete={() => deleteSceneGroup(group.id)}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">还没有保存的方案</p>
              <p className="text-xs text-gray-300 mt-1">设计完成后点击保存按钮保存方案</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface SceneGroupCardProps {
  group: SceneGroup;
  onLoad: () => void;
  onDelete: () => void;
}

function SceneGroupCard({ group, onLoad, onDelete }: SceneGroupCardProps) {
  let totalPrice = 0;
  let assetCount = 0;
  group.scenes.forEach((s) => {
    const items = generateShoppingList(s.elements, s.caseTemplate);
    totalPrice += calculateTotal(items);
    assetCount += s.elements.filter((e) => e.assetId).length;
  });

  return (
    <div
      className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-md transition-all cursor-pointer group/card border-2 border-teal-100"
      onClick={onLoad}
    >
      <div className="relative aspect-[9/16] bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-2">
        <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-teal-500 text-white text-[9px] rounded-full flex items-center gap-0.5">
          <LayoutGrid className="w-2.5 h-2.5" />
          场景组
        </div>
        <div className="flex gap-0.5">
          {group.scenes.slice(0, 3).map((scene, idx) => (
            <div
              key={scene.id}
              className="w-8 h-14 rounded bg-white/60 flex items-center justify-center text-[8px]"
              style={{ borderLeft: `2px solid ${scene.caseColor}` }}
            >
              {scene.sceneType}
            </div>
          ))}
        </div>
      </div>
      <div className="p-2">
        <h4 className="text-xs font-medium text-gray-800 truncate">{group.name}</h4>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[10px] text-rose-500 font-bold">¥{Math.round(totalPrice)}</span>
          <span className="text-[10px] text-gray-400">{group.scenes.length}场景 · {assetCount}素材</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="mt-1 w-full py-0.5 text-[10px] text-red-400 hover:bg-red-50 rounded transition-colors"
        >
          删除
        </button>
      </div>
    </div>
  );
}
