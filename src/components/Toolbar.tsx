import { useState } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import { useMultiSceneStore } from "@/store/useMultiSceneStore";
import { PhoneSelector } from "./Canvas/PhoneSelector";
import { Undo2, Redo2, Save, Download, ShoppingBag, Trash2, Sparkles, Wand2, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_TAGS } from "@/types";
import type { ProjectTag } from "@/types";
import { generateThumbnail } from "@/utils/exportImage";

interface ToolbarProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  onExport: () => void;
  onShoppingList: () => void;
  onSmartWorkbench: () => void;
  onMultiSceneCenter: () => void;
}

export function Toolbar({ canvasRef, onExport, onShoppingList, onSmartWorkbench, onMultiSceneCenter }: ToolbarProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveTags, setSaveTags] = useState<ProjectTag[]>([]);

  const projectName = useDesignStore((state) => state.projectName);
  const projectTags = useDesignStore((state) => state.projectTags);
  const history = useDesignStore((state) => state.history);
  const undo = useDesignStore((state) => state.undo);
  const redo = useDesignStore((state) => state.redo);
  const clearElements = useDesignStore((state) => state.clearElements);
  const saveProject = useDesignStore((state) => state.saveProject);
  const elements = useDesignStore((state) => state.elements);
  const currentProjectId = useDesignStore((state) => state.currentProjectId);
  const setProjectName = useDesignStore((state) => state.setProjectName);
  const setProjectTags = useDesignStore((state) => state.setProjectTags);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const handleSaveClick = () => {
    setSaveName(projectName);
    setSaveTags(projectTags);
    setShowSaveModal(true);
  };

  const handleSave = async () => {
    if (!saveName.trim()) return;

    let thumbnail: string | undefined;
    if (canvasRef.current) {
      try {
        thumbnail = await generateThumbnail(canvasRef.current);
      } catch (e) {
        console.error("Failed to generate thumbnail", e);
      }
    }

    saveProject(saveName.trim(), saveTags, thumbnail);
    setProjectName(saveName.trim());
    setProjectTags(saveTags);
    setShowSaveModal(false);
  };

  const toggleSaveTag = (tag: ProjectTag) => {
    setSaveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <>
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/80 sticky top-0 z-40 shadow-soft overflow-hidden">
        <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-4 min-w-0 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-rose-400 via-pink-500 to-violet-500 flex items-center justify-center shadow-glow animate-glow-pulse">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-display font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent leading-tight">
                  手机壳搭配预览器
                </h1>
                <p className="text-[10px] text-gray-400 leading-tight font-display">DIY 你的专属手机壳</p>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />

            <PhoneSelector />
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-0.5 p-1 bg-gray-100/80 rounded-xl backdrop-blur-sm">
              <button
                onClick={undo}
                disabled={!canUndo}
                className={cn(
                  "p-1.5 sm:p-2 rounded-lg transition-all duration-150",
                  canUndo
                    ? "text-gray-600 hover:bg-white hover:shadow-sm hover:scale-105"
                    : "text-gray-300 cursor-not-allowed"
                )}
                title="撤销"
              >
                <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className={cn(
                  "p-1.5 sm:p-2 rounded-lg transition-all duration-150",
                  canRedo
                    ? "text-gray-600 hover:bg-white hover:shadow-sm hover:scale-105"
                    : "text-gray-300 cursor-not-allowed"
                )}
                title="重做"
              >
                <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            <button
              onClick={clearElements}
              disabled={elements.length === 0}
              className={cn(
                "p-1.5 sm:p-2 rounded-xl transition-all duration-150",
                elements.length > 0
                  ? "text-gray-500 hover:bg-red-50 hover:text-red-500"
                  : "text-gray-300 cursor-not-allowed"
              )}
              title="清空画布"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <div className="hidden sm:block h-6 w-px bg-gray-200" />

            <button
              onClick={onSmartWorkbench}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-50 text-orange-600 rounded-full hover:shadow-md hover:-translate-y-0.5 transition-all text-[11px] sm:text-xs font-medium border border-orange-200/50 flex-shrink-0"
            >
              <Wand2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">智能搭配</span>
            </button>

            <button
              onClick={onMultiSceneCenter}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-teal-100 to-cyan-50 text-teal-600 rounded-full hover:shadow-md hover:-translate-y-0.5 transition-all text-[11px] sm:text-xs font-medium border border-teal-200/50 flex-shrink-0"
            >
              <LayoutGrid className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">多场景搭配</span>
            </button>

            <button
              onClick={onShoppingList}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-violet-100 to-purple-50 text-violet-600 rounded-full hover:shadow-md hover:-translate-y-0.5 transition-all text-[11px] sm:text-xs font-medium border border-violet-200/50 flex-shrink-0"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">购物清单</span>
            </button>

            <button
              onClick={onExport}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-50 text-emerald-600 rounded-full hover:shadow-md hover:-translate-y-0.5 transition-all text-[11px] sm:text-xs font-medium border border-emerald-200/50 flex-shrink-0"
            >
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">导出</span>
            </button>

            <button
              onClick={handleSaveClick}
              className="flex items-center gap-1 px-2.5 sm:px-4 py-1.5 bg-gradient-to-r from-rose-400 via-pink-500 to-violet-500 text-white rounded-full hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5 transition-all text-[11px] sm:text-xs font-medium flex-shrink-0"
            >
              <Save className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{currentProjectId ? "更新" : "保存"}</span>
            </button>
          </div>
        </div>
      </header>

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-pop w-full max-w-md mx-4 animate-scale-in overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-rose-50 via-pink-50 to-violet-50 border-b border-white/80">
              <h3 className="text-lg font-display font-bold text-gray-800">保存方案</h3>
              <p className="text-sm text-gray-500 mt-1">给你的设计起个名字吧</p>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">方案名称</label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="输入方案名称..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 text-sm transition-all bg-gray-50 focus:bg-white"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">分类标签</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleSaveTag(tag)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-full transition-all duration-200",
                        saveTags.includes(tag)
                          ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md scale-105"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!saveName.trim()}
                className={cn(
                  "flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-200",
                  saveName.trim()
                    ? "bg-gradient-to-r from-rose-400 via-pink-500 to-violet-500 text-white hover:shadow-lg hover:shadow-pink-200/50 hover:-translate-y-0.5"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
