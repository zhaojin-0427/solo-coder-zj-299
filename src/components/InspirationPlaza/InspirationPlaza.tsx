import { useInspirationStore } from "@/store/useInspirationStore";
import { useDesignStore } from "@/store/useDesignStore";
import { useMultiSceneStore } from "@/store/useMultiSceneStore";
import type { InspirationCard, InspirationSortOption, ProjectTag, SceneType } from "@/types";
import { ALL_TAGS, ALL_SCENE_TYPES, SCENE_ICONS, SCENE_COLORS } from "@/types";
import { phoneModels } from "@/data/phoneModels";
import { generateShoppingList, calculateTotal } from "@/utils/shoppingList";
import { cn } from "@/lib/utils";
import {
  X,
  Heart,
  Eye,
  Copy,
  ArrowUpDown,
  Clock,
  DollarSign,
  Layers,
  Flame,
  LayoutGrid,
  Sparkles,
  Trash2,
  Share2,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Sticker,
  CircleDot,
  Type,
  Palette,
  Upload,
} from "lucide-react";
import { useState } from "react";

const STYLE_TAG_ICONS: Record<ProjectTag, string> = {
  "通勤": "💼",
  "可爱": "🎀",
  "极简": "✨",
  "节日": "🎉",
  "炫酷": "⚡",
  "文艺": "📖",
};

export function InspirationPlaza() {
  const isOpen = useInspirationStore((s) => s.isOpen);
  const setOpen = useInspirationStore((s) => s.setOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-pop w-full max-w-6xl mx-4 animate-scale-in overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-b border-white/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-gray-800">搭配灵感广场</h2>
              <p className="text-sm text-gray-500">发现风格灵感，一键复刻到你的画布</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <InspirationContent />
        </div>
      </div>
    </div>
  );
}

function InspirationContent() {
  const selectedCardId = useInspirationStore((s) => s.selectedCardId);
  const setSelectedCardId = useInspirationStore((s) => s.setSelectedCardId);
  const cards = useInspirationStore((s) => s.cards);

  const selectedCard = cards.find((c) => c.id === selectedCardId) || null;

  if (selectedCard) {
    return <CardDetail card={selectedCard} onBack={() => setSelectedCardId(null)} />;
  }

  return <CardGrid />;
}

function CardGrid() {
  const filterStyleTags = useInspirationStore((s) => s.filterStyleTags);
  const filterSceneTypes = useInspirationStore((s) => s.filterSceneTypes);
  const sortOption = useInspirationStore((s) => s.sortOption);
  const setFilterStyleTags = useInspirationStore((s) => s.setFilterStyleTags);
  const setFilterSceneTypes = useInspirationStore((s) => s.setFilterSceneTypes);
  const setSortOption = useInspirationStore((s) => s.setSortOption);
  const getFilteredCards = useInspirationStore((s) => s.getFilteredCards);
  const setSelectedCardId = useInspirationStore((s) => s.setSelectedCardId);
  const incrementViewCount = useInspirationStore((s) => s.incrementViewCount);

  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const projects = useDesignStore((s) => s.projects);
  const sceneGroups = useMultiSceneStore((s) => s.sceneGroups);
  const publishFromProject = useInspirationStore((s) => s.publishFromProject);
  const publishFromSceneGroup = useInspirationStore((s) => s.publishFromSceneGroup);

  const filteredCards = getFilteredCards();

  const toggleStyleTag = (tag: ProjectTag) => {
    setFilterStyleTags(
      filterStyleTags.includes(tag)
        ? filterStyleTags.filter((t) => t !== tag)
        : [...filterStyleTags, tag]
    );
  };

  const toggleSceneType = (type: SceneType) => {
    setFilterSceneTypes(
      filterSceneTypes.includes(type)
        ? filterSceneTypes.filter((t) => t !== type)
        : [...filterSceneTypes, type]
    );
  };

  const clearFilters = () => {
    setFilterStyleTags([]);
    setFilterSceneTypes([]);
  };

  const hasActiveFilters = filterStyleTags.length > 0 || filterSceneTypes.length > 0;

  const sortOptions: { value: InspirationSortOption; label: string; icon: typeof Flame }[] = [
    { value: "popularity", label: "热度优先", icon: Flame },
    { value: "recent", label: "最新发布", icon: Clock },
    { value: "price-asc", label: "价格从低到高", icon: DollarSign },
    { value: "price-desc", label: "价格从高到低", icon: DollarSign },
    { value: "asset-count", label: "素材数量", icon: Layers },
  ];

  const currentSortOption = sortOptions.find((o) => o.value === sortOption);

  const handleCardClick = (card: InspirationCard) => {
    incrementViewCount(card.id);
    setSelectedCardId(card.id);
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
          <span className="text-xs text-gray-400 flex-shrink-0">风格</span>
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={clearFilters}
              className={cn(
                "px-2 py-0.5 text-[10px] rounded-full transition-all",
                !hasActiveFilters
                  ? "bg-purple-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              全部
            </button>
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleStyleTag(tag)}
                className={cn(
                  "px-2 py-0.5 text-[10px] rounded-full transition-all",
                  filterStyleTags.includes(tag)
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                {STYLE_TAG_ICONS[tag]} {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs text-gray-600 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{currentSortOption?.label || "排序"}</span>
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-pop overflow-hidden z-10 animate-scale-in">
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortOption(option.value);
                        setShowSortMenu(false);
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-xs flex items-center gap-2 transition-colors",
                        sortOption === option.value
                          ? "bg-purple-50 text-purple-600"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowPublishModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-md hover:-translate-y-0.5 transition-all text-xs font-medium"
          >
            <Upload className="w-3 h-3" />
            发布灵感
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400 flex-shrink-0">场景</span>
        <div className="flex gap-1 flex-wrap">
          {ALL_SCENE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => toggleSceneType(type)}
              className={cn(
                "px-2 py-0.5 text-[10px] rounded-full transition-all",
                filterSceneTypes.includes(type)
                  ? "text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
              style={filterSceneTypes.includes(type) ? { backgroundColor: SCENE_COLORS[type] } : undefined}
            >
              {SCENE_ICONS[type]} {type}
            </button>
          ))}
        </div>
      </div>

      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredCards.map((card) => (
            <InspirationCardView
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-base font-medium text-gray-700 mb-2">灵感广场暂无内容</h3>
          <p className="text-sm text-gray-400 mb-6">
            发布你保存的方案或场景组，分享搭配灵感
          </p>
          <button
            onClick={() => setShowPublishModal(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm font-medium inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            发布第一个灵感
          </button>
        </div>
      )}

      {showPublishModal && (
        <PublishInspirationModal
          onClose={() => setShowPublishModal(false)}
          projects={projects}
          sceneGroups={sceneGroups}
          publishFromProject={publishFromProject}
          publishFromSceneGroup={publishFromSceneGroup}
        />
      )}
    </div>
  );
}

interface InspirationCardViewProps {
  card: InspirationCard;
  onClick: () => void;
}

function InspirationCardView({ card, onClick }: InspirationCardViewProps) {
  const toggleFavorite = useInspirationStore((s) => s.toggleFavorite);
  const phoneModel = phoneModels.find((m) => m.id === card.phoneModel);

  const timeAgo = getTimeAgo(card.publishedAt);

  return (
    <div
      className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-md transition-all cursor-pointer group/card border border-gray-100 hover:border-purple-200"
      onClick={onClick}
    >
      <div className="relative aspect-[9/14] bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-2 overflow-hidden">
        {card.thumbnail ? (
          <img
            src={card.thumbnail}
            alt={card.name}
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-300">
            {card.type === "single" ? (
              <Sticker className="w-8 h-8" />
            ) : (
              <LayoutGrid className="w-8 h-8" />
            )}
            <span className="text-[10px]">预览</span>
          </div>
        )}

        <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-purple-500 text-white text-[9px] rounded-full flex items-center gap-0.5">
          {card.type === "single" ? <Sticker className="w-2.5 h-2.5" /> : <LayoutGrid className="w-2.5 h-2.5" />}
          {card.type === "single" ? "单方案" : "场景组"}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(card.id);
          }}
          className={cn(
            "absolute top-1.5 right-1.5 z-10 p-1 rounded-full transition-all",
            card.isFavorited
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-400 hover:text-red-400"
          )}
        >
          <Heart className={cn("w-3 h-3", card.isFavorited && "fill-current")} />
        </button>
      </div>

      <div className="p-2.5">
        <h4 className="text-xs font-medium text-gray-800 truncate mb-1">{card.name}</h4>

        <div className="flex items-center gap-1 mb-1.5">
          <span className="text-[10px] text-gray-400">{phoneModel?.name || card.phoneModel}</span>
          <span className="text-[10px] text-gray-300">·</span>
          <span className="text-[10px] text-gray-400">{card.caseTemplate === "transparent" ? "透明壳" : card.caseTemplate === "solid" ? "纯色壳" : "镜面壳"}</span>
        </div>

        <div className="flex flex-wrap gap-0.5 mb-1.5">
          {card.styleTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-1 py-0.5 text-[9px] bg-purple-50 text-purple-600 rounded"
            >
              {tag}
            </span>
          ))}
          {card.sceneTypeTags.slice(0, 2).map((type) => (
            <span
              key={type}
              className="px-1 py-0.5 text-[9px] bg-pink-50 text-pink-600 rounded"
            >
              {SCENE_ICONS[type]}{type}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-rose-500 font-bold">¥{Math.round(card.estimatedTotalPrice)}</span>
            <span className="text-[10px] text-gray-300">·</span>
            <span className="text-[10px] text-gray-400">{card.assetCount}素材</span>
            {card.type === "scene-group" && (
              <>
                <span className="text-[10px] text-gray-300">·</span>
                <span className="text-[10px] text-gray-400">{card.sceneCount}场景</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-50">
          <span className="text-[9px] text-gray-300">{timeAgo}</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5 text-[9px] text-gray-400">
              <Heart className="w-2.5 h-2.5" />{card.favoriteCount}
            </span>
            <span className="flex items-center gap-0.5 text-[9px] text-gray-400">
              <Eye className="w-2.5 h-2.5" />{card.viewCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CardDetailProps {
  card: InspirationCard;
  onBack: () => void;
}

function CardDetail({ card, onBack }: CardDetailProps) {
  const toggleFavorite = useInspirationStore((s) => s.toggleFavorite);
  const replicateToCanvas = useInspirationStore((s) => s.replicateToCanvas);
  const replicateAsNewProject = useInspirationStore((s) => s.replicateAsNewProject);
  const replicateAsNewSceneGroup = useInspirationStore((s) => s.replicateAsNewSceneGroup);
  const deleteCard = useInspirationStore((s) => s.deleteCard);

  const [showReplicateMenu, setShowReplicateMenu] = useState(false);
  const [expandedScene, setExpandedScene] = useState<number | null>(null);

  const phoneModel = phoneModels.find((m) => m.id === card.phoneModel);

  const allElements = card.type === "single"
    ? card.elements
    : card.sceneBreakdowns.flatMap((s) => s.elements);
  const allItems = generateShoppingList(allElements, card.caseTemplate);
  const totalPrice = calculateTotal(allItems);

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-xs transition-colors"
        >
          ← 返回广场
        </button>
        <div className="flex-1" />
        <button
          onClick={() => toggleFavorite(card.id)}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            card.isFavorited
              ? "bg-red-50 text-red-500 border border-red-200"
              : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-400"
          )}
        >
          <Heart className={cn("w-3.5 h-3.5", card.isFavorited && "fill-current")} />
          {card.isFavorited ? "已收藏" : "收藏"} · {card.favoriteCount}
        </button>
        <button
          onClick={() => deleteCard(card.id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="删除灵感卡片"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 flex items-center justify-center">
            {card.thumbnail ? (
              <img
                src={card.thumbnail}
                alt={card.name}
                className="max-h-80 object-contain rounded-xl"
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-300">
                {card.type === "single" ? (
                  <Sticker className="w-16 h-16" />
                ) : (
                  <LayoutGrid className="w-16 h-16" />
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-base font-bold text-gray-800 mb-2">{card.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{card.description}</p>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">¥{Math.round(card.estimatedTotalPrice)}</div>
                <div className="text-[10px] text-gray-400">预计总价</div>
              </div>
              <div className="text-center p-2 bg-pink-50 rounded-lg">
                <div className="text-lg font-bold text-pink-600">{card.assetCount}</div>
                <div className="text-[10px] text-gray-400">素材数量</div>
              </div>
              <div className="text-center p-2 bg-rose-50 rounded-lg">
                <div className="text-lg font-bold text-rose-600">{card.sceneCount}</div>
                <div className="text-[10px] text-gray-400">场景数量</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-16">机型</span>
                <span className="text-gray-700 font-medium">{phoneModel?.name || card.phoneModel}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-16">壳模板</span>
                <span className="text-gray-700 font-medium">
                  {card.caseTemplate === "transparent" ? "透明壳" : card.caseTemplate === "solid" ? "纯色壳" : "镜面壳"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-16">风格标签</span>
                <div className="flex flex-wrap gap-1">
                  {card.styleTags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[10px]">
                      {STYLE_TAG_ICONS[tag]} {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-16">场景类型</span>
                <div className="flex flex-wrap gap-1">
                  {card.sceneTypeTags.map((type) => (
                    <span
                      key={type}
                      className="px-1.5 py-0.5 text-[10px] text-white rounded"
                      style={{ backgroundColor: SCENE_COLORS[type] }}
                    >
                      {SCENE_ICONS[type]} {type}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-16">发布时间</span>
                <span className="text-gray-700">{new Date(card.publishedAt).toLocaleString("zh-CN")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-16">收藏状态</span>
                <span className={cn("flex items-center gap-1", card.isFavorited ? "text-red-500" : "text-gray-400")}>
                  <Heart className={cn("w-3 h-3", card.isFavorited && "fill-current")} />
                  {card.isFavorited ? "已收藏" : "未收藏"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-rose-500" />
              价格构成
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {allItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-4 text-center">
                      {item.type === "sticker" ? "🎨" : item.type === "charm" ? "🔑" : item.type === "lens-ring" ? "⭕" : item.type === "text" ? "✏️" : "📱"}
                    </span>
                    <span className="text-gray-700">{item.name}</span>
                    {item.quantity > 1 && (
                      <span className="text-gray-400">×{item.quantity}</span>
                    )}
                  </div>
                  <span className="text-rose-500 font-medium">¥{item.estimatedPrice * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-800">合计</span>
              <span className="text-lg font-bold text-rose-500">¥{Math.round(totalPrice)}</span>
            </div>
          </div>

          {card.type === "scene-group" && card.sceneBreakdowns.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-teal-500" />
                场景拆分
              </h4>
              <div className="space-y-2">
                {card.sceneBreakdowns.map((breakdown, idx) => {
                  const sceneItems = generateShoppingList(breakdown.elements, breakdown.caseTemplate);
                  const sceneTotal = calculateTotal(sceneItems);
                  const sceneAssetCount = breakdown.elements.filter((e) => e.assetId).length;

                  return (
                    <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedScene(expandedScene === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white"
                            style={{ backgroundColor: SCENE_COLORS[breakdown.sceneType] }}
                          >
                            {SCENE_ICONS[breakdown.sceneType]}
                          </span>
                          <span className="text-sm font-medium text-gray-700">{breakdown.sceneType}</span>
                          <span className="text-[10px] text-gray-400">{sceneAssetCount}素材</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-rose-500">¥{Math.round(sceneTotal)}</span>
                          {expandedScene === idx ? (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </div>
                      </button>
                      {expandedScene === idx && (
                        <div className="px-3 pb-3 space-y-1.5 border-t border-gray-50 pt-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Palette className="w-3 h-3" />
                            <span>壳模板: {breakdown.caseTemplate === "transparent" ? "透明" : breakdown.caseTemplate === "solid" ? "纯色" : "镜面"}</span>
                            <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: breakdown.caseColor }} />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {breakdown.tags.map((tag) => (
                              <span key={tag} className="px-1.5 py-0.5 text-[9px] bg-teal-50 text-teal-600 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="space-y-1">
                            {breakdown.elements.map((el) => (
                              <div key={el.id} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                {el.type === "text" ? (
                                  <Type className="w-2.5 h-2.5" />
                                ) : el.type === "sticker" ? (
                                  <Sticker className="w-2.5 h-2.5" />
                                ) : el.type === "lens-ring" ? (
                                  <CircleDot className="w-2.5 h-2.5" />
                                ) : (
                                  <Layers className="w-2.5 h-2.5" />
                                )}
                                <span>{el.content || el.type}</span>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-0.5">
                            {sceneItems.map((item, iidx) => (
                              <div key={iidx} className="flex items-center justify-between text-[10px]">
                                <span className="text-gray-500">{item.name}{item.quantity > 1 ? ` ×${item.quantity}` : ""}</span>
                                <span className="text-rose-400">¥{item.estimatedPrice * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-500" />
              素材清单
            </h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {allElements.map((el) => (
                <div key={el.id} className="flex items-center gap-2 text-xs py-0.5">
                  {el.type === "text" ? (
                    <Type className="w-3 h-3 text-gray-400" />
                  ) : el.type === "sticker" ? (
                    <Sticker className="w-3 h-3 text-pink-400" />
                  ) : el.type === "lens-ring" ? (
                    <CircleDot className="w-3 h-3 text-violet-400" />
                  ) : (
                    <Layers className="w-3 h-3 text-teal-400" />
                  )}
                  <span className="text-gray-600">{el.content || el.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Copy className="w-4 h-4 text-purple-500" />
              一键复刻
            </h4>
            <p className="text-xs text-gray-500 mb-3">
              复刻后将自动保留原方案标签，生成新的方案名称
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => replicateToCanvas(card.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-md transition-all text-xs font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                复刻到当前画布
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowReplicateMenu(!showReplicateMenu)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white text-purple-600 rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors text-xs font-medium"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  更多方式
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showReplicateMenu && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-pop overflow-hidden z-10 animate-scale-in">
                    <button
                      onClick={() => {
                        replicateAsNewProject(card.id);
                        setShowReplicateMenu(false);
                      }}
                      className="w-full px-3 py-2.5 text-left text-xs text-gray-600 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-2 transition-colors"
                    >
                      <Sticker className="w-3.5 h-3.5" />
                      复制为新历史方案
                    </button>
                    {card.type === "scene-group" && (
                      <button
                        onClick={() => {
                          replicateAsNewSceneGroup(card.id);
                          setShowReplicateMenu(false);
                        }}
                        className="w-full px-3 py-2.5 text-left text-xs text-gray-600 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-2 transition-colors"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        复制为新场景组
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400">
              <span className="flex items-center gap-0.5">
                <Copy className="w-2.5 h-2.5" />
                已被复刻 {card.replicateCount} 次
              </span>
              <span className="flex items-center gap-0.5">
                <Eye className="w-2.5 h-2.5" />
                浏览 {card.viewCount} 次
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PublishInspirationModalProps {
  onClose: () => void;
  projects: import("@/types").Project[];
  sceneGroups: import("@/types").SceneGroup[];
  publishFromProject: (projectId: string, description?: string) => void;
  publishFromSceneGroup: (groupId: string, description?: string) => void;
}

function PublishInspirationModal({
  onClose,
  projects,
  sceneGroups,
  publishFromProject,
  publishFromSceneGroup,
}: PublishInspirationModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"single" | "scene-group">("single");
  const [description, setDescription] = useState("");

  const availableProjects = projects;
  const availableGroups = sceneGroups;

  const handlePublish = () => {
    if (!selectedId) return;
    if (selectedType === "single") {
      publishFromProject(selectedId, description || undefined);
    } else {
      publishFromSceneGroup(selectedId, description || undefined);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-pop w-full max-w-lg mx-4 animate-scale-in overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-b border-white/80">
          <h3 className="text-lg font-display font-bold text-gray-800">发布灵感卡片</h3>
          <p className="text-sm text-gray-500 mt-1">选择已保存的方案或场景组发布到灵感广场</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">类型</label>
            <div className="flex gap-2">
              <button
                onClick={() => { setSelectedType("single"); setSelectedId(null); }}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                  selectedType === "single"
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                <Sticker className="w-4 h-4" />
                单方案
              </button>
              <button
                onClick={() => { setSelectedType("scene-group"); setSelectedId(null); }}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                  selectedType === "scene-group"
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
                场景组
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              选择{selectedType === "single" ? "方案" : "场景组"}
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {selectedType === "single" ? (
                availableProjects.length > 0 ? (
                  availableProjects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2",
                        selectedId === p.id
                          ? "bg-purple-50 border-2 border-purple-300 text-purple-700"
                          : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{p.name}</div>
                        <div className="text-[10px] text-gray-400">{p.tags.join(" · ") || "无标签"}</div>
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">{p.elements.length}元素</span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">暂无已保存方案</p>
                )
              ) : availableGroups.length > 0 ? (
                availableGroups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedId(g.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2",
                      selectedId === g.id
                        ? "bg-purple-50 border-2 border-purple-300 text-purple-700"
                        : "bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{g.name}</div>
                      <div className="text-[10px] text-gray-400">{g.scenes.length}场景 · {[...new Set(g.scenes.flatMap((s) => s.tags))].join(" · ") || "无标签"}</div>
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{g.scenes.length}场景</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">暂无已保存场景组</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">搭配说明（可选）</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述一下这个搭配的灵感来源或使用场景..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-gray-50 focus:bg-white resize-none h-20"
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            取消
          </button>
          <button
            onClick={handlePublish}
            disabled={!selectedId}
            className={cn(
              "flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-200",
              selectedId
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            发布
          </button>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  return "刚刚";
}
