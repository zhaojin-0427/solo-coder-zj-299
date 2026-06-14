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

export interface SmartWorkbenchState {
  isOpen: boolean;
  recommendations: RecommendationScheme[];
  previewSchemeId: string | null;
  isGenerating: boolean;
}
