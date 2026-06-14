import { useState } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import { TagFilter } from "./TagFilter";
import { ProjectCard } from "./ProjectCard";
import { History, ChevronDown, ChevronUp, Plus } from "lucide-react";
import type { ProjectTag } from "@/types";

export function HistoryPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedTags, setSelectedTags] = useState<ProjectTag[]>([]);
  const projects = useDesignStore((state) => state.projects);
  const currentProjectId = useDesignStore((state) => state.currentProjectId);
  const loadProject = useDesignStore((state) => state.loadProject);

  const filteredProjects = selectedTags.length === 0
    ? projects
    : projects.filter((p) => p.tags.some((t) => selectedTags.includes(t)));

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
          <div className="mb-4">
            <TagFilter selectedTags={selectedTags} onTagToggle={handleTagToggle} onClear={() => setSelectedTags([])} />
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
