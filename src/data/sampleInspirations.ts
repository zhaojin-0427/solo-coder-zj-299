import type { InspirationCard, InspirationSceneBreakdown, CanvasElement, ProjectTag, SceneType } from "@/types";
import { generateId } from "@/utils/idGenerator";

function createElement(partial: Partial<CanvasElement>): CanvasElement {
  return {
    id: generateId(),
    type: "sticker",
    x: 100,
    y: 100,
    width: 60,
    height: 60,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    scale: 1,
    ...partial,
  };
}

function createSampleBreakdown(
  sceneType: SceneType,
  caseTemplate: "transparent" | "solid" | "mirror",
  caseColor: string,
  tags: ProjectTag[],
  elements: CanvasElement[]
): InspirationSceneBreakdown {
  return {
    sceneType,
    caseTemplate,
    caseColor,
    elements: elements.map(el => ({ ...el, id: generateId() })),
    tags,
    price: 89,
  };
}

export function getSampleInspirationCards(): InspirationCard[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;

  const elements1: CanvasElement[] = [
    createElement({ type: "sticker", assetId: "sticker-heart", x: 80, y: 150, width: 50, height: 50 }),
    createElement({ type: "sticker", assetId: "sticker-star", x: 180, y: 200, width: 45, height: 45, rotation: 15 }),
    createElement({ type: "sticker", assetId: "sticker-flower", x: 120, y: 300, width: 55, height: 55 }),
    createElement({ type: "charm", assetId: "charm-heart", x: 220, y: 450, width: 40, height: 60 }),
    createElement({ type: "lens-ring", assetId: "lens-ring-rosegold", x: 18, y: 18, width: 110, height: 110 }),
  ];

  const elements2: CanvasElement[] = [
    createElement({ type: "sticker", assetId: "sticker-moon", x: 70, y: 120, width: 55, height: 55 }),
    createElement({ type: "sticker", assetId: "sticker-cloud", x: 150, y: 180, width: 70, height: 50 }),
    createElement({ type: "sticker", assetId: "sticker-star", x: 200, y: 280, width: 40, height: 40, rotation: -10 }),
    createElement({ type: "sticker", assetId: "sticker-star", x: 90, y: 350, width: 35, height: 35 }),
    createElement({ type: "charm", assetId: "charm-moon", x: 230, y: 480, width: 40, height: 60 }),
    createElement({ type: "lens-ring", assetId: "lens-ring-silver", x: 18, y: 18, width: 110, height: 110 }),
  ];

  const elements3: CanvasElement[] = [
    createElement({ type: "sticker", assetId: "sticker-lightning", x: 100, y: 150, width: 45, height: 60 }),
    createElement({ type: "sticker", assetId: "sticker-diamond", x: 180, y: 220, width: 50, height: 45 }),
    createElement({ type: "sticker", assetId: "sticker-music", x: 80, y: 320, width: 55, height: 55 }),
    createElement({ type: "charm", assetId: "charm-star", x: 220, y: 450, width: 40, height: 60 }),
    createElement({ type: "lens-ring", assetId: "lens-ring-gold", x: 18, y: 18, width: 110, height: 110 }),
    createElement({ type: "text", content: "COOL", x: 130, y: 400, width: 80, height: 30, fontSize: 18, fontWeight: 700, color: "#FFFFFF" }),
  ];

  const elements4: CanvasElement[] = [
    createElement({ type: "sticker", assetId: "sticker-cat", x: 100, y: 180, width: 65, height: 65 }),
    createElement({ type: "sticker", assetId: "sticker-cherry", x: 200, y: 250, width: 50, height: 60 }),
    createElement({ type: "sticker", assetId: "sticker-heart", x: 70, y: 350, width: 40, height: 40 }),
    createElement({ type: "sticker", assetId: "sticker-smile", x: 180, y: 380, width: 45, height: 45 }),
    createElement({ type: "charm", assetId: "charm-bear", x: 230, y: 470, width: 40, height: 60 }),
    createElement({ type: "lens-ring", assetId: "lens-ring-pink", x: 18, y: 18, width: 110, height: 110 }),
  ];

  const elements5: CanvasElement[] = [
    createElement({ type: "sticker", assetId: "sticker-coffee", x: 80, y: 160, width: 55, height: 55 }),
    createElement({ type: "sticker", assetId: "sticker-sun", x: 180, y: 200, width: 50, height: 50 }),
    createElement({ type: "sticker", assetId: "sticker-rainbow", x: 100, y: 300, width: 70, height: 50 }),
    createElement({ type: "lens-ring", assetId: "lens-ring-gold", x: 18, y: 18, width: 110, height: 110 }),
    createElement({ type: "text", content: "通勤·日常", x: 110, y: 420, width: 100, height: 28, fontSize: 16, fontWeight: 600, color: "#5D4037" }),
  ];

  const elements6: CanvasElement[] = [
    createElement({ type: "sticker", assetId: "sticker-pizza", x: 90, y: 170, width: 60, height: 60 }),
    createElement({ type: "sticker", assetId: "sticker-coffee", x: 190, y: 220, width: 50, height: 50 }),
    createElement({ type: "sticker", assetId: "sticker-music", x: 110, y: 320, width: 50, height: 50 }),
    createElement({ type: "charm", assetId: "charm-key", x: 230, y: 460, width: 35, height: 70 }),
    createElement({ type: "lens-ring", assetId: "lens-ring-silver", x: 18, y: 18, width: 110, height: 110 }),
  ];

  const elements7: CanvasElement[] = [
    createElement({ type: "sticker", assetId: "sticker-cherry", x: 100, y: 150, width: 50, height: 60 }),
    createElement({ type: "sticker", assetId: "sticker-heart", x: 190, y: 200, width: 55, height: 55 }),
    createElement({ type: "sticker", assetId: "sticker-flower", x: 90, y: 300, width: 60, height: 60 }),
    createElement({ type: "charm", assetId: "charm-bell", x: 220, y: 450, width: 40, height: 60 }),
    createElement({ type: "lens-ring", assetId: "lens-ring-rosegold", x: 18, y: 18, width: 110, height: 110 }),
    createElement({ type: "text", content: "节日快乐", x: 120, y: 410, width: 90, height: 30, fontSize: 18, fontWeight: 700, color: "#E91E63" }),
  ];

  const sceneElements1: CanvasElement[] = [
    createElement({ type: "sticker", assetId: "sticker-coffee", x: 90, y: 180, width: 50, height: 50 }),
    createElement({ type: "sticker", assetId: "sticker-sun", x: 180, y: 230, width: 45, height: 45 }),
    createElement({ type: "lens-ring", assetId: "lens-ring-gold", x: 18, y: 18, width: 110, height: 110 }),
  ];

  const sceneElements2: CanvasElement[] = [
    createElement({ type: "sticker", assetId: "sticker-heart", x: 100, y: 170, width: 55, height: 55 }),
    createElement({ type: "sticker", assetId: "sticker-flower", x: 180, y: 250, width: 55, height: 55 }),
    createElement({ type: "charm", assetId: "charm-heart", x: 220, y: 450, width: 40, height: 60 }),
    createElement({ type: "lens-ring", assetId: "lens-ring-rosegold", x: 18, y: 18, width: 110, height: 110 }),
  ];

  const sceneElements3: CanvasElement[] = [
    createElement({ type: "sticker", assetId: "sticker-rainbow", x: 80, y: 160, width: 70, height: 50 }),
    createElement({ type: "sticker", assetId: "sticker-cloud", x: 170, y: 240, width: 65, height: 45 }),
    createElement({ type: "sticker", assetId: "sticker-sun", x: 100, y: 340, width: 50, height: 50 }),
    createElement({ type: "lens-ring", assetId: "lens-ring-blue", x: 18, y: 18, width: 110, height: 110 }),
  ];

  const sceneElements4: CanvasElement[] = [
    createElement({ type: "sticker", assetId: "sticker-heart", x: 100, y: 180, width: 55, height: 55 }),
    createElement({ type: "sticker", assetId: "sticker-star", x: 190, y: 260, width: 45, height: 45 }),
    createElement({ type: "charm", assetId: "charm-bell", x: 230, y: 460, width: 40, height: 60 }),
    createElement({ type: "lens-ring", assetId: "lens-ring-gold", x: 18, y: 18, width: 110, height: 110 }),
  ];

  const cards: InspirationCard[] = [
    {
      id: generateId(),
      type: "single",
      name: "甜蜜粉系少女心",
      phoneModel: "iphone-15-pro",
      caseTemplate: "transparent",
      styleTags: ["可爱"],
      sceneTypeTags: ["约会"],
      assetCount: 4,
      estimatedTotalPrice: 113,
      sceneCount: 1,
      publishedAt: now - 2 * day,
      isFavorited: false,
      favoriteCount: 42,
      viewCount: 156,
      replicateCount: 28,
      elements: elements1,
      sceneBreakdowns: [createSampleBreakdown("约会", "transparent", "#FFFFFF", ["可爱"], elements1)],
      description: "粉色系的爱心、星星和樱花，搭配玫瑰金镜头圈，满满的少女心~",
    },
    {
      id: generateId(),
      type: "single",
      name: "静谧夜空极简风",
      phoneModel: "iphone-15",
      caseTemplate: "solid",
      styleTags: ["极简", "文艺"],
      sceneTypeTags: ["通勤"],
      assetCount: 5,
      estimatedTotalPrice: 128,
      sceneCount: 1,
      publishedAt: now - 1 * day,
      isFavorited: true,
      favoriteCount: 78,
      viewCount: 234,
      replicateCount: 45,
      elements: elements2,
      sceneBreakdowns: [createSampleBreakdown("通勤", "solid", "#1a1a2e", ["极简", "文艺"], elements2)],
      description: "深邃夜空背景，点缀月亮、云朵和星星，简约而不简单。",
    },
    {
      id: generateId(),
      type: "single",
      name: "炫酷街头潮流风",
      phoneModel: "huawei-mate60-pro",
      caseTemplate: "mirror",
      styleTags: ["炫酷"],
      sceneTypeTags: ["旅行"],
      assetCount: 6,
      estimatedTotalPrice: 156,
      sceneCount: 1,
      publishedAt: now - 5 * day,
      isFavorited: false,
      favoriteCount: 56,
      viewCount: 189,
      replicateCount: 32,
      elements: elements3,
      sceneBreakdowns: [createSampleBreakdown("旅行", "mirror", "#000000", ["炫酷"], elements3)],
      description: "闪电、钻石、音乐元素组合，金色镜头圈点缀，街头感十足！",
    },
    {
      id: generateId(),
      type: "single",
      name: "萌系猫咪日常",
      phoneModel: "iphone-14-pro",
      caseTemplate: "transparent",
      styleTags: ["可爱"],
      sceneTypeTags: ["约会", "礼物"],
      assetCount: 5,
      estimatedTotalPrice: 108,
      sceneCount: 1,
      publishedAt: now - 3 * day,
      isFavorited: false,
      favoriteCount: 95,
      viewCount: 267,
      replicateCount: 61,
      elements: elements4,
      sceneBreakdowns: [createSampleBreakdown("约会", "transparent", "#FFF0F5", ["可爱"], elements4)],
      description: "可爱的猫咪、樱桃和笑脸，粉色镜头圈，萌化你的心~",
    },
    {
      id: generateId(),
      type: "single",
      name: "温暖通勤日",
      phoneModel: "xiaomi-14-pro",
      caseTemplate: "solid",
      styleTags: ["通勤", "文艺"],
      sceneTypeTags: ["通勤"],
      assetCount: 4,
      estimatedTotalPrice: 98,
      sceneCount: 1,
      publishedAt: now - 4 * day,
      isFavorited: false,
      favoriteCount: 34,
      viewCount: 123,
      replicateCount: 19,
      elements: elements5,
      sceneBreakdowns: [createSampleBreakdown("通勤", "solid", "#FFF8E1", ["通勤", "文艺"], elements5)],
      description: "咖啡、阳光、彩虹，温暖的色调陪你度过每一天通勤时光。",
    },
    {
      id: generateId(),
      type: "single",
      name: "活力美食家",
      phoneModel: "samsung-s24-ultra",
      caseTemplate: "transparent",
      styleTags: ["可爱", "炫酷"],
      sceneTypeTags: ["旅行"],
      assetCount: 4,
      estimatedTotalPrice: 102,
      sceneCount: 1,
      publishedAt: now - 6 * day,
      isFavorited: false,
      favoriteCount: 28,
      viewCount: 98,
      replicateCount: 15,
      elements: elements6,
      sceneBreakdowns: [createSampleBreakdown("旅行", "transparent", "#FFF3E0", ["可爱", "炫酷"], elements6)],
      description: "披萨、咖啡、音乐，带上美食家的心情去旅行！",
    },
    {
      id: generateId(),
      type: "single",
      name: "节日祝福限定款",
      phoneModel: "iphone-15-pro",
      caseTemplate: "solid",
      styleTags: ["节日"],
      sceneTypeTags: ["节日", "礼物"],
      assetCount: 5,
      estimatedTotalPrice: 136,
      sceneCount: 1,
      publishedAt: now - 7 * day,
      isFavorited: true,
      favoriteCount: 120,
      viewCount: 345,
      replicateCount: 78,
      elements: elements7,
      sceneBreakdowns: [createSampleBreakdown("节日", "solid", "#FFEBEE", ["节日"], elements7)],
      description: "樱桃、爱心、樱花，搭配节日祝福语，送礼自用两相宜~",
    },
    {
      id: generateId(),
      type: "scene-group",
      name: "多场景一周搭配套装",
      phoneModel: "iphone-15-pro",
      caseTemplate: "transparent",
      styleTags: ["通勤", "可爱", "极简", "节日"],
      sceneTypeTags: ["通勤", "约会", "旅行", "礼物"],
      assetCount: 14,
      estimatedTotalPrice: 412,
      sceneCount: 4,
      publishedAt: now - 12 * hour,
      isFavorited: false,
      favoriteCount: 156,
      viewCount: 489,
      replicateCount: 92,
      elements: [],
      sceneBreakdowns: [
        createSampleBreakdown("通勤", "solid", "#FFF8E1", ["通勤", "文艺"], sceneElements1),
        createSampleBreakdown("约会", "transparent", "#FFF0F5", ["可爱"], sceneElements2),
        createSampleBreakdown("旅行", "mirror", "#E3F2FD", ["炫酷", "极简"], sceneElements3),
        createSampleBreakdown("礼物", "solid", "#FFF3E0", ["节日", "可爱"], sceneElements4),
      ],
      description: "一周四场景不重样！通勤、约会、旅行、送礼，一套搞定所有场合。",
    },
    {
      id: generateId(),
      type: "scene-group",
      name: "夏日清凉双场景",
      phoneModel: "huawei-mate60-pro",
      caseTemplate: "transparent",
      styleTags: ["极简", "文艺"],
      sceneTypeTags: ["通勤", "旅行"],
      assetCount: 7,
      estimatedTotalPrice: 208,
      sceneCount: 2,
      publishedAt: now - 2 * day,
      isFavorited: false,
      favoriteCount: 67,
      viewCount: 234,
      replicateCount: 41,
      elements: [],
      sceneBreakdowns: [
        createSampleBreakdown("通勤", "solid", "#E0F7FA", ["极简", "通勤"], sceneElements1),
        createSampleBreakdown("旅行", "transparent", "#E8F5E9", ["文艺", "炫酷"], sceneElements3),
      ],
      description: "清透蓝绿色系，夏日通勤旅行两相宜。",
    },
    {
      id: generateId(),
      type: "single",
      name: "极简纯白格调",
      phoneModel: "iphone-15",
      caseTemplate: "solid",
      styleTags: ["极简", "文艺"],
      sceneTypeTags: ["通勤"],
      assetCount: 2,
      estimatedTotalPrice: 74,
      sceneCount: 1,
      publishedAt: now - 3 * day,
      isFavorited: false,
      favoriteCount: 45,
      viewCount: 167,
      replicateCount: 23,
      elements: [
        createElement({ type: "sticker", assetId: "sticker-moon", x: 120, y: 280, width: 50, height: 50 }),
        createElement({ type: "lens-ring", assetId: "lens-ring-silver", x: 18, y: 18, width: 110, height: 110 }),
      ],
      sceneBreakdowns: [
        createSampleBreakdown("通勤", "solid", "#FAFAFA", ["极简", "文艺"], [
          createElement({ type: "sticker", assetId: "sticker-moon", x: 120, y: 280, width: 50, height: 50 }),
          createElement({ type: "lens-ring", assetId: "lens-ring-silver", x: 18, y: 18, width: 110, height: 110 }),
        ]),
      ],
      description: "纯白背景，银色镜头圈点缀月亮，简约至上。",
    },
  ];

  return cards.sort((a, b) => b.publishedAt - a.publishedAt);
}
