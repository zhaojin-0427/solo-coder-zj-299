import { useState, type ComponentType } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import { TagFilter } from "./TagFilter";
import { ProjectCard } from "./ProjectCard";
import { History, ChevronDown, ChevronUp, Plus, ArrowUpDown, Clock, DollarSign, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectTag, SortOption } from "@/types";

export function HistoryPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedTags, setSelectedTags] = useState<ProjectTag[]>([]);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const projects = useDesignStore((state) => state.projects);
  const currentProjectId = useDesignStore((state) => state.currentProjectId);
  const historySortOption = useDesignStore((state) => state.historySortOption);
  const setHistorySortOption = useDesignStore((state) => state.setHistorySortOption);
  const getSortedProjects = useDesignStore((state) => state.getSortedProjects);
  const loadProject = useDesignStore((state) => state.loadProject);

  const sortedProjects = getSortedProjects();
  const filteredProjects = selectedTags.length === 0
    ? sortedProjects
    : sortedProjects.filter((p) => p.tags.some((t) => selectedTags.includes(t)));

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
            {projects.length} 个方案
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
            <div className="flex-1 min-w-0">
              <TagFilter selectedTags={selectedTags} onTagToggle={handleTagToggle} onClear={() => setSelectedTags([])} />
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

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isActive={currentProjectId === project.id}
                  onLoad={() => handleLoadProject(project.id)}
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
