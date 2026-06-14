import type {
  ReplicationComparison,
  ReplicationComparisonField,
  InspirationCard,
  CanvasElement,
  CaseTemplate,
  ProjectTag,
  ShoppingItem,
} from "@/types";
import { generateShoppingList, calculateTotal } from "./shoppingList";
import { assets } from "@/data/assets";

function compareField<T>(
  original: T,
  current: T,
  willPreserve: boolean,
  isEqual?: (a: T, b: T) => boolean,
  note?: string
): ReplicationComparisonField<T> {
  const isSame = isEqual
    ? isEqual(original, current)
    : JSON.stringify(original) === JSON.stringify(current);

  return {
    original,
    current,
    isSame,
    willPreserve,
    note,
  };
}

function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

export function generateReplicationComparison(params: {
  card: InspirationCard;
  currentElements: CanvasElement[];
  currentCaseTemplate: CaseTemplate;
  currentCaseColor: string;
  currentPhoneModel: string;
  currentTags: ProjectTag[];
  currentSceneCount: number;
}): ReplicationComparison {
  const {
    card,
    currentElements,
    currentCaseTemplate,
    currentCaseColor,
    currentPhoneModel,
    currentTags,
    currentSceneCount,
  } = params;

  const cardElements =
    card.type === "single"
      ? card.elements
      : card.sceneBreakdowns.flatMap((s) => s.elements);

  const cardAssetCount = cardElements.filter((e) => e.assetId).length;
  const currentAssetCount = currentElements.filter((e) => e.assetId).length;

  const cardItems = generateShoppingList(cardElements, card.caseTemplate);
  const cardPrice = calculateTotal(cardItems);
  const currentItems = generateShoppingList(currentElements, currentCaseTemplate);
  const currentPrice = calculateTotal(currentItems);

  const cardItemNames = cardItems.map((i) => i.name);
  const currentItemNames = currentItems.map((i) => i.name);

  const preservedItems = cardItemNames.filter((name) =>
    currentItemNames.includes(name)
  );
  const newItems = currentItemNames.filter(
    (name) => !cardItemNames.includes(name)
  );
  const removedItems = cardItemNames.filter(
    (name) => !currentItemNames.includes(name)
  );

  const firstBreakdown = card.sceneBreakdowns[0];
  const cardCaseColor = firstBreakdown?.caseColor || "#FFFFFF";

  const preservedInfo: string[] = [];
  const changedInfo: string[] = [];

  preservedInfo.push("原方案的风格标签将被完整保留");
  preservedInfo.push("原方案的素材名称和价格明细将完整保留");
  preservedInfo.push("将生成新的方案名称（原名称 + '复刻'后缀）");

  if (card.phoneModel !== currentPhoneModel) {
    changedInfo.push("机型将随当前画布环境变化");
  } else {
    preservedInfo.push("机型与当前画布一致，将保持不变");
  }

  if (card.caseTemplate !== currentCaseTemplate) {
    changedInfo.push("壳模板将随当前画布环境变化");
  } else {
    preservedInfo.push("壳模板与当前画布一致，将保持不变");
  }

  const phoneModel = compareField(
    card.phoneModel,
    currentPhoneModel,
    false,
    undefined,
    "复刻后将使用当前画布的机型"
  );

  const caseTemplate = compareField(
    card.caseTemplate,
    currentCaseTemplate,
    false,
    undefined,
    "复刻后将使用当前画布的壳模板"
  );

  const caseColor = compareField(
    cardCaseColor,
    currentCaseColor,
    false,
    undefined,
    "复刻后将使用当前画布的壳颜色"
  );

  const assetCount = compareField(
    cardAssetCount,
    currentAssetCount,
    false,
    undefined,
    "素材数量将随当前画布变化"
  );

  const estimatedPrice = compareField(
    cardPrice,
    currentPrice,
    false,
    undefined,
    "预计价格将随当前画布变化"
  );

  const styleTags = compareField(
    card.styleTags,
    currentTags,
    true,
    arraysEqual,
    "复刻后将保留原方案的风格标签"
  );

  const sceneCount = compareField(
    card.sceneCount,
    currentSceneCount,
    false,
    undefined,
    "场景数量将随复刻方式变化"
  );

  return {
    phoneModel,
    caseTemplate,
    caseColor,
    assetCount,
    estimatedPrice,
    styleTags,
    sceneCount,
    shoppingListDiff: {
      preservedItems,
      newItems,
      removedItems,
    },
    preservedInfo,
    changedInfo,
  };
}

export function getElementName(element: CanvasElement): string {
  if (element.type === "text" && element.content) {
    return `文字: ${element.content}`;
  }
  if (element.assetId) {
    const asset = assets.find((a) => a.id === element.assetId);
    if (asset) return asset.name;
  }
  return element.type;
}

export function formatCaseTemplate(template: CaseTemplate): string {
  const map: Record<CaseTemplate, string> = {
    transparent: "透明壳",
    solid: "纯色壳",
    mirror: "镜面壳",
  };
  return map[template] || template;
}
