import type { SceneComboScore } from "@/types";

interface ComboScoreBarProps {
  score: SceneComboScore;
  compact?: boolean;
}

const SCORE_LABELS: { key: keyof SceneComboScore; label: string; icon: string; desc: string }[] = [
  { key: "totalPrice", label: "总价优势", icon: "💰", desc: "总价越低分越高" },
  { key: "reuseRate", label: "素材复用率", icon: "♻️", desc: "跨场景素材复用比例" },
  { key: "styleCoverage", label: "风格覆盖", icon: "🎨", desc: "覆盖风格标签数量" },
  { key: "lensAvoidance", label: "镜头避让", icon: "📷", desc: "元素避开镜头区域" },
  { key: "colorHarmony", label: "色彩协调", icon: "🌈", desc: "配色和谐程度" },
  { key: "shoppingListDiff", label: "清单差异", icon: "🛒", desc: "购物清单重叠率" },
];

function getScoreColor(value: number): string {
  if (value >= 80) return "bg-emerald-400";
  if (value >= 60) return "bg-amber-400";
  return "bg-red-400";
}

function getScoreTextColor(value: number): string {
  if (value >= 80) return "text-emerald-600";
  if (value >= 60) return "text-amber-600";
  return "text-red-500";
}

function getScoreBadge(value: number): string {
  if (value >= 80) return "bg-emerald-50 text-emerald-600 border-emerald-200";
  if (value >= 60) return "bg-amber-50 text-amber-600 border-amber-200";
  return "bg-red-50 text-red-600 border-red-200";
}

export function ComboScoreBar({ score, compact = false }: ComboScoreBarProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {SCORE_LABELS.map(({ key, label, icon }) => {
          const value = key === "totalPrice"
            ? Math.max(0, 100 - (score[key] as number) / 5)
            : (score[key] as number);
          const displayValue = Math.round(value);

          return (
            <span
              key={key}
              className={`px-2 py-0.5 text-[10px] rounded-full border ${getScoreBadge(displayValue)}`}
            >
              {icon} {label} {displayValue}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-1.5 flex-1">
      {SCORE_LABELS.map(({ key, label, icon }) => {
        const value = key === "totalPrice"
          ? Math.max(0, 100 - (score[key] as number) / 5)
          : (score[key] as number);
        const displayValue = Math.round(value);
        const barWidth = Math.min(100, displayValue);

        return (
          <div key={key} className="flex items-center gap-2 text-xs group">
            <span className="w-4 text-center flex-shrink-0">{icon}</span>
            <span className="w-16 text-gray-500 flex-shrink-0">{label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getScoreColor(barWidth)}`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <span className={`w-8 text-right font-medium flex-shrink-0 ${getScoreTextColor(barWidth)}`}>
              {displayValue}
            </span>
          </div>
        );
      })}
    </div>
  );
}
