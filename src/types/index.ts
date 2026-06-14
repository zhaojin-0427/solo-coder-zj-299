export interface PhoneModel {
  id: string;
  name: string;
  brand: string;
  width: number;
  height: number;
  cornerRadius: number;
  cameraArea: {
    x: number;
    y: number;
    width: number;
    height: number;
    cornerRadius: number;
    lensCount: number;
  };
}

export type CaseTemplate = "transparent" | "solid" | "mirror";

export type ElementType = "sticker" | "charm" | "lens-ring" | "text";

export interface CanvasElement {
  id: string;
  type: ElementType;
  assetId?: string;
  content?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  color?: string;
  zIndex: number;
  scale: number;
  fontSize?: number;
  fontWeight?: number;
}

export interface Asset {
  id: string;
  type: ElementType;
  name: string;
  thumbnail: string;
  svg: string;
  defaultWidth: number;
  defaultHeight: number;
  category: string;
}

export type ProjectTag = "通勤" | "可爱" | "极简" | "节日" | "炫酷" | "文艺";

export const ALL_TAGS: ProjectTag[] = [
  "通勤",
  "可爱",
  "极简",
  "节日",
  "炫酷",
  "文艺",
];

export interface Project {
  id: string;
  name: string;
  phoneModel: string;
  caseTemplate: CaseTemplate;
  caseColor: string;
  elements: CanvasElement[];
  tags: ProjectTag[];
  thumbnail?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  type: string;
  typeName: string;
  quantity: number;
  estimatedPrice: number;
}

export type AssetCategory = "sticker" | "charm" | "lens-ring" | "text";

export interface HistoryState {
  past: CanvasElement[][];
  future: CanvasElement[][];
}

export type RecommendationStyle = "简约清新" | "活力可爱" | "潮流炫酷" | "文艺复古" | "商务通勤" | "节日主题";

export interface RecommendationScheme {
  id: string;
  name: string;
  style: RecommendationStyle;
  styleTags: ProjectTag[];
  elements: CanvasElement[];
  estimatedTotal: number;
  assetCount: number;
  reason: string;
  thumbnail?: string;
}

export type SortOption = "recent" | "price-asc" | "asset-count";

export type SceneType = "通勤" | "约会" | "节日" | "旅行" | "礼物";

export const ALL_SCENE_TYPES: SceneType[] = [
  "通勤",
  "约会",
  "节日",
  "旅行",
  "礼物",
];

export const SCENE_ICONS: Record<SceneType, string> = {
  "通勤": "💼",
  "约会": "💕",
  "节日": "🎉",
  "旅行": "✈️",
  "礼物": "🎁",
};

export const SCENE_COLORS: Record<SceneType, string> = {
  "通勤": "#667eea",
  "约会": "#f093fb",
  "节日": "#ff6b6b",
  "旅行": "#4ecdc4",
  "礼物": "#ffd93d",
};

export interface ScenePlan {
  id: string;
  sceneType: SceneType;
  caseTemplate: CaseTemplate;
  caseColor: string;
  elements: CanvasElement[];
  lensRingAssetId?: string;
  textLabels: string[];
  budgetLimit: number;
  tags: ProjectTag[];
  thumbnail?: string;
}

export interface SceneGroup {
  id: string;
  name: string;
  phoneModel: string;
  scenes: ScenePlan[];
  createdAt: number;
  updatedAt: number;
}

export interface SceneComboScore {
  totalPrice: number;
  reuseRate: number;
  styleCoverage: number;
  lensAvoidance: number;
  colorHarmony: number;
  shoppingListDiff: number;
  overall: number;
}

export interface SceneCombo {
  id: string;
  name: string;
  scenes: ScenePlan[];
  score: SceneComboScore;
}

export type HistorySortOption =
  | "recent"
  | "price-asc"
  | "asset-count"
  | "scene-count"
  | "tag-match";

export type HistoryItemType = "single" | "scene-group";

export interface HistoryEntry {
  id: string;
  type: HistoryItemType;
  name: string;
  phoneModel: string;
  tags: ProjectTag[];
  updatedAt: number;
  thumbnail?: string;
  totalPrice: number;
  assetCount: number;
  sceneCount: number;
}

export interface SmartWorkbenchState {
  isOpen: boolean;
  recommendations: RecommendationScheme[];
  previewSchemeId: string | null;
  isGenerating: boolean;
}
