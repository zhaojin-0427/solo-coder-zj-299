import { useEffect, useState } from "react";
import { useQualityCheckStore } from "@/store/useQualityCheckStore";
import { useDesignStore } from "@/store/useDesignStore";
import { useMultiSceneStore } from "@/store/useMultiSceneStore";
import { useInspirationStore } from "@/store/useInspirationStore";
import {
  runQualityCheck,
  getGradeColor,
  getGradeText,
  getSeverityColor,
  getSeverityText,
} from "@/utils/qualityCheck";
import { phoneModels } from "@/data/phoneModels";
import { generateShoppingList, calculateTotal } from "@/utils/shoppingList";
import { generateId } from "@/utils/idGenerator";
import { cn } from "@/lib/utils";
import {
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Sparkles,
  Save,
  ArrowLeft,
  Upload,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  FileText,
} from "lucide-react";

export function QualityCheckModal() {
  const isOpen = useQualityCheckStore((s) => s.isOpen);
  const currentSourceType = useQualityCheckStore((s) => s.currentSourceType);
  const currentSourceId = useQualityCheckStore((s) => s.currentSourceId);
  const qualityResult = useQualityCheckStore((s) => s.qualityResult);
  const isChecking = useQualityCheckStore((s) => s.isChecking);
  const setQualityResult = useQualityCheckStore((s) => s.setQualityResult);
  const setIsChecking = useQualityCheckStore((s) => s.setIsChecking);
  const createDraft = useQualityCheckStore((s) => s.createDraft);
  const reset = useQualityCheckStore((s) => s.reset);
  const setOpen = useQualityCheckStore((s) => s.setOpen);

  const projects = useDesignStore((s) => s.projects);
  const sceneGroups = useMultiSceneStore((s) => s.sceneGroups);
  const publishFromProject = useInspirationStore((s) => s.publishFromProject);
  const publishFromSceneGroup = useInspirationStore((s) => s.publishFromSceneGroup);

  const [description, setDescription] = useState("");
  const [expandedChecks, setExpandedChecks] = useState<Set<string>>(new Set());
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && currentSourceType && currentSourceId && isChecking) {
      runCheck();
    }
  }, [isOpen, currentSourceType, currentSourceId, isChecking]);

  const runCheck = () => {
    if (!currentSourceType || !currentSourceId) return;

    setTimeout(() => {
      let result;

      if (currentSourceType === "project") {
        const project = projects.find((p) => p.id === currentSourceId);
        if (!project) {
          setIsChecking(false);
          return;
        }

        const items = generateShoppingList(project.elements, project.caseTemplate);
        const totalPrice = calculateTotal(items);

        const sceneBreakdowns = [
          {
            sceneType: "通勤" as const,
            caseTemplate: project.caseTemplate,
            caseColor: project.caseColor,
            elements: project.elements.map((el) => ({ ...el, id: generateId() })),
            tags: project.tags,
            price: totalPrice,
          },
        ];

        result = runQualityCheck({
          thumbnail: project.thumbnail,
          elements: project.elements,
          phoneModelId: project.phoneModel,
          caseTemplate: project.caseTemplate,
          phoneModels,
          statedPrice: totalPrice,
          sceneBreakdowns,
          styleTags: project.tags,
          sceneTypeTags: ["通勤"],
        });
      } else {
        const group = sceneGroups.find((g) => g.id === currentSourceId);
        if (!group) {
          setIsChecking(false);
          return;
        }

        let totalPrice = 0;
        const allElements: any[] = [];
        const sceneTypeTags = new Set<any>();
        const allTags = new Set<any>();

        const sceneBreakdowns = group.scenes.map((scene) => {
          const items = generateShoppingList(scene.elements, scene.caseTemplate);
          const scenePrice = calculateTotal(items);
          totalPrice += scenePrice;
          scene.elements.forEach((el) => allElements.push(el));
          sceneTypeTags.add(scene.sceneType);
          scene.tags.forEach((t) => allTags.add(t));

          return {
            sceneType: scene.sceneType,
            caseTemplate: scene.caseTemplate,
            caseColor: scene.caseColor,
            elements: scene.elements.map((el) => ({ ...el, id: generateId() })),
            tags: scene.tags,
            price: scenePrice,
          };
        });

        const firstScene = group.scenes[0];

        result = runQualityCheck({
          thumbnail: firstScene?.thumbnail,
          elements: allElements,
          phoneModelId: group.phoneModel,
          caseTemplate: firstScene?.caseTemplate || "transparent",
          phoneModels,
          statedPrice: totalPrice,
          sceneBreakdowns,
          styleTags: Array.from(allTags),
          sceneTypeTags: Array.from(sceneTypeTags),
        });
      }

      setQualityResult(result);
      setIsChecking(false);
    }, 800);
  };

  const handleSaveDraft = () => {
    if (!currentSourceType || !currentSourceId) return;

    if (currentSourceType === "project") {
      const project = projects.find((p) => p.id === currentSourceId);
      if (!project) return;

      const items = generateShoppingList(project.elements, project.caseTemplate);
      const totalPrice = calculateTotal(items);

      const sceneBreakdowns = [
        {
          sceneType: "通勤" as const,
          caseTemplate: project.caseTemplate,
          caseColor: project.caseColor,
          elements: project.elements.map((el) => ({ ...el, id: generateId() })),
          tags: project.tags,
          price: totalPrice,
        },
      ];

      createDraft({
        sourceType: "project",
        sourceId: project.id,
        name: project.name,
        description,
        type: "single",
        phoneModel: project.phoneModel,
        caseTemplate: project.caseTemplate,
        styleTags: project.tags,
        sceneTypeTags: ["通勤"],
        thumbnail: project.thumbnail,
        elements: project.elements.map((el) => ({ ...el, id: generateId() })),
        sceneBreakdowns,
        qualityCheck: qualityResult || undefined,
      });
    } else {
      const group = sceneGroups.find((g) => g.id === currentSourceId);
      if (!group) return;

      let totalPrice = 0;
      const allElements: any[] = [];
      const sceneTypeTags = new Set<any>();
      const allTags = new Set<any>();

      const sceneBreakdowns = group.scenes.map((scene) => {
        const items = generateShoppingList(scene.elements, scene.caseTemplate);
        const scenePrice = calculateTotal(items);
        totalPrice += scenePrice;
        scene.elements.forEach((el) => allElements.push(el));
        sceneTypeTags.add(scene.sceneType);
        scene.tags.forEach((t) => allTags.add(t));

        return {
          sceneType: scene.sceneType,
          caseTemplate: scene.caseTemplate,
          caseColor: scene.caseColor,
          elements: scene.elements.map((el) => ({ ...el, id: generateId() })),
          tags: scene.tags,
          price: scenePrice,
        };
      });

      const firstScene = group.scenes[0];

      createDraft({
        sourceType: "scene-group",
        sourceId: group.id,
        name: group.name,
        description,
        type: "scene-group",
        phoneModel: group.phoneModel,
        caseTemplate: firstScene?.caseTemplate || "transparent",
        styleTags: Array.from(allTags),
        sceneTypeTags: Array.from(sceneTypeTags),
        thumbnail: firstScene?.thumbnail,
        elements: allElements.map((el) => ({ ...el, id: generateId() })),
        sceneBreakdowns,
        qualityCheck: qualityResult || undefined,
      });
    }

    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
      setOpen(false);
      setTimeout(() => reset(), 300);
    }, 1500);
  };

  const handlePublish = () => {
    if (!currentSourceType || !currentSourceId) return;

    if (currentSourceType === "project") {
      publishFromProject(currentSourceId, description || undefined);
    } else {
      publishFromSceneGroup(currentSourceId, description || undefined);
    }

    setShowPublishSuccess(true);
    setTimeout(() => {
      setShowPublishSuccess(false);
      setOpen(false);
      setTimeout(() => reset(), 300);
    }, 1500);
  };

  const handleBackToEdit = () => {
    setOpen(false);
    setTimeout(() => reset(), 300);
  };

  const toggleCheckExpand = (checkId: string) => {
    setExpandedChecks((prev) => {
      const next = new Set(prev);
      if (next.has(checkId)) {
        next.delete(checkId);
      } else {
        next.add(checkId);
      }
      return next;
    });
  };

  if (!isOpen) return null;

  const sourceName = (() => {
    if (currentSourceType === "project") {
      return projects.find((p) => p.id === currentSourceId)?.name || "未知方案";
    }
    return sceneGroups.find((g) => g.id === currentSourceId)?.name || "未知场景组";
  })();

  const SeverityIcon = ({ severity }: { severity: string }) => {
    switch (severity) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "info":
        return <Info className="w-5 h-5 text-indigo-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-pop w-full max-w-2xl mx-4 animate-scale-in overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-white/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-gray-800">发布质检中心</h2>
              <p className="text-sm text-gray-500">{sourceName}</p>
            </div>
          </div>
          <button
            onClick={handleBackToEdit}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {isChecking ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
              <h3 className="text-base font-medium text-gray-700 mb-2">正在进行质量检测...</h3>
              <p className="text-sm text-gray-400">请稍候，系统正在逐项检查方案质量</p>
            </div>
          ) : qualityResult ? (
            <>
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-1">综合评分</h3>
                    <p className="text-xs text-gray-400">
                      {qualityResult.checks.length} 项检测 · {qualityResult.errors.length} 项错误 · {qualityResult.warnings.length} 项警告
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-4xl font-bold"
                      style={{ color: getGradeColor(qualityResult.grade) }}
                    >
                      {qualityResult.overallScore}
                    </div>
                    <div
                      className="text-xs font-medium mt-1"
                      style={{ color: getGradeColor(qualityResult.grade) }}
                    >
                      {getGradeText(qualityResult.grade)}
                    </div>
                  </div>
                </div>

                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${qualityResult.overallScore}%`,
                      backgroundColor: getGradeColor(qualityResult.grade),
                    }}
                  />
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  {qualityResult.canPublish ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      可以发布
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                      <XCircle className="w-3.5 h-3.5" />
                      存在错误，暂不可发布
                    </span>
                  )}
                  {qualityResult.warnings.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {qualityResult.warnings.length} 项警告
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  检测项目详情
                </h3>
                {qualityResult.checks.map((check) => (
                  <div
                    key={check.id}
                    className={cn(
                      "border rounded-xl overflow-hidden transition-all",
                      check.severity === "error"
                        ? "border-red-100 bg-red-50/30"
                        : check.severity === "warning"
                        ? "border-amber-100 bg-amber-50/30"
                        : check.severity === "info"
                        ? "border-indigo-100 bg-indigo-50/30"
                        : "border-gray-100 bg-white"
                    )}
                  >
                    <button
                      onClick={() => toggleCheckExpand(check.id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-white/50 transition-colors text-left"
                    >
                      <SeverityIcon severity={check.severity} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            {check.name}
                          </span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span
                              className="text-xs font-bold"
                              style={{ color: getSeverityColor(check.severity) }}
                            >
                              {check.score}/{check.maxScore}
                            </span>
                            {expandedChecks.has(check.id) ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{check.message}</p>
                      </div>
                    </button>

                    {expandedChecks.has(check.id) && (
                      <div className="px-3 pb-3 pt-1 border-t border-gray-100/50">
                        <p className="text-xs text-gray-500 mb-2">{check.description}</p>
                        {check.suggestions && check.suggestions.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600">优化建议：</p>
                            <ul className="space-y-0.5">
                              {check.suggestions.map((suggestion, idx) => (
                                <li
                                  key={idx}
                                  className="text-xs text-gray-500 flex items-start gap-1.5"
                                >
                                  <span className="text-purple-400 mt-0.5">•</span>
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  搭配说明（可选）
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="描述一下这个搭配的灵感来源或使用场景..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-white resize-none h-20"
                />
              </div>
            </>
          ) : null}
        </div>

        <div className="p-5 pt-0 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            onClick={handleBackToEdit}
            className="flex items-center justify-center gap-1.5 flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            返回编辑
          </button>
          <button
            onClick={handleSaveDraft}
            className="flex items-center justify-center gap-1.5 flex-1 py-3 bg-white text-purple-600 rounded-xl border border-purple-200 hover:bg-purple-50 transition-colors font-medium text-sm"
          >
            <Save className="w-4 h-4" />
            保存草稿
          </button>
          <button
            onClick={handlePublish}
            disabled={!qualityResult?.canPublish}
            className={cn(
              "flex items-center justify-center gap-1.5 flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-200",
              qualityResult?.canPublish
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            <Upload className="w-4 h-4" />
            立即发布
          </button>
        </div>

        {showSaveSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl p-8 shadow-pop animate-scale-in text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <Save className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">草稿已保存</h3>
              <p className="text-sm text-gray-500">可在灵感广场中恢复继续发布</p>
            </div>
          </div>
        )}

        {showPublishSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl p-8 shadow-pop animate-scale-in text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">发布成功！</h3>
              <p className="text-sm text-gray-500">你的灵感已发布到灵感广场</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
