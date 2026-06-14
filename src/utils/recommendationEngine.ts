import type {
  PhoneModel,
  CaseTemplate,
  CanvasElement,
  ProjectTag,
  RecommendationScheme,
  RecommendationStyle,
  Asset,
} from "@/types";
import { assets } from "@/data/assets";
import { generateId } from "./idGenerator";
import { generateShoppingList, calculateTotal } from "./shoppingList";

interface StyleConfig {
  style: RecommendationStyle;
  tags: ProjectTag[];
  layout: "centered" | "scattered" | "corner" | "symmetric" | "minimal" | "maximal";
  elementCount: [number, number];
  sizeMultiplier: [number, number];
  rotationRange: [number, number];
  preferredCategories: string[];
  colorScheme: string[];
}

const STYLE_CONFIGS: StyleConfig[] = [
  {
    style: "简约清新",
    tags: ["极简", "通勤"],
    layout: "centered",
    elementCount: [2, 4],
    sizeMultiplier: [0.8, 1.2],
    rotationRange: [-5, 5],
    preferredCategories: ["极简", "通勤"],
    colorScheme: ["#A8EDEA", "#B5EAD7", "#C7CEEA"],
  },
  {
    style: "活力可爱",
    tags: ["可爱", "节日"],
    layout: "scattered",
    elementCount: [5, 8],
    sizeMultiplier: [0.6, 1.0],
    rotationRange: [-15, 15],
    preferredCategories: ["可爱", "节日"],
    colorScheme: ["#FFB7B2", "#FFDAC1", "#E2F0CB"],
  },
  {
    style: "潮流炫酷",
    tags: ["炫酷", "文艺"],
    layout: "corner",
    elementCount: [3, 6],
    sizeMultiplier: [0.9, 1.3],
    rotationRange: [-10, 10],
    preferredCategories: ["炫酷", "文艺"],
    colorScheme: ["#667eea", "#764ba2", "#f093fb"],
  },
];

interface GenerateRecommendationsInput {
  phoneModel: PhoneModel;
  caseTemplate: CaseTemplate;
  caseColor: string;
  existingElements: CanvasElement[];
  projectTags: ProjectTag[];
}

function getAssetsByCategory(category: string): Asset[] {
  return assets.filter((a) => a.category === category && a.type !== "lens-ring");
}

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

  return !(
    elemRight < camLeft ||
    elemLeft > camRight ||
    elemBottom < camTop ||
    elemTop > camBottom
  );
}

function generatePosition(
  index: number,
  total: number,
  layout: StyleConfig["layout"],
  phoneModel: PhoneModel,
  elementWidth: number,
  elementHeight: number,
  maxAttempts: number = 50
): { x: number; y: number } {
  let x = 50;
  let y = 50;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
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
      case "symmetric": {
        const side = index % 2 === 0 ? -1 : 1;
        const row = Math.floor(index / 2);
        x = 50 + side * (20 + attempt * 2);
        y = 35 + row * 25 + (Math.random() - 0.5) * 10;
        break;
      }
      case "minimal": {
        x = 50 + (Math.random() - 0.5) * 20;
        y = 50 + (Math.random() - 0.5) * 20;
        break;
      }
      case "maximal": {
        x = 10 + Math.random() * 80;
        y = 15 + Math.random() * 70;
        break;
      }
    }

    x = Math.max(10, Math.min(90, x));
    y = Math.max(15, Math.min(85, y));

    if (!isInCameraArea(x, y, elementWidth, elementHeight, phoneModel)) {
      break;
    }
  }

  return { x, y };
}

function pickStyleConfigs(
  projectTags: ProjectTag[],
  existingElements: CanvasElement[]
): StyleConfig[] {
  const existingCategories = new Set(
    existingElements
      .map((el) => {
        const asset = assets.find((a) => a.id === el.assetId);
        return asset?.category;
      })
      .filter(Boolean)
  );

  const scoredConfigs = STYLE_CONFIGS.map((config) => {
    let score = Math.random() * 0.5;

    projectTags.forEach((tag) => {
      if (config.tags.includes(tag)) {
        score += 2;
      }
    });

    existingCategories.forEach((cat) => {
      if (cat && config.preferredCategories.includes(cat)) {
        score += 1;
      }
    });

    return { config, score };
  });

  scoredConfigs.sort((a, b) => b.score - a.score);

  return scoredConfigs.map((s) => s.config);
}

function generateElementsForStyle(
  config: StyleConfig,
  phoneModel: PhoneModel,
  existingElements: CanvasElement[]
): CanvasElement[] {
  const elements: CanvasElement[] = [];
  const [minCount, maxCount] = config.elementCount;
  const count = Math.floor(getRandomRange(minCount, maxCount));

  const availableAssets: Asset[] = [];
  config.preferredCategories.forEach((cat) => {
    availableAssets.push(...getAssetsByCategory(cat));
  });

  if (availableAssets.length === 0) {
    availableAssets.push(...assets.filter((a) => a.type === "sticker"));
  }

  const usedAssetIds = new Set(
    existingElements.filter((e) => e.assetId).map((e) => e.assetId)
  );
  const unusedAssets = availableAssets.filter((a) => !usedAssetIds.has(a.id));
  const pool = unusedAssets.length > 0 ? unusedAssets : availableAssets;

  const selectedAssets: Asset[] = [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    selectedAssets.push(shuffled[i]);
  }

  let zIndex = existingElements.length;

  selectedAssets.forEach((asset, index) => {
    const [minSize, maxSize] = config.sizeMultiplier;
    const sizeMult = getRandomRange(minSize, maxSize);
    const [minRot, maxRot] = config.rotationRange;
    const rotation = getRandomRange(minRot, maxRot);

    const width = asset.defaultWidth * sizeMult;
    const height = asset.defaultHeight * sizeMult;

    const { x, y } = generatePosition(
      index,
      selectedAssets.length,
      config.layout,
      phoneModel,
      width,
      height
    );

    elements.push({
      id: generateId(),
      type: asset.type as CanvasElement["type"],
      assetId: asset.id,
      x,
      y,
      width,
      height,
      rotation,
      opacity: 1,
      zIndex: zIndex++,
      scale: 1,
    });
  });

  if (config.layout === "corner" || Math.random() > 0.5) {
    const lensRingAssets = assets.filter((a) => a.type === "lens-ring");
    if (lensRingAssets.length > 0) {
      const lensRing = getRandomItem(lensRingAssets);
      const { cameraArea } = phoneModel;
      const centerX =
        ((cameraArea.x + cameraArea.width / 2) / phoneModel.width) * 100;
      const centerY =
        ((cameraArea.y + cameraArea.height / 2) / phoneModel.height) * 100;

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
  }

  return elements;
}

function generateSchemeReason(
  config: StyleConfig,
  phoneModel: PhoneModel,
  caseTemplate: CaseTemplate
): string {
  const reasons: Record<RecommendationStyle, string[]> = {
    简约清新: [
      `针对${phoneModel.name}的${caseTemplate === "transparent" ? "透明" : caseTemplate === "solid" ? "纯色" : "镜面"}壳，选用清新元素营造干净氛围`,
      `简约设计不遮挡${phoneModel.name}镜头区域，保持整体清爽感`,
      `精选${config.tags.join("、")}风格素材，适合日常通勤使用`,
    ],
    活力可爱: [
      `满版可爱元素搭配${phoneModel.name}，彰显个性活力`,
      `错落有致的布局避开镜头区，${config.tags.join("、")}风拉满`,
      `多种萌系素材组合，让${phoneModel.name}壳焕发青春气息`,
    ],
    潮流炫酷: [
      `大胆的色彩搭配，${config.tags.join("、")}风格尽显潮酷态度`,
      `不对称布局设计，完美适配${phoneModel.name}镜头模组`,
      `精选潮流素材，打造专属于你的${phoneModel.name}个性壳`,
    ],
    文艺复古: [
      `文艺气息扑面而来，适合${phoneModel.name}的优雅设计`,
      `复古色调与${caseTemplate === "solid" ? "纯色" : "透明"}壳的完美融合`,
      `精选文艺素材，为${phoneModel.name}增添书卷气息`,
    ],
    商务通勤: [
      `简约商务风，适配${phoneModel.name}的专业形象`,
      `低调不失品味的设计，${config.tags.join("、")}风格百搭`,
      `精选通勤素材，让${phoneModel.name}壳更显干练`,
    ],
    节日主题: [
      `节日氛围拉满，${phoneModel.name}也要过节`,
      `喜庆元素搭配${phoneModel.name}，节日仪式感满满`,
      `精选节日素材，为${phoneModel.name}换上节日盛装`,
    ],
  };

  const styleReasons = reasons[config.style] || reasons["简约清新"];
  return getRandomItem(styleReasons);
}

export function generateRecommendations(
  input: GenerateRecommendationsInput
): RecommendationScheme[] {
  const { phoneModel, caseTemplate, existingElements, projectTags } = input;

  const selectedConfigs = pickStyleConfigs(projectTags, existingElements).slice(
    0,
    3
  );

  const schemes: RecommendationScheme[] = selectedConfigs.map((config) => {
    const newElements = generateElementsForStyle(
      config,
      phoneModel,
      existingElements
    );

    const allElements = [...existingElements, ...newElements];
    const shoppingItems = generateShoppingList(allElements, caseTemplate);
    const estimatedTotal = calculateTotal(shoppingItems);

    const assetCount = allElements.filter((e) => e.assetId).length;

    return {
      id: generateId(),
      name: `${config.style}方案`,
      style: config.style,
      styleTags: config.tags,
      elements: allElements,
      estimatedTotal: Math.round(estimatedTotal * 100) / 100,
      assetCount,
      reason: generateSchemeReason(config, phoneModel, caseTemplate),
    };
  });

  return schemes;
}

export function calculateSchemePrice(
  elements: CanvasElement[],
  caseTemplate: CaseTemplate
): number {
  const items = generateShoppingList(elements, caseTemplate);
  return calculateTotal(items);
}
