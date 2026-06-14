import { X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShoppingItem } from "@/types";
import { calculateTotal } from "@/utils/shoppingList";

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingItem[];
}

export function ShoppingListModal({ isOpen, onClose, items }: ShoppingListModalProps) {
  if (!isOpen) return null;

  const total = calculateTotal(items);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-pop w-full max-w-md mx-4 animate-scale-in max-h-[80vh] flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-lavender-400 to-purple-500 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">购物清单</h3>
              <p className="text-xs text-gray-500">{items.length} 件商品</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold",
                    item.type === "phone-case" && "bg-gradient-to-br from-rose-400 to-pink-500",
                    item.type === "sticker" && "bg-gradient-to-br from-yellow-400 to-orange-500",
                    item.type === "charm" && "bg-gradient-to-br from-purple-400 to-indigo-500",
                    item.type === "lens-ring" && "bg-gradient-to-br from-cyan-400 to-blue-500",
                    item.type === "text" && "bg-gradient-to-br from-green-400 to-emerald-500"
                  )}
                >
                  {item.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.typeName}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">¥{item.estimatedPrice}</p>
                  <p className="text-xs text-gray-400">x{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">合计</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
              ¥{total}
            </span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            * 价格为预估价格，实际价格以购买时为准
          </p>
        </div>
      </div>
    </div>
  );
}
