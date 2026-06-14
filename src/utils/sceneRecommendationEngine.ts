import type {
  PhoneModel,
  CaseTemplate,
  CanvasElement,
  ProjectTag,
  SceneType,
  ScenePlan,
  SceneGroup,
  SceneCombo,
  SceneComboScore,
  Asset,
} from "@/types";
import { assets } from "@/data/assets";
import { generateId } from "./idGenerator";
import { generateShoppingList, calculateTotal } from "./shoppingList";

const SCENE_TAG_MAP: Record<SceneType, ProjectTag[]> = {
  "通勤": ["通勤", "极简"],
  "约会": ["可爱", "文艺"],
  "节日": ["节日", "可爱"],
  "旅行": ["文艺", "炫酷"],
  "礼物": ["可爱", "节日"],
};

const SCENE_CASE_MAP: Record<SceneType, CaseTemplate> = {
  "通勤": "solid",
  "约会": "transparent",
  "节日": "mirror",
  "旅行": "transparent",
  "礼物": "solid",
};

const SCENE_COLOR_MAP: Record<SceneType, string> = {
  "通勤": "#667eea",
  "约会": "#f093fb",
  "节日": "#ff6b6b",
  "旅行": "#4ecdc4",
  "礼物": "#ffd93d",
};

const SCENE_COLOR_ALT_MAP: Record<SceneType, string[]> = {
  "通勤": ["#667eea", "#4a6cf7", "#8b9dc3"],
  "约会": ["#f093fb", "#ff6b9d", "#e8a0bf"],
  "节日": ["#ff6b6b", "#ff4757", "#ffa502"],
  "旅行": ["#4ecdc4", "#2ed573", "#7bed9f"],
  "礼物": ["#ffd93d", "#ffb142", "#ff6348"],
};

const SCENE_LAYOUT_MAP: Record<SceneType, "centered" | "scattered" | "corner" | "minimal"> = {
  "通勤": "minimal",
  "约会": "centered",
  "节日": "scattered",
  "旅行": "corner",
  "礼物": "centered",
};

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function isInCameraArea(
  x: number,
  y: number,
  width: number,
  height: number,
  phoneModel: PhoneModel
): boolean {
  const { cameraArea } = phoneModel;
  const padding = 5;
  const elemLeft = (x / 100) * phoneModel.width - width / 2 + padding;
  const elemRight = (x / 100) * phoneModel.width + width / 2 - padding;
  const elemTop = (y / 100) * phoneModel.height - height / 2 + padding;
  const elemBottom = (y / 100) * phoneModel.height + height / 2 - padding;
  const camLeft = cameraArea.x;
  const camRight = cameraArea.x + cameraArea.width;
  const camTop = cameraArea.y;
  const camBottom = cameraArea.y + cameraArea.height;
  return !(elemRight < camLeft || elemLeft > camRight || elemBottom < camTop || elemTop > camBottom);
}

function checkElementOcclusion(
  x: number,
  y: number,
  width: number,
  height: number,
  existingElements: CanvasElement[],
  phoneModel: PhoneModel
): boolean {
  const elemLeft = (x / 100) * phoneModel.width - width / 2;
  const elemRight = (x / 100) * phoneModel.width + width / 2;
  const elemTop = (y / 100) * phoneModel.height - height / 2;
  const elemBottom = (y / 100) * phoneModel.height + height / 2;

  for (const el of existingElements) {
    if (el.type === "lens-ring") continue;
    const elLeft = (el.x / 100) * phoneModel.width - el.width / 2;
    const elRight = (el.x / 100) * phoneModel.width + el.width / 2;
    const elTop = (el.y / 100) * phoneModel.height - el.height / 2;
    const elBottom = (el.y / 100) * phoneModel.height + el.height / 2;
    const overlapX = elemRight > elLeft + 10 && elemLeft < elRight - 10;
    const overlapY = elemBottom > elTop + 10 && elemTop < elBottom - 10;
    if (overlapX && overlapY) return true;
  }
  return false;
}

function generatePosition(
  layout: "centered" | "scattered" | "corner" | "minimal",
  phoneModel: PhoneModel,
  elementWidth: number,
  elementHeight: number,
  index: number,
  total: number,
  existingElements: CanvasElement[] = []
): { x: number; y: number } {
  let x = 50, y = 50;
  for (let attempt = 0; attempt < 50; attempt++) {
    switch (layout) {
      case "centered": {
        const angle = (index / total) * Math.PI * 2 + attempt * 0.3;
        const radius = 15 + attempt * 2;
        x = 50 + Math.cos(angle) * radius;
        y = 45 + Math.sin(angle) * radius;
        break;
      }
      case "scattered": {
        x = 15 + Math.random() * 70;
        y = 20 + Math.random() * 60;
        break;
      }
      case "corner": {
        const corner = index % 4;
        const corners = [
          { x: 25, y: 30 },
          { x: 75, y: 30 },
          { x: 25, y: 70 },
          { x: 75, y: 70 },
        ];
        const base = corners[corner];
        x = base.x + (Math.random() - 0.5) * 20;
        y = base.y + (Math.random() - 0.5) * 20;
        break;
      }
      case "minimal": {
        x = 50 + (Math.random() - 0.5) * 20;
        y = 50 + (Math.random() - 0.5) * 20;
        break;
      }
    }
    x = Math.max(10, Math.min(90, x));
    y = Math.max(15, Math.min(85, y));
    const inCamera = isInCameraArea(x, y, elementWidth, elementHeight, phoneModel);
    const occludes = checkElementOcclusion(x, y, elementWidth, elementHeight, existingElements, phoneModel);
    if (!inCamera && !occludes) break;
  }
  return { x, y };
}

function generateSceneElements(
  sceneType: SceneType,
  phoneModel: PhoneModel,
  existingAssetIds: Set<string>,
  focus: "balanced" | "budget" | "style" | "reuse" | "lens-safe" = "balanced",
  reuseAssetIds: Set<string> = new Set()
): CanvasElement[] {
  const tags = SCENE_TAG_MAP[sceneType];
  const layout = SCENE_LAYOUT_MAP[sceneType];
  let countRange: [number, number];
  if (focus === "budget") {
    countRange = [1, 3];
  } else if (focus === "style") {
    countRange = [4, 8];
  } else if (focus === "lens-safe") {
    countRange = [2, 4];
  } else {
    countRange = sceneType === "通勤" ? [2, 4] : sceneType === "节日" ? [5, 8] : [3, 6];
  }
  const count = Math.floor(getRandomRange(countRange[0], countRange[1]));

  let availableAssets = assets.filter(
    (a) => tags.some((tag) => a.category === tag) && a.type !== "lens-ring"
  );
  const pool = availableAssets.length > 0 ? availableAssets : assets.filter((a) => a.type === "sticker");

  let selectedPool: Asset[];
  if (focus === "reuse" && reuseAssetIds.size > 0) {
    const reusable = pool.filter((a) => reuseAssetIds.has(a.id));
    selectedPool = reusable.length >= count ? reusable : [...reusable, ...pool.filter((a) => !reuseAssetIds.has(a.id))];
  } else {
    const unused = pool.filter((a) => !existingAssetIds.has(a.id));
    selectedPool = unused.length >= count ? unused : pool;
  }

  const shuffled = [...selectedPool].sort(() => Math.random() - 0.5);
  const selected: Asset[] = shuffled.slice(0, Math.min(count, shuffled.length));

  const elements: CanvasElement[] = [];
  let zIndex = 0;

  selected.forEach((asset, index) => {
    const sizeMult = focus === "budget" ? getRandomRange(0.6, 0.9) : getRandomRange(0.7, 1.2);
    const width = asset.defaultWidth * sizeMult;
    const height = asset.defaultHeight * sizeMult;
    const { x, y } = generatePosition(layout, phoneModel, width, height, index, selected.length, elements);

    elements.push({
      id: generateId(),
      type: asset.type as CanvasElement["type"],
      assetId: asset.id,
      x,
      y,
      width,
      height,
      rotation: getRandomRange(-10, 10),
      opacity: 1,
      zIndex: zIndex++,
      scale: 1,
    });
    existingAssetIds.add(asset.id);
  });

  const lensRingAssets = assets.filter((a) => a.type === "lens-ring");
  if (lensRingAssets.length > 0) {
    const lensRing = getRandomItem(lensRingAssets);
    const { cameraArea } = phoneModel;
    const centerX = ((cameraArea.x + cameraArea.width / 2) / phoneModel.width) * 100;
    const centerY = ((cameraArea.y + cameraArea.height / 2) / phoneModel.height) * 100;
    const lensSize = cameraArea.width * 1.1;

    elements.push({
      id: generateId(),
      type: "lens-ring",
      assetId: lensRing.id,
      x: centerX,
      y: centerY,
      width: lensSize,
      height: lensSize,
      rotation: 0,
      opacity: 1,
      zIndex: zIndex++,
      scale: 1,
    });
  }

  return elements;
}

function buildScenePlan(
  sceneType: SceneType,
  phoneModel: PhoneModel,
  existingAssetIds: Set<string>,
  budgetLimit: number,
  focus: "balanced" | "budget" | "style" | "reuse" | "lens-safe" = "balanced",
  reuseAssetIds: Set<string> = new Set(),
  colorVariant: number = 0
): ScenePlan {
  const elements = generateSceneElements(sceneType, phoneModel, existingAssetIds, focus, reuseAssetIds);
  const caseTemplate = SCENE_CASE_MAP[sceneType];
  const altColors = SCENE_COLOR_ALT_MAP[sceneType];
  const caseColor = altColors[colorVariant % altColors.length] || SCENE_COLOR_MAP[sceneType];
  const tags = [...SCENE_TAG_MAP[sceneType]];

  return {
    id: generateId(),
    sceneType,
    caseTemplate,
    caseColor,
    elements,
    lensRingAssetId: elements.find((e) => e.type === "lens-ring")?.assetId,
    textLabels: [],
    budgetLimit,
    tags,
  };
}

function calculateReuseRate(scenes: ScenePlan[]): number {
  const allAssetIds: string[] = [];
  scenes.forEach((s) => {
    s.elements.forEach((e) => {
      if (e.assetId) allAssetIds.push(e.assetId);
    });
  });
  const uniqueIds = new Set(allAssetIds);
  if (uniqueIds.size === 0) return 0;
  return (1 - (allAssetIds.length - uniqueIds.size) / allAssetIds.length) * 100;
}

function calculateStyleCoverage(scenes: ScenePlan[]): number {
  const allTags = new Set<ProjectTag>();
  scenes.forEach((s) => s.tags.forEach((t) => allTags.add(t)));
  const totalStyles: ProjectTag[] = ["通勤", "可爱", "极简", "节日", "炫酷", "文艺"];
  return (allTags.size / totalStyles.length) * 100;
}

function calculateLensAvoidance(scenes: ScenePlan[], phoneModel: PhoneModel): number {
  let totalElements = 0;
  let violatingElements = 0;
  scenes.forEach((s) => {
    s.elements.forEach((e) => {
      if (e.type === "lens-ring") return;
      totalElements++;
      if (isInCameraArea(e.x, e.y, e.width, e.height, phoneModel)) {
        violatingElements++;
      }
    });
  });
  if (totalElements === 0) return 100;
  return ((totalElements - violatingElements) / totalElements) * 100;
}

function calculateColorHarmony(scenes: ScenePlan[]): number {
  const colors = scenes.map((s) => s.caseColor);
  const uniqueColors = new Set(colors);

  let harmonyBonus = 0;
  const colorValues = [...uniqueColors].map((c) => {
    const hex = c.replace("#", "");
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
  });

  if (colorValues.length >= 2) {
    let totalHueDiff = 0;
    let pairs = 0;
    for (let i = 0; i < colorValues.length; i++) {
      for (let j = i + 1; j < colorValues.length; j++) {
        const hue1 = (Math.atan2(colorValues[i].g - colorValues[i].b, colorValues[i].r - colorValues[i].g) * 180) / Math.PI;
        const hue2 = (Math.atan2(colorValues[j].g - colorValues[j].b, colorValues[j].r - colorValues[j].g) * 180) / Math.PI;
        let diff = Math.abs(hue1 - hue2);
        if (diff > 180) diff = 360 - diff;
        totalHueDiff += diff;
        pairs++;
      }
    }
    const avgHueDiff = pairs > 0 ? totalHueDiff / pairs : 0;
    if (avgHueDiff < 30) harmonyBonus = 15;
    else if (avgHueDiff > 60 && avgHueDiff < 120) harmonyBonus = 10;
    else if (avgHueDiff > 150 && avgHueDiff < 210) harmonyBonus = 15;
  }

  if (uniqueColors.size <= 1) return Math.min(100, 90 + harmonyBonus);
  if (uniqueColors.size <= 2) return Math.min(100, 75 + harmonyBonus);
  if (uniqueColors.size <= 3) return Math.min(100, 65 + harmonyBonus);
  return Math.min(100, 50 + harmonyBonus);
}

function calculateShoppingListDiff(scenes: ScenePlan[]): number {
  const lists = scenes.map((s) => {
    const items = generateShoppingList(s.elements, s.caseTemplate);
    return new Set(items.map((i) => i.name));
  });
  if (lists.length <= 1) return 100;

  const commonItems = new Set([...lists[0]]);
  for (let i = 1; i < lists.length; i++) {
    const currentSet = new Set([...lists[i]]);
    for (const item of commonItems) {
      if (!currentSet.has(item)) commonItems.delete(item);
    }
  }

  const totalUniqueItems = new Set(lists.flatMap((l) => [...l]));
  if (totalUniqueItems.size === 0) return 50;
  const reuseRatio = commonItems.size / totalUniqueItems.size;
  return Math.min(100, reuseRatio * 150);
}

function calculateComboScore(
  scenes: ScenePlan[],
  phoneModel: PhoneModel
): SceneComboScore {
  let totalPrice = 0;
  scenes.forEach((s) => {
    const items = generateShoppingList(s.elements, s.caseTemplate);
    totalPrice += calculateTotal(items);
  });

  const reuseRate = calculateReuseRate(scenes);
  const styleCoverage = calculateStyleCoverage(scenes);
  const lensAvoidance = calculateLensAvoidance(scenes, phoneModel);
  const colorHarmony = calculateColorHarmony(scenes);
  const shoppingListDiff = calculateShoppingListDiff(scenes);

  const priceScore = Math.max(0, 100 - totalPrice / 5);
  const overall =
    priceScore * 0.2 +
    reuseRate * 0.2 +
    styleCoverage * 0.15 +
    lensAvoidance * 0.2 +
    colorHarmony * 0.15 +
    shoppingListDiff * 0.1;

  return {
    totalPrice: Math.round(totalPrice * 100) / 100,
    reuseRate: Math.round(reuseRate * 10) / 10,
    styleCoverage: Math.round(styleCoverage * 10) / 10,
    lensAvoidance: Math.round(lensAvoidance * 10) / 10,
    colorHarmony: Math.round(colorHarmony * 10) / 10,
    shoppingListDiff: Math.round(shoppingListDiff * 10) / 10,
    overall: Math.round(overall * 10) / 10,
  };
}

const COMBO_NAMES = [
  "全能均衡组",
  "高性价比组",
  "风格多样组",
  "镜头无忧组",
  "色彩协调组",
];

const COMBO_DESCRIPTIONS: Record<string, string> = {
  "全能均衡组": "总价、复用率与风格覆盖均衡分配",
  "高性价比组": "精选少量素材，预算更省",
  "风格多样组": "覆盖更多风格标签，搭配丰富",
  "镜头无忧组": "所有元素避开镜头区域",
  "色彩协调组": "配色和谐统一，视觉舒适",
};

export function getComboDescription(name: string): string {
  return COMBO_DESCRIPTIONS[name] || "";
}

export function generateSceneCombos(
  group: SceneGroup,
  phoneModel: PhoneModel
): SceneCombo[] {
  const sceneTypes: SceneType[] = ["通勤", "约会", "节日", "旅行", "礼物"];
  const existingSceneTypes = new Set(group.scenes.map((s) => s.sceneType));
  const targetTypes = sceneTypes.filter((t) => !existingSceneTypes.has(t));

  const existingAssetIds = new Set<string>();
  group.scenes.forEach((s) =>
    s.elements.forEach((e) => {
      if (e.assetId) existingAssetIds.add(e.assetId);
    })
  );

  if (targetTypes.length === 0 && group.scenes.length === 0) {
    return generateCombosForTypes(sceneTypes, phoneModel);
  }

  if (group.scenes.length > 0) {
    return generateCombosWithExisting(group.scenes, targetTypes, phoneModel, existingAssetIds);
  }

  return generateCombosForTypes(targetTypes.length >= 3 ? targetTypes : sceneTypes, phoneModel);
}

function generateCombosForTypes(
  types: SceneType[],
  phoneModel: PhoneModel
): SceneCombo[] {
  const combos: SceneCombo[] = [];
  const strategies: { name: string; selectCount: number; focus: "balanced" | "budget" | "style" | "reuse" | "lens-safe"; colorVariant: number }[] = [
    { name: "全能均衡组", selectCount: Math.min(5, types.length), focus: "balanced", colorVariant: 0 },
    { name: "高性价比组", selectCount: Math.min(4, types.length), focus: "budget", colorVariant: 1 },
    { name: "风格多样组", selectCount: Math.min(5, types.length), focus: "style", colorVariant: 2 },
    { name: "镜头无忧组", selectCount: Math.min(5, types.length), focus: "lens-safe", colorVariant: 0 },
    { name: "色彩协调组", selectCount: Math.min(4, types.length), focus: "balanced", colorVariant: 0 },
  ];

  strategies.forEach((strategy) => {
    const selectedTypes = types.slice(0, strategy.selectCount);
    const assetIds = new Set<string>();
    const reuseIds = new Set<string>();
    const budget = strategy.focus === "budget" ? 60 : strategy.focus === "style" ? 150 : 120;
    const scenes: ScenePlan[] = selectedTypes.map((sceneType) =>
      buildScenePlan(sceneType, phoneModel, assetIds, budget, strategy.focus, reuseIds, strategy.colorVariant)
    );

    const score = calculateComboScore(scenes, phoneModel);
    combos.push({
      id: generateId(),
      name: strategy.name,
      scenes,
      score,
    });
  });

  return combos.sort((a, b) => b.score.overall - a.score.overall);
}

function generateCombosWithExisting(
  existingPlans: ScenePlan[],
  targetTypes: SceneType[],
  phoneModel: PhoneModel,
  existingAssetIds: Set<string>
): SceneCombo[] {
  const combos: SceneCombo[] = [];
  const strategies: { name: string; focus: "balanced" | "budget" | "style" | "reuse" | "lens-safe"; colorVariant: number }[] = [
    { name: "基于现有扩展组", focus: "balanced", colorVariant: 0 },
    { name: "高复用率组", focus: "reuse", colorVariant: 1 },
    { name: "风格补充组", focus: "style", colorVariant: 2 },
    { name: "镜头无忧扩展组", focus: "lens-safe", colorVariant: 0 },
    { name: "预算友好扩展组", focus: "budget", colorVariant: 1 },
  ];

  strategies.forEach((strategy) => {
    const assetIds = new Set(existingAssetIds);
    const reuseIds = new Set(existingAssetIds);
    const budget = strategy.focus === "budget" ? 60 : strategy.focus === "style" ? 150 : 100;

    const newScenes: ScenePlan[] = targetTypes.map((sceneType) =>
      buildScenePlan(sceneType, phoneModel, assetIds, budget, strategy.focus, reuseIds, strategy.colorVariant)
    );

    const allScenes = [...existingPlans.map((p) => ({ ...p, id: generateId(), elements: p.elements.map((e) => ({ ...e, id: generateId() })) })), ...newScenes];
    const score = calculateComboScore(allScenes, phoneModel);

    combos.push({
      id: generateId(),
      name: strategy.name,
      scenes: allScenes,
      score,
    });
  });

  return combos.sort((a, b) => b.score.overall - a.score.overall);
}
