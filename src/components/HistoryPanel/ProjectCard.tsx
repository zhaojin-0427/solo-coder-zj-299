import { useState, useRef, useEffect } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import { phoneModels } from "@/data/phoneModels";
import { Trash2, Edit3, MoreVertical, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project, ProjectTag } from "@/types";
import { ALL_TAGS } from "@/types";

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  onLoad: () => void;
}

export function ProjectCard({ project, isActive, onLoad }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const deleteProject = useDesignStore((state) => state.deleteProject);
  const renameProject = useDesignStore((state) => state.renameProject);
  const updateProjectTags = useDesignStore((state) => state.updateProjectTags);

  const phoneModel = phoneModels.find((m) => m.id === project.phoneModel);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setShowTagMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("确定要删除这个方案吗？")) {
      deleteProject(project.id);
    }
    setShowMenu(false);
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      renameProject(project.id, editName.trim());
    } else {
      setEditName(project.name);
    }
    setIsEditing(false);
  };

  const handleTagToggle = (tag: ProjectTag, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTags = project.tags.includes(tag)
      ? project.tags.filter((t) => t !== tag)
      : [...project.tags, tag];
    updateProjectTags(project.id, newTags);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div
      className={cn(
        "relative group bg-white rounded-xl shadow-soft overflow-hidden cursor-pointer",
        "hover:shadow-pop hover:-translate-y-0.5 transition-all duration-200",
        isActive && "ring-2 ring-rose-400 ring-offset-2"
      )}
      onClick={onLoad}
    >
      <div className="aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-3/4 h-5/6 rounded-2xl shadow-lg"
              style={{
                backgroundColor: project.caseTemplate === "transparent" ? "rgba(255,255,255,0.5)" : project.caseColor,
                border: project.caseTemplate === "transparent" ? "2px solid rgba(255,255,255,0.8)" : "none",
              }}
            />
          </div>
        )}

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-md hover:bg-white"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute top-full right-0 mt-1 w-32 bg-white rounded-lg shadow-pop overflow-hidden z-10 animate-scale-in">
              <button
                onClick={handleRename}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                重命名
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTagMenu(!showTagMenu);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                标签
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </button>
            </div>
          )}

          {showTagMenu && (
            <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-lg shadow-pop overflow-hidden z-10 animate-scale-in p-2">
              <p className="text-xs text-gray-500 mb-2 px-1">选择标签</p>
              <div className="flex flex-wrap gap-1">
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={(e) => handleTagToggle(tag, e)}
                    className={cn(
                      "px-2 py-0.5 text-xs rounded-full transition-colors",
                      project.tags.includes(tag)
                        ? "bg-rose-400 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-3">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveName();
              if (e.key === "Escape") {
                setEditName(project.name);
                setIsEditing(false);
              }
            }}
            className="w-full text-sm font-medium text-gray-800 bg-gray-50 border border-rose-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-rose-300"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className="text-sm font-medium text-gray-800 truncate">{project.name}</h3>
        )}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{phoneModel?.name || "未知机型"}</span>
          <span className="text-xs text-gray-400">{formatDate(project.updatedAt)}</span>
        </div>
        {project.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 text-[10px] bg-cream-50 text-rose-400 rounded-full"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 2 && (
              <span className="px-1.5 py-0.5 text-[10px] text-gray-400">+{project.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
