import type {
  QualityCheckResult,
  QualityCheckItem,
  CanvasElement,
  CaseTemplate,
  ProjectTag,
  SceneType,
  InspirationSceneBreakdown,
  PhoneModel,
} from "@/types";
import { assets } from "@/data/assets";
import { generateShoppingList, calculateTotal } from "./shoppingList";
import { ALL_TAGS, ALL_SCENE_TYPES } from "@/types";

const SCENE_TAG_MAPPING: Record<SceneType, ProjectTag[]> = {
  "通勤": ["通勤", "极简", "文艺"],
  "约会": ["可爱", "文艺", "节日"],
  "节日": ["节日", "可爱", "炫酷"],
  "旅行": ["炫酷", "极简", "文艺"],
  "礼物": ["可爱", "节日", "文艺"],
};

export function checkThumbnailIntegrity(
  thumbnail: string | undefined,
  elements: CanvasElement[]
): QualityCheckItem {
  const hasThumbnail = !!thumbnail && thumbnail.length > 0;
  const hasElements = elements.length > 0;

  let severity: QualityCheckItem["severity"] = "pass";
  let score = 100;
  let message = "预览图完整";
  const suggestions: string[] = [];

  if (!hasThumbnail) {
    severity = "warning";
    score = 60;
    message = "缺少预览图";
    suggestions.push("建议生成预览图以提升卡片吸引力");
  } else if (hasThumbnail && !hasElements) {
    severity = "warning";
    score = 40;
    message = "预览图存在但画布为空";
    suggestions.push("请添加素材后再发布");
  }

  return {
    id: "thumbnail-integrity",
    name: "预览图完整性",
    description: "检查灵感卡片是否有清晰的预览图",
    severity,
    score,
    maxScore: 100,
    message,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

export function checkPhoneCaseConsistency(
  phoneModelId: string,
  caseTemplate: CaseTemplate,
  phoneModels: PhoneModel[]
): QualityCheckItem {
  const phoneModel = phoneModels.find((m) => m.id === phoneModelId);

  let severity: QualityCheckItem["severity"] = "pass";
  let score = 100;
  let message = "机型与壳模板匹配";
  const suggestions: string[] = [];

  if (!phoneModel) {
    severity = "error";
    score = 0;
    message = "机型信息无效";
    suggestions.push("请选择有效的手机机型");
  }

  const validTemplates: CaseTemplate[] = ["transparent", "solid", "mirror"];
  if (!validTemplates.includes(caseTemplate)) {
    severity = "error";
    score = 0;
    message = "壳模板类型无效";
    suggestions.push("请选择有效的壳模板类型");
  }

  return {
    id: "phone-case-consistency",
    name: "机型与壳模板一致性",
    description: "检查机型与壳模板是否匹配",
    severity,
    score,
    maxScore: 100,
    message,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

export function checkMaterialReadability(
  elements: CanvasElement[]
): QualityCheckItem {
  let severity: QualityCheckItem["severity"] = "pass";
  let score = 100;
  let message = "素材清单完整可读";
  const suggestions: string[] = [];

  const validElements = elements.filter((e) => {
    if (e.type === "text") {
      return !!e.content && e.content.trim().length > 0;
    }
    return !!e.assetId;
  });

  const invalidElements = elements.length - validElements.length;
  const unnamedAssets = elements.filter(
    (e) => e.assetId && !assets.find((a) => a.id === e.assetId)
  ).length;

  if (elements.length === 0) {
    severity = "warning";
    score = 40;
    message = "画布为空，没有任何素材";
    suggestions.push("建议添加至少1-2个素材使方案更完整");
  } else if (invalidElements > 0) {
    severity = "warning";
    score = 70;
    message = `有 ${invalidElements} 个元素信息不完整`;
    suggestions.push("请确保所有素材都有正确的资源引用");
  } else if (unnamedAssets > 0) {
    severity = "info";
    score = 85;
    message = `有 ${unnamedAssets} 个素材未找到名称`;
    suggestions.push("部分素材可能无法显示名称");
  }

  if (validElements.length > 8) {
    severity = "warning";
    score = Math.max(60, score - 10);
    message = "素材数量较多，可能影响可读性";
    suggestions.push("建议控制素材数量在8个以内，保持设计简洁");
  }

  return {
    id: "material-readability",
    name: "素材清单可读性",
    description: "检查素材清单是否完整可读",
    severity,
    score,
    maxScore: 100,
    message,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

export function checkPriceConsistency(
  elements: CanvasElement[],
  caseTemplate: CaseTemplate,
  statedPrice: number
): QualityCheckItem {
  const items = generateShoppingList(elements, caseTemplate);
  const calculatedTotal = calculateTotal(items);
  const diff = Math.abs(statedPrice - calculatedTotal);
  const diffPercent = statedPrice > 0 ? (diff / statedPrice) * 100 : 0;

  let severity: QualityCheckItem["severity"] = "pass";
  let score = 100;
  let message = "价格构成与预计总价一致";
  const suggestions: string[] = [];

  if (diffPercent > 20) {
    severity = "error";
    score = 30;
    message = `价格差异过大（¥${calculatedTotal.toFixed(0)} vs 标注¥${statedPrice.toFixed(0)}）`;
    suggestions.push("请重新核算价格或更新预计总价");
  } else if (diffPercent > 10) {
    severity = "warning";
    score = 60;
    message = `价格存在一定差异（¥${calculatedTotal.toFixed(0)} vs 标注¥${statedPrice.toFixed(0)}）`;
    suggestions.push("建议检查价格是否准确");
  } else if (diffPercent > 5) {
    severity = "info";
    score = 85;
    message = `价格略有差异（¥${calculatedTotal.toFixed(0)} vs 标注¥${statedPrice.toFixed(0)}）`;
  }

  return {
    id: "price-consistency",
    name: "价格构成一致性",
    description: "检查价格构成与预计总价是否一致",
    severity,
    score,
    maxScore: 100,
    message,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

export function checkLensAreaOcclusion(
  elements: CanvasElement[],
  phoneModel: PhoneModel | undefined
): QualityCheckItem {
  let severity: QualityCheckItem["severity"] = "pass";
  let score = 100;
  let message = "镜头区域无遮挡";
  const suggestions: string[] = [];

  if (!phoneModel) {
    severity = "info";
    score = 80;
    message = "无法获取机型信息，跳过镜头区域检查";
    return {
      id: "lens-area-occlusion",
      name: "镜头区域遮挡风险",
      description: "检查素材是否遮挡镜头区域",
      severity,
      score,
      maxScore: 100,
      message,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
  }

  const cameraArea = phoneModel.cameraArea;
  const lensRingElements = elements.filter((e) => e.type === "lens-ring");
  const otherElements = elements.filter((e) => e.type !== "lens-ring");

  let occlusionCount = 0;
  otherElements.forEach((el) => {
    const elRight = el.x + el.width * el.scale;
    const elBottom = el.y + el.height * el.scale;
    const camRight = cameraArea.x + cameraArea.width;
    const camBottom = cameraArea.y + cameraArea.height;

    const hasOverlap =
      el.x < camRight &&
      elRight > cameraArea.x &&
      el.y < camBottom &&
      elBottom > cameraArea.y;

    if (hasOverlap) {
      occlusionCount++;
    }
  });

  if (occlusionCount > 0) {
    severity = "warning";
    score = Math.max(40, 100 - occlusionCount * 20);
    message = `有 ${occlusionCount} 个素材可能遮挡镜头区域`;
    suggestions.push("建议调整素材位置，避免遮挡镜头和传感器区域");
  }

  if (lensRingElements.length === 0 && otherElements.length > 2) {
    severity = severity === "pass" ? "info" : severity;
    score = Math.min(score, 85);
    suggestions.push("可以考虑添加镜头圈装饰来丰富镜头区域");
  }

  if (lensRingElements.length > 1) {
    severity = "warning";
    score = Math.min(score, 60);
    message = "存在多个镜头圈元素";
    suggestions.push("建议只保留一个镜头圈元素");
  }

  return {
    id: "lens-area-occlusion",
    name: "镜头区域遮挡风险",
    description: "检查素材是否遮挡镜头区域",
    severity,
    score,
    maxScore: 100,
    message,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

export function checkCrossSceneReuseRate(
  sceneBreakdowns: InspirationSceneBreakdown[]
): QualityCheckItem {
  let severity: QualityCheckItem["severity"] = "pass";
  let score = 100;
  let message = "跨场景素材复用率合理";
  const suggestions: string[] = [];

  if (sceneBreakdowns.length <= 1) {
    severity = "info";
    score = 70;
    message = "单场景方案，不涉及跨场景复用";
    return {
      id: "cross-scene-reuse",
      name: "跨场景素材复用率",
      description: "检查场景组中素材的跨场景复用情况",
      severity,
      score,
      maxScore: 100,
      message,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
  }

  const allAssetIds = new Map<string, number>();
  let totalAssets = 0;

  sceneBreakdowns.forEach((scene) => {
    const sceneAssetIds = new Set<string>();
    scene.elements.forEach((el) => {
      if (el.assetId) {
        sceneAssetIds.add(el.assetId);
      }
    });
    sceneAssetIds.forEach((id) => {
      allAssetIds.set(id, (allAssetIds.get(id) || 0) + 1);
      totalAssets++;
    });
  });

  const reusedAssets = Array.from(allAssetIds.values()).filter(
    (count) => count > 1
  ).length;
  const uniqueAssets = allAssetIds.size;
  const reuseRate = uniqueAssets > 0 ? reusedAssets / uniqueAssets : 0;

  if (reuseRate < 0.2 && uniqueAssets > 5) {
    severity = "info";
    score = 65;
    message = `跨场景素材复用率较低（${Math.round(reuseRate * 100)}%）`;
    suggestions.push("适当增加素材复用可以降低整体成本");
  } else if (reuseRate > 0.8) {
    severity = "warning";
    score = 70;
    message = `跨场景素材复用率过高（${Math.round(reuseRate * 100)}%）`;
    suggestions.push("场景间差异较小，建议增加每个场景的独特性");
  } else {
    message = `跨场景素材复用率为 ${Math.round(reuseRate * 100)}%，较为合理`;
  }

  return {
    id: "cross-scene-reuse",
    name: "跨场景素材复用率",
    description: "检查场景组中素材的跨场景复用情况",
    severity,
    score,
    maxScore: 100,
    message,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

export function checkTagSceneMatch(
  styleTags: ProjectTag[],
  sceneTypeTags: SceneType[]
): QualityCheckItem {
  let severity: QualityCheckItem["severity"] = "pass";
  let score = 100;
  let message = "标签与场景类型匹配度良好";
  const suggestions: string[] = [];

  if (styleTags.length === 0) {
    severity = "warning";
    score = 50;
    message = "缺少风格标签";
    suggestions.push("建议添加至少1-2个风格标签");
  }

  if (sceneTypeTags.length === 0) {
    severity = "warning";
    score = Math.min(score, 50);
    message = "缺少场景类型标签";
    suggestions.push("建议选择适用的场景类型");
  }

  if (styleTags.length > 0 && sceneTypeTags.length > 0) {
    let matchCount = 0;
    sceneTypeTags.forEach((sceneType) => {
      const relatedTags = SCENE_TAG_MAPPING[sceneType] || [];
      styleTags.forEach((tag) => {
        if (relatedTags.includes(tag)) {
          matchCount++;
        }
      });
    });

    const maxMatches = sceneTypeTags.length * styleTags.length;
    const matchRate = maxMatches > 0 ? matchCount / maxMatches : 0;

    if (matchRate === 0) {
      severity = "warning";
      score = Math.min(score, 55);
      message = "标签与场景类型匹配度较低";
      suggestions.push("建议选择与场景风格更相符的标签");
    } else if (matchRate < 0.3) {
      severity = "info";
      score = Math.min(score, 80);
      message = "标签与场景类型匹配度一般";
    } else {
      message = `标签与场景类型匹配度良好（${Math.round(matchRate * 100)}%）`;
    }
  }

  if (styleTags.length > 4) {
    severity = severity === "pass" ? "info" : severity;
    score = Math.min(score, 85);
    suggestions.push("建议标签数量控制在1-4个，保持标签精准");
  }

  return {
    id: "tag-scene-match",
    name: "标签与场景匹配度",
    description: "检查风格标签与场景类型的匹配程度",
    severity,
    score,
    maxScore: 100,
    message,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

export function runQualityCheck(params: {
  thumbnail?: string;
  elements: CanvasElement[];
  phoneModelId: string;
  caseTemplate: CaseTemplate;
  phoneModels: PhoneModel[];
  statedPrice: number;
  sceneBreakdowns?: InspirationSceneBreakdown[];
  styleTags: ProjectTag[];
  sceneTypeTags: SceneType[];
}): QualityCheckResult {
  const {
    thumbnail,
    elements,
    phoneModelId,
    caseTemplate,
    phoneModels,
    statedPrice,
    sceneBreakdowns = [],
    styleTags,
    sceneTypeTags,
  } = params;

  const phoneModel = phoneModels.find((m) => m.id === phoneModelId);

  const checks: QualityCheckItem[] = [
    checkThumbnailIntegrity(thumbnail, elements),
    checkPhoneCaseConsistency(phoneModelId, caseTemplate, phoneModels),
    checkMaterialReadability(elements),
    checkPriceConsistency(elements, caseTemplate, statedPrice),
    checkLensAreaOcclusion(elements, phoneModel),
    checkCrossSceneReuseRate(sceneBreakdowns),
    checkTagSceneMatch(styleTags, sceneTypeTags),
  ];

  const totalScore = checks.reduce((sum, check) => sum + check.score, 0);
  const maxScore = checks.reduce((sum, check) => sum + check.maxScore, 0);
  const overallScore = Math.round(totalScore / checks.length);

  let grade: QualityCheckResult["grade"] = "good";
  if (overallScore >= 90) grade = "excellent";
  else if (overallScore >= 75) grade = "good";
  else if (overallScore >= 60) grade = "fair";
  else grade = "poor";

  const errors = checks.filter((c) => c.severity === "error");
  const warnings = checks.filter((c) => c.severity === "warning");
  const canPublish = errors.length === 0;

  return {
    overallScore,
    maxScore,
    grade,
    checks,
    canPublish,
    warnings,
    errors,
  };
}

export function getGradeColor(grade: QualityCheckResult["grade"]): string {
  switch (grade) {
    case "excellent":
      return "#10b981";
    case "good":
      return "#667eea";
    case "fair":
      return "#f59e0b";
    case "poor":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

export function getGradeText(grade: QualityCheckResult["grade"]): string {
  switch (grade) {
    case "excellent":
      return "优秀";
    case "good":
      return "良好";
    case "fair":
      return "一般";
    case "poor":
      return "较差";
    default:
      return "未知";
  }
}

export function getSeverityColor(severity: QualityCheckItem["severity"]): string {
  switch (severity) {
    case "pass":
      return "#10b981";
    case "warning":
      return "#f59e0b";
    case "error":
      return "#ef4444";
    case "info":
      return "#667eea";
    default:
      return "#6b7280";
  }
}

export function getSeverityText(severity: QualityCheckItem["severity"]): string {
  switch (severity) {
    case "pass":
      return "通过";
    case "warning":
      return "警告";
    case "error":
      return "错误";
    case "info":
      return "提示";
    default:
      return "未知";
  }
}
