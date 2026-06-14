import type { CanvasElement, ShoppingItem } from "@/types";
import { assets } from "@/data/assets";
import { generateId } from "./idGenerator";

const TYPE_NAMES: Record<string, string> = {
  sticker: "贴纸",
  charm: "挂件",
  "lens-ring": "镜头圈",
  text: "文字定制",
  "phone-case": "手机壳",
};

const ESTIMATED_PRICES: Record<string, number> = {
  sticker: 5,
  charm: 15,
  "lens-ring": 25,
  text: 10,
  "phone-case-transparent": 29,
  "phone-case-solid": 39,
  "phone-case-mirror": 49,
};

export function generateShoppingList(
  elements: CanvasElement[],
  caseTemplate: string
): ShoppingItem[] {
  const items: ShoppingItem[] = [];

  const casePriceKey = `phone-case-${caseTemplate}`;
  items.push({
    id: generateId(),
    name: "手机壳",
    type: "phone-case",
    typeName: TYPE_NAMES["phone-case"],
    quantity: 1,
    estimatedPrice: ESTIMATED_PRICES[casePriceKey] || 39,
  });

  const typeCount: Record<string, { assetId?: string; name: string; type: string; count: number }> = {};

  elements.forEach((element) => {
    if (element.type === "text") {
      const key = "text-custom";
      if (!typeCount[key]) {
        typeCount[key] = {
          name: "文字定制",
          type: "text",
          count: 0,
        };
      }
      typeCount[key].count++;
    } else if (element.assetId) {
      const asset = assets.find((a) => a.id === element.assetId);
      if (asset) {
        const key = `${element.type}-${element.assetId}`;
        if (!typeCount[key]) {
          typeCount[key] = {
            assetId: element.assetId,
            name: asset.name,
            type: element.type,
            count: 0,
          };
        }
        typeCount[key].count++;
      }
    }
  });

  Object.values(typeCount).forEach((item) => {
    items.push({
      id: generateId(),
      name: item.name,
      type: item.type,
      typeName: TYPE_NAMES[item.type] || item.type,
      quantity: item.count,
      estimatedPrice: ESTIMATED_PRICES[item.type] || 10,
    });
  });

  return items;
}

export function calculateTotal(items: ShoppingItem[]): number {
  return items.reduce((total, item) => total + item.estimatedPrice * item.quantity, 0);
}
