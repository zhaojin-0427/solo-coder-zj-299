import { useState, useEffect } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import {
  Sparkles,
  X,
  Eye,
  EyeOff,
  Check,
  Save,
  RefreshCw,
  Tag,
  ShoppingBag,
  Layers,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecommendationScheme, CaseTemplate } from "@/types";
import { phoneModels } from "@/data/phoneModels";
import { CaseRenderer } from "@/components/Canvas/CaseRenderer";
import { getAssetById } from "@/data/assets";

export function SmartWorkbench() {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveSchemeId, setSaveSchemeId] = useState<string | null>(null);
  const [saveName, setSaveName] = useState("");

  const isOpen = useDesignStore((state) => state.smartWorkbenchOpen);
  const setSmartWorkbenchOpen = useDesignStore((state) => state.setSmartWorkbenchOpen);
  const recommendations = useDesignStore((state) => state.recommendations);
  const previewSchemeId = useDesignStore((state) => state.previewSchemeId);
  const isGenerating = useDesignStore((state) => state.isGeneratingRecommendations);
  const generateRecommendations = useDesignStore((state) => state.generateRecommendations);
  const setPreviewScheme = useDesignStore((state) => state.setPreviewScheme);
  const applyRecommendation = useDesignStore((state) => state.applyRecommendation);
  const saveRecommendationAsProject = useDesignStore((state) => state.saveRecommendationAsProject);

  const handleClose = () => {
    setPreviewScheme(null);
    setSmartWorkbenchOpen(false);
  };
  const phoneModelId = useDesignStore((state) => state.phoneModel);
  const caseTemplate = useDesignStore((state) => state.caseTemplate);
  const caseColor = useDesignStore((state) => state.caseColor);

  const phoneModel = phoneModels.find((m) => m.id === phoneModelId) || phoneModels[0];

  useEffect(() => {
    if (isOpen && recommendations.length === 0 && !isGenerating) {
      generateRecommendations();
    }
  }, [isOpen, recommendations.length, isGenerating, generateRecommendations]);

  const handleGenerate = () => {
    generateRecommendations();
  };

  const handlePreviewToggle = (schemeId: string) => {
    if (previewSchemeId === schemeId) {
      setPreviewScheme(null);
    } else {
      setPreviewScheme(schemeId);
    }
  };

  const handleApply = (schemeId: string) => {
    applyRecommendation(schemeId);
    setPreviewScheme(null);
  };

  const handleSaveClick = (scheme: RecommendationScheme) => {
    setSaveSchemeId(scheme.id);
    setSaveName(scheme.name);
    setShowSaveModal(true);
  };

  const handleSave = () => {
    if (saveSchemeId && saveName.trim()) {
      saveRecommendationAsProject(saveSchemeId, saveName.trim());
      setShowSaveModal(false);
      setSaveSchemeId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-pop w-full max-w-4xl mx-4 animate-scale-in overflow-hidden max-h-[90vh] flex flex-col">
          <div className="p-5 bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 border-b border-white/80 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-gray-800">智能搭配工作台</h2>
                <p className="text-sm text-gray-500">AI 为你推荐 3 套不同风格的搭配方案</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-5 flex-1 overflow-auto">
            {recommendations.length === 0 && !isGenerating ? (
              <div className="py-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-violet-400" />
                </div>
                <h3 className="text-base font-medium text-gray-700 mb-2">还没有推荐方案</h3>
                <p className="text-sm text-gray-400 mb-6">
                  点击下方按钮，AI 将根据你的机型、壳模板和已有素材生成推荐
                </p>
                <button
                  onClick={handleGenerate}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-violet-200/50 hover:-translate-y-0.5 transition-all text-sm font-medium inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  生成推荐方案
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">
                    {isGenerating ? "正在生成推荐方案..." : `共 ${recommendations.length} 套推荐方案`}
                  </p>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-all",
                      isGenerating
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-violet-50 text-violet-600 hover:bg-violet-100"
                    )}
                  >
                    <RefreshCw className={cn("w-3.5 h-3.5", isGenerating && "animate-spin")} />
                    换一批
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {isGenerating
                    ? [1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-gray-50 rounded-xl overflow-hidden animate-pulse"
                        >
                          <div className="aspect-[9/16] bg-gray-200" />
                          <div className="p-4 space-y-3">
                            <div className="h-5 bg-gray-200 rounded w-2/3" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                            <div className="h-8 bg-gray-200 rounded-lg" />
                          </div>
                        </div>
                      ))
                    : recommendations.map((scheme) => (
                        <RecommendationCard
                          key={scheme.id}
                          scheme={scheme}
                          isPreviewing={previewSchemeId === scheme.id}
                          phoneModel={phoneModel}
                          caseTemplate={caseTemplate}
                          caseColor={caseColor}
                          onPreviewToggle={() => handlePreviewToggle(scheme.id)}
                          onApply={() => handleApply(scheme.id)}
                          onSave={() => handleSaveClick(scheme)}
                        />
                      ))}
                </div>
              </>
            )}
          </div>

          {previewSchemeId && (
            <div className="p-4 bg-amber-50 border-t border-amber-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-amber-700">
                  正在预览推荐方案，点击"应用"将方案应用到画布
                </span>
              </div>
              <button
                onClick={() => setPreviewScheme(null)}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                退出预览
              </button>
            </div>
          )}
        </div>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-pop w-full max-w-md mx-4 animate-scale-in overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-rose-50 via-pink-50 to-violet-50 border-b border-white/80">
              <h3 className="text-lg font-display font-bold text-gray-800">保存方案</h3>
              <p className="text-sm text-gray-500 mt-1">将推荐方案保存到我的方案</p>
            </div>

            <div className="p-6">
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

interface RecommendationCardProps {
  scheme: RecommendationScheme;
  isPreviewing: boolean;
  phoneModel: typeof phoneModels[0];
  caseTemplate: CaseTemplate;
  caseColor: string;
  onPreviewToggle: () => void;
  onApply: () => void;
  onSave: () => void;
}

function RecommendationCard({
  scheme,
  isPreviewing,
  phoneModel,
  caseTemplate,
  caseColor,
  onPreviewToggle,
  onApply,
  onSave,
}: RecommendationCardProps) {
  const sortedElements = [...scheme.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-soft overflow-hidden transition-all duration-200",
        isPreviewing && "ring-2 ring-violet-400 ring-offset-2 shadow-lg"
      )}
    >
      <div className="relative aspect-[9/16] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 overflow-hidden">
        {isPreviewing && (
          <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-violet-500 text-white text-xs rounded-full flex items-center gap-1">
            <Eye className="w-3 h-3" />
            预览中
          </div>
        )}

        <div
          className="relative shadow-md"
          style={{
            width: phoneModel.width * 0.55,
            height: phoneModel.height * 0.55,
            borderRadius: phoneModel.cornerRadius * 0.55,
          }}
        >
          <CaseRenderer
            phoneModel={phoneModel}
            caseTemplate={caseTemplate}
            caseColor={caseColor}
          />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: phoneModel.cornerRadius * 0.55 }}
          >
            {sortedElements.map((element) => {
              const asset = element.assetId ? getAssetById(element.assetId) : null;
              return (
                <div
                  key={element.id}
                  className="absolute"
                  style={{
                    left: `${element.x}%`,
                    top: `${element.y}%`,
                    width: element.width * 0.55,
                    height: element.height * 0.55,
                    transform: `translate(-50%, -50%) rotate(${element.rotation}deg) scale(${element.scale || 1})`,
                    opacity: element.opacity,
                    zIndex: element.zIndex,
                  }}
                >
                  {element.type === "text" ? (
                    <div
                      className="w-full h-full flex items-center justify-center whitespace-nowrap"
                      style={{
                        color: element.color || "#333",
                        fontSize: (element.fontSize || 16) * 0.55,
                        fontWeight: element.fontWeight || 500,
                      }}
                    >
                      {element.content || "文字"}
                    </div>
                  ) : asset ? (
                    <img
                      src={asset.thumbnail}
                      alt={asset.name}
                      className="w-full h-full object-contain select-none pointer-events-none"
                      draggable={false}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-800">{scheme.name}</h3>
          <div className="flex items-center gap-1 text-rose-500">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="text-sm font-bold">¥{scheme.estimatedTotal}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {scheme.styleTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] bg-violet-50 text-violet-600 rounded-full flex items-center gap-0.5"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            {scheme.assetCount} 个素材
          </span>
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3" />
            {scheme.style}
          </span>
        </div>

        <p className="text-xs text-gray-400 mb-4 line-clamp-2">{scheme.reason}</p>

        <div className="flex gap-2">
          <button
            onClick={onPreviewToggle}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1",
              isPreviewing
                ? "bg-violet-100 text-violet-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {isPreviewing ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                取消预览
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                预览
              </>
            )}
          </button>
          <button
            onClick={onApply}
            className="flex-1 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-md hover:shadow-violet-200/50 transition-all flex items-center justify-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            应用
          </button>
          <button
            onClick={onSave}
            className="py-2 px-3 rounded-lg text-xs font-medium bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all flex items-center justify-center"
            title="保存为方案"
          >
            <Save className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
