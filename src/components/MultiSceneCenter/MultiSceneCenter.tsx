import { useMultiSceneStore } from "@/store/useMultiSceneStore";
import { useDesignStore } from "@/store/useDesignStore";
import type { ScenePlan, SceneType, CaseTemplate, SceneCombo, SceneGroup, ProjectTag, Asset } from "@/types";
import { ALL_SCENE_TYPES, SCENE_ICONS, SCENE_COLORS, ALL_TAGS } from "@/types";
import { phoneModels } from "@/data/phoneModels";
import { assets, getAssetById } from "@/data/assets";
import { generateShoppingList, calculateTotal } from "@/utils/shoppingList";
import { getComboDescription } from "@/utils/sceneRecommendationEngine";
import { exportAsImage } from "@/utils/exportImage";
import { cn } from "@/lib/utils";
import {
  X,
  Plus,
  Trash2,
  Eye,
  Check,
  Save,
  RefreshCw,
  Copy,
  ShoppingBag,
  Layers,
  Download,
  Palette,
  Sparkles,
  DollarSign,
  LayoutGrid,
  ArrowUpDown,
  Clock,
  Image,
  Tag,
  ChevronDown,
  ChevronUp,
  Sticker,
  CircleDot,
  Type,
  ZoomIn,
} from "lucide-react";
import { CaseRenderer } from "@/components/Canvas/CaseRenderer";
import { ComboScoreBar } from "./ComboScoreBar";
import { useState, useRef, useCallback } from "react";

type TabType = "scenes" | "combos" | "history";

export function MultiSceneCenter() {
  const [activeTab, setActiveTab] = useState<TabType>("scenes");
  const [newGroupName, setNewGroupName] = useState("");
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [selectedComboId, setSelectedComboId] = useState<string | null>(null);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [showSaveGroupModal, setShowSaveGroupModal] = useState(false);

  const isOpen = useMultiSceneStore((s) => s.isOpen);
  const setOpen = useMultiSceneStore((s) => s.setOpen);
  const sceneGroups = useMultiSceneStore((s) => s.sceneGroups);
  const currentGroupId = useMultiSceneStore((s) => s.currentGroupId);
  const combos = useMultiSceneStore((s) => s.combos);
  const isGeneratingCombos = useMultiSceneStore((s) => s.isGeneratingCombos);
  const previewSceneId = useMultiSceneStore((s) => s.previewSceneId);

  const createSceneGroup = useMultiSceneStore((s) => s.createSceneGroup);
  const deleteSceneGroup = useMultiSceneStore((s) => s.deleteSceneGroup);
  const renameSceneGroup = useMultiSceneStore((s) => s.renameSceneGroup);
  const addSceneToGroup = useMultiSceneStore((s) => s.addSceneToGroup);
  const removeSceneFromGroup = useMultiSceneStore((s) => s.removeSceneFromGroup);
  const updateScenePlan = useMultiSceneStore((s) => s.updateScenePlan);
  const setCurrentGroup = useMultiSceneStore((s) => s.setCurrentGroup);
  const setPreviewScene = useMultiSceneStore((s) => s.setPreviewScene);
  const generateCombos = useMultiSceneStore((s) => s.generateCombos);
  const applySceneToCanvas = useMultiSceneStore((s) => s.applySceneToCanvas);
  const saveCurrentGroup = useMultiSceneStore((s) => s.saveCurrentGroup);
  const duplicateScene = useMultiSceneStore((s) => s.duplicateScene);
  const batchApplyCombo = useMultiSceneStore((s) => s.batchApplyCombo);

  const phoneModelId = useDesignStore((s) => s.phoneModel);

  const currentGroup = sceneGroups.find((g) => g.id === currentGroupId);
  const phoneModel = phoneModels.find((m) => m.id === (currentGroup?.phoneModel || phoneModelId)) || phoneModels[0];

  const handleClose = () => {
    setPreviewScene(null);
    setOpen(false);
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const id = createSceneGroup(newGroupName.trim(), phoneModelId);
    setCurrentGroup(id);
    setNewGroupName("");
    setShowNewGroupForm(false);
  };

  const handleAddScene = (sceneType: SceneType) => {
    if (!currentGroupId) return;
    addSceneToGroup(currentGroupId, sceneType);
  };

  const handleGenerateCombos = () => {
    if (!currentGroupId) return;
    generateCombos(currentGroupId);
  };

  const handleApplyScene = (sceneId: string) => {
    if (!currentGroupId) return;
    applySceneToCanvas(currentGroupId, sceneId);
    setPreviewScene(null);
  };

  const handleApplyCombo = (combo: SceneCombo) => {
    const group = batchApplyCombo(combo.id);
    if (group) {
      setCurrentGroup(group.id);
    }
  };

  const handleSaveGroup = () => {
    saveCurrentGroup();
    setShowSaveGroupModal(false);
  };

  const handleExportSceneJSON = (scene: ScenePlan) => {
    const data = JSON.stringify(scene, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${scene.sceneType}-scene-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportGroupJSON = () => {
    if (!currentGroup) return;
    const data = JSON.stringify(currentGroup, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentGroup.name}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const tabs: { key: TabType; label: string; icon: typeof LayoutGrid }[] = [
    { key: "scenes", label: "场景管理", icon: LayoutGrid },
    { key: "combos", label: "方案对比", icon: ArrowUpDown },
    { key: "history", label: "历史方案", icon: Clock },
  ];

  const existingSceneTypes = new Set(currentGroup?.scenes.map((s) => s.sceneType) || []);
  const availableSceneTypes = ALL_SCENE_TYPES.filter((t) => !existingSceneTypes.has(t));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-pop w-full max-w-5xl mx-4 animate-scale-in overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 border-b border-white/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-gray-800">多场景智能搭配与方案对比中心</h2>
              <p className="text-sm text-gray-500">围绕同一机型创建多场景搭配，跨场景推荐对比</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-white/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex border-b border-gray-100 flex-shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all border-b-2",
                  activeTab === tab.key
                    ? "text-teal-600 border-teal-500 bg-teal-50/50"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-auto p-5">
          {activeTab === "scenes" && (
            <ScenesTab
              currentGroup={currentGroup}
              currentGroupId={currentGroupId}
              sceneGroups={sceneGroups}
              phoneModel={phoneModel}
              previewSceneId={previewSceneId}
              editingSceneId={editingSceneId}
              showNewGroupForm={showNewGroupForm}
              newGroupName={newGroupName}
              availableSceneTypes={availableSceneTypes}
              onSetCurrentGroup={setCurrentGroup}
              onCreateGroup={handleCreateGroup}
              onAddScene={handleAddScene}
              onRemoveScene={removeSceneFromGroup}
              onUpdateScene={updateScenePlan}
              onDuplicateScene={duplicateScene}
              onApplyScene={handleApplyScene}
              onPreviewScene={setPreviewScene}
              onEditScene={setEditingSceneId}
              onDeleteGroup={deleteSceneGroup}
              onRenameGroup={renameSceneGroup}
              onExportScene={handleExportSceneJSON}
              onExportGroup={handleExportGroupJSON}
              onSaveGroup={() => setShowSaveGroupModal(true)}
              setShowNewGroupForm={setShowNewGroupForm}
              setNewGroupName={setNewGroupName}
            />
          )}
          {activeTab === "combos" && (
            <CombosTab
              combos={combos}
              isGenerating={isGeneratingCombos}
              currentGroupId={currentGroupId}
              phoneModel={phoneModel}
              selectedComboId={selectedComboId}
              previewSceneId={previewSceneId}
              onGenerate={handleGenerateCombos}
              onApplyCombo={handleApplyCombo}
              onApplyScene={handleApplyScene}
              onPreviewScene={setPreviewScene}
              onSelectCombo={setSelectedComboId}
              onExportScene={handleExportSceneJSON}
            />
          )}
          {activeTab === "history" && <HistoryTab />}
        </div>

        {previewSceneId && (
          <div className="p-3 bg-teal-50 border-t border-teal-100 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-500" />
              <span className="text-sm text-teal-700">正在预览场景方案</span>
            </div>
            <button
              onClick={() => setPreviewScene(null)}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              退出预览
            </button>
          </div>
        )}
      </div>

      {showSaveGroupModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-pop w-full max-w-md mx-4 animate-scale-in overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-teal-50 to-blue-50 border-b border-white/80">
              <h3 className="text-lg font-display font-bold text-gray-800">保存场景组</h3>
              <p className="text-sm text-gray-500 mt-1">将整组场景保存到 localStorage</p>
            </div>
            <div className="p-6 pt-4 flex gap-3">
              <button
                onClick={() => setShowSaveGroupModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                取消
              </button>
              <button
                onClick={handleSaveGroup}
                className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all font-medium text-sm"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ScenesTabProps {
  currentGroup: SceneGroup | undefined;
  currentGroupId: string | null;
  sceneGroups: SceneGroup[];
  phoneModel: typeof phoneModels[0];
  previewSceneId: string | null;
  editingSceneId: string | null;
  showNewGroupForm: boolean;
  newGroupName: string;
  availableSceneTypes: SceneType[];
  onSetCurrentGroup: (id: string | null) => void;
  onCreateGroup: () => void;
  onAddScene: (sceneType: SceneType) => void;
  onRemoveScene: (groupId: string, sceneId: string) => void;
  onUpdateScene: (groupId: string, sceneId: string, updates: Partial<ScenePlan>) => void;
  onDuplicateScene: (groupId: string, sceneId: string) => void;
  onApplyScene: (sceneId: string) => void;
  onPreviewScene: (id: string | null) => void;
  onEditScene: (id: string | null) => void;
  onDeleteGroup: (id: string) => void;
  onRenameGroup: (id: string, name: string) => void;
  onExportScene: (scene: ScenePlan) => void;
  onExportGroup: () => void;
  onSaveGroup: () => void;
  setShowNewGroupForm: (v: boolean) => void;
  setNewGroupName: (v: string) => void;
}

function ScenesTab({
  currentGroup,
  currentGroupId,
  sceneGroups,
  phoneModel,
  previewSceneId,
  editingSceneId,
  showNewGroupForm,
  newGroupName,
  availableSceneTypes,
  onSetCurrentGroup,
  onCreateGroup,
  onAddScene,
  onRemoveScene,
  onUpdateScene,
  onDuplicateScene,
  onApplyScene,
  onPreviewScene,
  onEditScene,
  onDeleteGroup,
  onRenameGroup,
  onExportScene,
  onExportGroup,
  onSaveGroup,
  setShowNewGroupForm,
  setNewGroupName,
}: ScenesTabProps) {
  const [editingGroupName, setEditingGroupName] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  const handleStartRename = (groupId: string, currentName: string) => {
    setEditingGroupName(groupId);
    setTempName(currentName);
  };

  const handleFinishRename = () => {
    if (editingGroupName && tempName.trim()) {
      onRenameGroup(editingGroupName, tempName.trim());
    }
    setEditingGroupName(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={currentGroupId || ""}
            onChange={(e) => onSetCurrentGroup(e.target.value || null)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-200"
          >
            <option value="">选择场景组...</option>
            {sceneGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.scenes.length} 场景)
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowNewGroupForm(true)}
            className="flex items-center gap-1 px-3 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            新建组
          </button>
        </div>

        {currentGroup && (
          <div className="flex items-center gap-2">
            <button
              onClick={onSaveGroup}
              className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:shadow-md text-sm transition-all"
            >
              <Save className="w-4 h-4" />
              保存组
            </button>
            <button
              onClick={onExportGroup}
              className="flex items-center gap-1 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              导出组
            </button>
            <button
              onClick={() => onDeleteGroup(currentGroup.id)}
              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
              title="删除场景组"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {showNewGroupForm && (
        <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="输入场景组名称..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && onCreateGroup()}
            />
            <button
              onClick={onCreateGroup}
              disabled={!newGroupName.trim()}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                newGroupName.trim()
                  ? "bg-teal-500 text-white hover:bg-teal-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              创建
            </button>
            <button
              onClick={() => setShowNewGroupForm(false)}
              className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {currentGroup && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {editingGroupName === currentGroup.id ? (
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleFinishRename}
                onKeyDown={(e) => e.key === "Enter" && handleFinishRename()}
                className="px-2 py-1 border border-teal-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
                autoFocus
              />
            ) : (
              <h3
                className="text-base font-bold text-gray-800 cursor-pointer hover:text-teal-600"
                onClick={() => handleStartRename(currentGroup.id, currentGroup.name)}
              >
                {currentGroup.name}
              </h3>
            )}
            <span className="text-xs text-gray-400">{currentGroup.scenes.length} 个场景</span>
          </div>

          {currentGroup.scenes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentGroup.scenes.map((scene) => (
                <SceneCard
                  key={scene.id}
                  scene={scene}
                  groupId={currentGroup.id}
                  phoneModel={phoneModel}
                  isPreviewing={previewSceneId === scene.id}
                  isEditing={editingSceneId === scene.id}
                  onPreviewToggle={() => onPreviewScene(previewSceneId === scene.id ? null : scene.id)}
                  onApply={() => onApplyScene(scene.id)}
                  onRemove={() => onRemoveScene(currentGroup.id, scene.id)}
                  onDuplicate={() => onDuplicateScene(currentGroup.id, scene.id)}
                  onEdit={() => onEditScene(editingSceneId === scene.id ? null : scene.id)}
                  onUpdate={(updates) => onUpdateScene(currentGroup.id, scene.id, updates)}
                  onExport={() => onExportScene(scene)}
                />
              ))}
            </div>
          )}

          {availableSceneTypes.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-3">添加场景</p>
              <div className="flex flex-wrap gap-2">
                {availableSceneTypes.map((sceneType) => (
                  <button
                    key={sceneType}
                    onClick={() => onAddScene(sceneType)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-dashed border-gray-300 text-gray-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                  >
                    <span>{SCENE_ICONS[sceneType]}</span>
                    <span>{sceneType}</span>
                    <Plus className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!currentGroup && !showNewGroupForm && (
        <div className="py-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center">
            <LayoutGrid className="w-10 h-10 text-teal-400" />
          </div>
          <h3 className="text-base font-medium text-gray-700 mb-2">选择或创建场景组</h3>
          <p className="text-sm text-gray-400 mb-6">
            围绕同一手机机型创建"通勤 / 约会 / 节日 / 旅行 / 礼物"多场景搭配计划
          </p>
          <button
            onClick={() => setShowNewGroupForm(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm font-medium inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新建场景组
          </button>
        </div>
      )}
    </div>
  );
}

interface SceneCardProps {
  scene: ScenePlan;
  groupId: string;
  phoneModel: typeof phoneModels[0];
  isPreviewing: boolean;
  isEditing: boolean;
  onPreviewToggle: () => void;
  onApply: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onUpdate: (updates: Partial<ScenePlan>) => void;
  onExport: () => void;
}

function SceneCard({
  scene,
  groupId,
  phoneModel,
  isPreviewing,
  isEditing,
  onPreviewToggle,
  onApply,
  onRemove,
  onDuplicate,
  onEdit,
  onUpdate,
  onExport,
}: SceneCardProps) {
  const [assetPickerType, setAssetPickerType] = useState<Asset["type"] | null>(null);
  const [newTextLabel, setNewTextLabel] = useState("");
  const [expandedElements, setExpandedElements] = useState(false);
  const scenePreviewRef = useRef<HTMLDivElement>(null);

  const addAssetToScene = useMultiSceneStore((s) => s.addAssetToScene);
  const removeElementFromScene = useMultiSceneStore((s) => s.removeElementFromScene);
  const addTagToScene = useMultiSceneStore((s) => s.addTagToScene);
  const removeTagFromScene = useMultiSceneStore((s) => s.removeTagFromScene);
  const addTextLabelToScene = useMultiSceneStore((s) => s.addTextLabelToScene);

  const sortedElements = [...scene.elements].sort((a, b) => a.zIndex - b.zIndex);
  const items = generateShoppingList(scene.elements, scene.caseTemplate);
  const totalPrice = calculateTotal(items);
  const assetCount = scene.elements.filter((e) => e.assetId).length;
  const sceneColor = SCENE_COLORS[scene.sceneType];
  const overBudget = totalPrice > scene.budgetLimit;

  const caseTemplates: { value: CaseTemplate; label: string }[] = [
    { value: "transparent", label: "透明" },
    { value: "solid", label: "纯色" },
    { value: "mirror", label: "镜面" },
  ];

  const filteredAssets = assetPickerType
    ? assets.filter((a) => a.type === assetPickerType)
    : [];

  const handleAddAsset = (assetId: string) => {
    const x = 30 + Math.random() * 40;
    const y = 30 + Math.random() * 40;
    addAssetToScene(groupId, scene.id, assetId, x, y);
  };

  const handleRemoveElement = (elementId: string) => {
    removeElementFromScene(groupId, scene.id, elementId);
  };

  const handleAddTag = (tag: ProjectTag) => {
    addTagToScene(groupId, scene.id, tag);
  };

  const handleRemoveTag = (tag: ProjectTag) => {
    removeTagFromScene(groupId, scene.id, tag);
  };

  const handleAddTextLabel = () => {
    if (!newTextLabel.trim()) return;
    addTextLabelToScene(groupId, scene.id, newTextLabel.trim());
    setNewTextLabel("");
  };

  const handleExportImage = async () => {
    if (scenePreviewRef.current) {
      try {
        await exportAsImage(scenePreviewRef.current, `${scene.sceneType}-scene-${Date.now()}`);
      } catch (e) {
        console.error("Export image failed", e);
      }
    }
  };

  const assetPickerTypes: { type: Asset["type"]; label: string; icon: typeof Sticker }[] = [
    { type: "sticker", label: "贴纸", icon: Sticker },
    { type: "charm", label: "挂件", icon: Layers },
    { type: "lens-ring", label: "镜头圈", icon: CircleDot },
  ];

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-soft overflow-hidden transition-all duration-200 border-2",
        isPreviewing ? "border-teal-400 shadow-lg" : "border-transparent"
      )}
    >
      <div
        ref={scenePreviewRef}
        className="relative aspect-[9/16] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 overflow-hidden"
      >
        <div
          className="absolute top-2 left-2 z-10 px-2 py-1 text-white text-xs rounded-full flex items-center gap-1"
          style={{ backgroundColor: sceneColor }}
        >
          <span>{SCENE_ICONS[scene.sceneType]}</span>
          {scene.sceneType}
        </div>

        {overBudget && (
          <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            超预算
          </div>
        )}

        {isPreviewing && (
          <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-teal-500 text-white text-xs rounded-full flex items-center gap-1">
            <Eye className="w-3 h-3" />
            预览中
          </div>
        )}

        <div
          className="relative shadow-md"
          style={{
            width: phoneModel.width * 0.45,
            height: phoneModel.height * 0.45,
            borderRadius: phoneModel.cornerRadius * 0.45,
          }}
        >
          <CaseRenderer
            phoneModel={phoneModel}
            caseTemplate={scene.caseTemplate}
            caseColor={scene.caseColor}
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: phoneModel.cornerRadius * 0.45 }}
          >
            {sortedElements.map((element) => {
              const asset = element.assetId ? getAssetById(element.assetId) : null;
              return (
                <div
                  key={element.id}
                  className="absolute"
                  style={{
                    left: `${element.x}%`,
                    top: `${element.y}%`,
                    width: element.width * 0.45,
                    height: element.height * 0.45,
                    transform: `translate(-50%, -50%) rotate(${element.rotation}deg) scale(${element.scale || 1})`,
                    opacity: element.opacity,
                    zIndex: element.zIndex,
                  }}
                >
                  {element.type === "text" ? (
                    <div
                      className="w-full h-full flex items-center justify-center whitespace-nowrap"
                      style={{
                        color: element.color || "#333",
                        fontSize: (element.fontSize || 16) * 0.45,
                        fontWeight: element.fontWeight || 500,
                      }}
                    >
                      {element.content || "文字"}
                    </div>
                  ) : asset ? (
                    <img
                      src={asset.thumbnail}
                      alt={asset.name}
                      className="w-full h-full object-contain select-none pointer-events-none"
                      draggable={false}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <span style={{ color: sceneColor }} className="text-sm font-bold">
              {scene.sceneType}
            </span>
            <span className="text-xs text-gray-400">场景</span>
          </div>
          <div className="flex items-center gap-1">
            <ShoppingBag className={cn("w-3 h-3", overBudget ? "text-red-500" : "text-rose-500")} />
            <span className={cn("text-sm font-bold", overBudget ? "text-red-500" : "text-rose-500")}>¥{totalPrice}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {scene.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-[10px] bg-teal-50 text-teal-600 rounded-full"
            >
              {tag}
            </span>
          ))}
          <span className="px-1.5 py-0.5 text-[10px] bg-gray-50 text-gray-500 rounded-full flex items-center gap-0.5">
            <Layers className="w-2.5 h-2.5" />
            {assetCount}素材
          </span>
          <span className={cn(
            "px-1.5 py-0.5 text-[10px] rounded-full flex items-center gap-0.5",
            overBudget ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-500"
          )}>
            <DollarSign className="w-2.5 h-2.5" />
            预算¥{scene.budgetLimit}
          </span>
        </div>

        {isEditing && (
          <div className="space-y-3 mb-3 p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">壳模板</label>
              <div className="flex gap-1">
                {caseTemplates.map((ct) => (
                  <button
                    key={ct.value}
                    onClick={() => onUpdate({ caseTemplate: ct.value })}
                    className={cn(
                      "px-2 py-1 text-xs rounded transition-colors",
                      scene.caseTemplate === ct.value
                        ? "bg-teal-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">配色</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={scene.caseColor}
                  onChange={(e) => onUpdate({ caseColor: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-0"
                />
                <span className="text-xs text-gray-400">{scene.caseColor}</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">预算上限</label>
              <input
                type="number"
                value={scene.budgetLimit}
                onChange={(e) => onUpdate({ budgetLimit: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-200"
                min={0}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">标签</label>
              <div className="flex flex-wrap gap-1 mb-1">
                {scene.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs bg-teal-50 text-teal-600 rounded-full flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-teal-400 hover:text-teal-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {ALL_TAGS.filter((t) => !scene.tags.includes(t)).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">添加素材</label>
              <div className="flex gap-1 mb-2">
                {assetPickerTypes.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setAssetPickerType(assetPickerType === type ? null : type)}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 text-xs rounded-lg transition-colors",
                      assetPickerType === type
                        ? "bg-teal-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                ))}
              </div>

              {assetPickerType && (
                <div className="max-h-32 overflow-y-auto p-2 bg-white rounded-lg border border-gray-200">
                  <div className="flex flex-wrap gap-1.5">
                    {filteredAssets.map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => handleAddAsset(asset.id)}
                        className={cn(
                          "w-10 h-10 rounded-lg border-2 overflow-hidden transition-all hover:scale-110",
                          "border-gray-200 hover:border-teal-400"
                        )}
                        title={asset.name}
                      >
                        <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setExpandedElements(!expandedElements)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-teal-600 transition-colors"
              >
                {expandedElements ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                已添加元素 ({scene.elements.length})
              </button>
              {expandedElements && (
                <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                  {scene.elements.map((element) => {
                    const asset = element.assetId ? getAssetById(element.assetId) : null;
                    return (
                      <div
                        key={element.id}
                        className="flex items-center justify-between px-2 py-1 bg-white rounded border border-gray-100 text-xs"
                      >
                        <div className="flex items-center gap-1.5">
                          {asset ? (
                            <img src={asset.thumbnail} alt={asset.name} className="w-5 h-5 rounded object-cover" />
                          ) : (
                            <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
                              <Type className="w-3 h-3 text-gray-400" />
                            </div>
                          )}
                          <span className="text-gray-700 truncate max-w-[100px]">
                            {asset?.name || element.content || "元素"}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveElement(element.id)}
                          className="text-red-400 hover:text-red-600 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">文字标签</label>
              <div className="flex flex-wrap gap-1 mb-1">
                {scene.textLabels.map((label, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full flex items-center gap-1"
                  >
                    {label}
                    <button
                      onClick={() =>
                        onUpdate({
                          textLabels: scene.textLabels.filter((_, i) => i !== idx),
                        })
                      }
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newTextLabel}
                  onChange={(e) => setNewTextLabel(e.target.value)}
                  placeholder="输入标签..."
                  className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-200"
                  onKeyDown={(e) => e.key === "Enter" && handleAddTextLabel()}
                />
                <button
                  onClick={handleAddTextLabel}
                  disabled={!newTextLabel.trim()}
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-1.5">
          <button
            onClick={onPreviewToggle}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1",
              isPreviewing ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <Eye className="w-3 h-3" />
            {isPreviewing ? "取消" : "预览"}
          </button>
          <button
            onClick={onApply}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:shadow-md transition-all flex items-center justify-center gap-1"
          >
            <Check className="w-3 h-3" />
            应用
          </button>
          <button onClick={onEdit} className="p-1.5 rounded-lg text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all" title="编辑">
            <Palette className="w-3 h-3" />
          </button>
          <button onClick={onDuplicate} className="p-1.5 rounded-lg text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all" title="复制">
            <Copy className="w-3 h-3" />
          </button>
          <button onClick={handleExportImage} className="p-1.5 rounded-lg text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all" title="导出预览图">
            <Image className="w-3 h-3" />
          </button>
          <button onClick={onExport} className="p-1.5 rounded-lg text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all" title="导出JSON">
            <Download className="w-3 h-3" />
          </button>
          <button onClick={onRemove} className="p-1.5 rounded-lg text-xs bg-gray-100 text-red-400 hover:bg-red-50 transition-all" title="删除">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface CombosTabProps {
  combos: SceneCombo[];
  isGenerating: boolean;
  currentGroupId: string | null;
  phoneModel: typeof phoneModels[0];
  selectedComboId: string | null;
  previewSceneId: string | null;
  onGenerate: () => void;
  onApplyCombo: (combo: SceneCombo) => void;
  onApplyScene: (sceneId: string) => void;
  onPreviewScene: (id: string | null) => void;
  onSelectCombo: (id: string | null) => void;
  onExportScene: (scene: ScenePlan) => void;
}

function CombosTab({
  combos,
  isGenerating,
  currentGroupId,
  phoneModel,
  selectedComboId,
  previewSceneId,
  onGenerate,
  onApplyCombo,
  onApplyScene,
  onPreviewScene,
  onSelectCombo,
  onExportScene,
}: CombosTabProps) {
  const [viewMode, setViewMode] = useState<"cards" | "compare">("cards");
  const selectedCombo = combos.find((c) => c.id === selectedComboId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {isGenerating ? "正在生成推荐组合..." : combos.length > 0 ? `共 ${combos.length} 组推荐方案` : "点击生成跨场景推荐组合"}
        </p>
        <div className="flex items-center gap-2">
          {combos.length > 0 && (
            <div className="flex items-center gap-1 p-0.5 bg-gray-100 rounded-lg">
              <button
                onClick={() => setViewMode("cards")}
                className={cn(
                  "px-2 py-1 text-xs rounded-md transition-colors",
                  viewMode === "cards" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500"
                )}
              >
                卡片
              </button>
              <button
                onClick={() => setViewMode("compare")}
                className={cn(
                  "px-2 py-1 text-xs rounded-md transition-colors",
                  viewMode === "compare" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500"
                )}
              >
                横向对比
              </button>
            </div>
          )}
          <button
            onClick={onGenerate}
            disabled={isGenerating || !currentGroupId}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-all",
              isGenerating || !currentGroupId
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-teal-50 text-teal-600 hover:bg-teal-100"
            )}
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isGenerating && "animate-spin")} />
            生成推荐
          </button>
        </div>
      </div>

      {!currentGroupId && (
        <div className="py-8 text-center text-sm text-gray-400">
          请先在"场景管理"中创建或选择一个场景组
        </div>
      )}

      {viewMode === "compare" && combos.length > 0 && (
        <HorizontalCompareView
          combos={combos}
          phoneModel={phoneModel}
          onApplyCombo={onApplyCombo}
          onApplyScene={onApplyScene}
          onPreviewScene={onPreviewScene}
          previewSceneId={previewSceneId}
        />
      )}

      {viewMode === "cards" && combos.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className={cn(
                "bg-white rounded-xl shadow-soft overflow-hidden border-2 transition-all cursor-pointer",
                selectedComboId === combo.id ? "border-teal-400 shadow-lg" : "border-transparent hover:border-gray-200"
              )}
              onClick={() => onSelectCombo(selectedComboId === combo.id ? null : combo.id)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">{combo.name}</h3>
                      <p className="text-[10px] text-gray-400">{getComboDescription(combo.name)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-teal-600">{combo.score.overall}</div>
                      <div className="text-[10px] text-gray-400">综合评分</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onApplyCombo(combo);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      应用整组
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 mb-3">
                  <ComboScoreBar score={combo.score} />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {combo.scenes.map((scene) => {
                    const sceneColor = SCENE_COLORS[scene.sceneType];
                    const items = generateShoppingList(scene.elements, scene.caseTemplate);
                    const totalPrice = calculateTotal(items);
                    const sortedElements = [...scene.elements].sort((a, b) => a.zIndex - b.zIndex);

                    return (
                      <div
                        key={scene.id}
                        className="flex-shrink-0 w-36 bg-gray-50 rounded-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-2">
                          <div className="absolute top-1 left-1 z-10 px-1.5 py-0.5 text-white text-[9px] rounded-full" style={{ backgroundColor: sceneColor }}>
                            {SCENE_ICONS[scene.sceneType]} {scene.sceneType}
                          </div>
                          <div
                            className="relative shadow-sm"
                            style={{
                              width: phoneModel.width * 0.25,
                              height: phoneModel.height * 0.25,
                              borderRadius: phoneModel.cornerRadius * 0.25,
                            }}
                          >
                            <CaseRenderer phoneModel={phoneModel} caseTemplate={scene.caseTemplate} caseColor={scene.caseColor} />
                            <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: phoneModel.cornerRadius * 0.25 }}>
                              {sortedElements.map((element) => {
                                const asset = element.assetId ? getAssetById(element.assetId) : null;
                                return (
                                  <div
                                    key={element.id}
                                    className="absolute"
                                    style={{
                                      left: `${element.x}%`,
                                      top: `${element.y}%`,
                                      width: element.width * 0.25,
                                      height: element.height * 0.25,
                                      transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
                                      opacity: element.opacity,
                                      zIndex: element.zIndex,
                                    }}
                                  >
                                    {element.type === "text" ? (
                                      <div className="w-full h-full flex items-center justify-center whitespace-nowrap" style={{ color: element.color || "#333", fontSize: (element.fontSize || 16) * 0.25 }}>
                                        {element.content || "文字"}
                                      </div>
                                    ) : asset ? (
                                      <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-contain select-none pointer-events-none" draggable={false} />
                                    ) : null}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span style={{ color: sceneColor }} className="font-medium">{scene.sceneType}</span>
                            <span className="text-rose-500 font-bold">¥{totalPrice}</span>
                          </div>
                          <div className="flex gap-1 mt-1">
                            <button
                              onClick={() => onPreviewScene(previewSceneId === scene.id ? null : scene.id)}
                              className="flex-1 py-1 text-[10px] bg-white text-gray-600 rounded hover:bg-gray-100 transition-colors"
                            >
                              预览
                            </button>
                            <button
                              onClick={() => onApplyScene(scene.id)}
                              className="flex-1 py-1 text-[10px] bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                            >
                              应用
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentGroupId && combos.length === 0 && !isGenerating && (
        <div className="py-8 text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-teal-50 rounded-full flex items-center justify-center">
            <ArrowUpDown className="w-8 h-8 text-teal-400" />
          </div>
          <p className="text-sm text-gray-500 mb-2">尚未生成推荐组合</p>
          <p className="text-xs text-gray-400">基于当前素材库、机型镜头区域和已保存方案，生成不少于3组跨场景推荐</p>
        </div>
      )}

      {isGenerating && (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-xl overflow-hidden animate-pulse">
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="w-36 h-48 bg-gray-200 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface HorizontalCompareViewProps {
  combos: SceneCombo[];
  phoneModel: typeof phoneModels[0];
  onApplyCombo: (combo: SceneCombo) => void;
  onApplyScene: (sceneId: string) => void;
  onPreviewScene: (id: string | null) => void;
  previewSceneId: string | null;
}

function HorizontalCompareView({
  combos,
  phoneModel,
  onApplyCombo,
  onApplyScene,
  onPreviewScene,
  previewSceneId,
}: HorizontalCompareViewProps) {
  const SCORE_DIMENSIONS: { key: keyof SceneCombo["score"]; label: string; icon: string; format?: (v: number) => string }[] = [
    { key: "totalPrice", label: "总价", icon: "💰", format: (v) => `¥${v}` },
    { key: "reuseRate", label: "素材复用率", icon: "♻️", format: (v) => `${v}%` },
    { key: "styleCoverage", label: "风格覆盖", icon: "🎨", format: (v) => `${v}%` },
    { key: "lensAvoidance", label: "镜头避让", icon: "📷", format: (v) => `${v}%` },
    { key: "colorHarmony", label: "色彩协调", icon: "🌈", format: (v) => `${v}%` },
    { key: "shoppingListDiff", label: "清单差异", icon: "🛒", format: (v) => `${v}%` },
  ];

  function getScoreBg(value: number, isPrice: boolean): string {
    if (isPrice) {
      if (value < 200) return "bg-emerald-50 text-emerald-700";
      if (value < 400) return "bg-amber-50 text-amber-700";
      return "bg-red-50 text-red-700";
    }
    if (value >= 80) return "bg-emerald-50 text-emerald-700";
    if (value >= 60) return "bg-amber-50 text-amber-700";
    return "bg-red-50 text-red-700";
  }

  function getScoreBar(value: number, isPrice: boolean): { width: number; color: string } {
    if (isPrice) {
      const score = Math.max(0, 100 - value / 5);
      return { width: Math.min(100, score), color: score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#f87171" };
    }
    return { width: Math.min(100, value), color: value >= 80 ? "#34d399" : value >= 60 ? "#fbbf24" : "#f87171" };
  }

  const bestComboId = combos.reduce((best, c) => c.score.overall > (combos.find((x) => x.id === best)?.score.overall || 0) ? c.id : best, combos[0]?.id || "");

  return (
    <div className="overflow-x-auto">
      <div className="min-w-fit">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 p-2 w-32 bg-gray-50 sticky left-0 z-10 rounded-tl-lg">
                对比维度
              </th>
              {combos.map((combo) => (
                <th
                  key={combo.id}
                  className={cn(
                    "text-center text-xs font-medium p-2 min-w-[160px]",
                    combo.id === bestComboId ? "bg-teal-50 text-teal-700" : "bg-gray-50 text-gray-700"
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-bold">{combo.name}</span>
                    {combo.id === bestComboId && (
                      <span className="px-1.5 py-0.5 text-[9px] bg-teal-500 text-white rounded-full">最优</span>
                    )}
                    <span className="text-[10px] text-gray-400">{combo.scenes.length} 场景</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCORE_DIMENSIONS.map(({ key, label, icon, format }, idx) => {
              const isPrice = key === "totalPrice";
              const values = combos.map((c) => c.score[key] as number);
              const bestValue = isPrice ? Math.min(...values) : Math.max(...values);

              return (
                <tr key={key} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="text-left text-xs text-gray-600 p-2 bg-gray-50/80 sticky left-0 z-10 flex items-center gap-1.5">
                    <span>{icon}</span>
                    <span>{label}</span>
                  </td>
                  {combos.map((combo) => {
                    const value = combo.score[key] as number;
                    const isBest = value === bestValue;
                    const bar = getScoreBar(value, isPrice);
                    return (
                      <td
                        key={combo.id}
                        className={cn(
                          "text-center p-2",
                          isBest ? "bg-emerald-50/50" : ""
                        )}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded-full",
                            getScoreBg(value, isPrice)
                          )}>
                            {format ? format(value) : value}
                          </span>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${bar.width}%`, backgroundColor: bar.color }}
                            />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            <tr className="bg-teal-50/30">
              <td className="text-left text-xs font-bold text-teal-700 p-2 bg-teal-50/80 sticky left-0 z-10">
                综合评分
              </td>
              {combos.map((combo) => (
                <td key={combo.id} className="text-center p-2">
                  <div className={cn(
                    "text-lg font-bold",
                    combo.id === bestComboId ? "text-teal-600" : "text-gray-700"
                  )}>
                    {combo.score.overall}
                  </div>
                </td>
              ))}
            </tr>

            <tr className="bg-white">
              <td className="text-left text-xs text-gray-600 p-2 bg-gray-50/80 sticky left-0 z-10">
                场景预览
              </td>
              {combos.map((combo) => (
                <td key={combo.id} className="p-2">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {combo.scenes.map((scene) => {
                      const sceneColor = SCENE_COLORS[scene.sceneType];
                      return (
                        <button
                          key={scene.id}
                          onClick={() => onPreviewScene(previewSceneId === scene.id ? null : scene.id)}
                          className="px-1.5 py-0.5 text-[9px] rounded-full text-white hover:scale-110 transition-transform"
                          style={{ backgroundColor: sceneColor }}
                        >
                          {SCENE_ICONS[scene.sceneType]} {scene.sceneType}
                        </button>
                      );
                    })}
                  </div>
                </td>
              ))}
            </tr>

            <tr className="bg-gray-50/50">
              <td className="text-left text-xs text-gray-600 p-2 bg-gray-50/80 sticky left-0 z-10 rounded-bl-lg">
                操作
              </td>
              {combos.map((combo) => (
                <td key={combo.id} className="text-center p-2">
                  <button
                    onClick={() => onApplyCombo(combo)}
                    className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg text-[10px] font-medium hover:shadow-md transition-all"
                  >
                    <Check className="w-3 h-3 inline mr-1" />
                    应用整组
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HistoryTab() {
  const getHistoryEntries = useMultiSceneStore((s) => s.getHistoryEntries);
  const historyFilter = useMultiSceneStore((s) => s.historyFilter);
  const historySort = useMultiSceneStore((s) => s.historySort);
  const historyTagFilter = useMultiSceneStore((s) => s.historyTagFilter);
  const setHistoryFilter = useMultiSceneStore((s) => s.setHistoryFilter);
  const setHistorySort = useMultiSceneStore((s) => s.setHistorySort);
  const setHistoryTagFilter = useMultiSceneStore((s) => s.setHistoryTagFilter);

  const loadSceneGroup = useMultiSceneStore((s) => s.loadSceneGroup);
  const deleteSceneGroupFromHistory = useMultiSceneStore((s) => s.deleteSceneGroupFromHistory);
  const setCurrentGroup = useMultiSceneStore((s) => s.setCurrentGroup);
  const restoreSceneFromHistory = useMultiSceneStore((s) => s.restoreSceneFromHistory);

  const loadProject = useDesignStore((s) => s.loadProject);

  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const sceneGroups = useMultiSceneStore((s) => s.sceneGroups);

  const entries = getHistoryEntries();

  const handleLoad = (entry: typeof entries[0]) => {
    if (entry.type === "single") {
      loadProject(entry.id);
    } else {
      loadSceneGroup(entry.id);
      setCurrentGroup(entry.id);
    }
  };

  const handleDelete = (entry: typeof entries[0]) => {
    if (entry.type === "scene-group") {
      deleteSceneGroupFromHistory(entry.id);
    }
  };

  const handleRestoreScene = (groupId: string, sceneId: string) => {
    restoreSceneFromHistory(groupId, sceneId);
  };

  const sortOptions: { value: typeof historySort; label: string }[] = [
    { value: "recent", label: "最近更新" },
    { value: "price-asc", label: "总价从低到高" },
    { value: "asset-count", label: "素材数量" },
    { value: "scene-count", label: "场景数量" },
    { value: "tag-match", label: "标签匹配度" },
  ];

  const filterOptions: { value: typeof historyFilter; label: string }[] = [
    { value: "all", label: "全部" },
    { value: "single", label: "单方案" },
    { value: "scene-group", label: "场景组" },
  ];

  const allTags: ProjectTag[] = [...ALL_TAGS];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setHistoryFilter(opt.value)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full transition-all",
                historyFilter === opt.value
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={historySort}
            onChange={(e) => setHistorySort(e.target.value as typeof historySort)}
            className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() =>
              setHistoryTagFilter(
                historyTagFilter.includes(tag)
                  ? historyTagFilter.filter((t) => t !== tag)
                  : [...historyTagFilter, tag]
              )
            }
            className={cn(
              "px-2 py-1 text-[10px] rounded-full transition-all",
              historyTagFilter.includes(tag)
                ? "bg-teal-500 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            {tag}
          </button>
        ))}
        {historyTagFilter.length > 0 && (
          <button
            onClick={() => setHistoryTagFilter([])}
            className="px-2 py-1 text-[10px] rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300"
          >
            清除
          </button>
        )}
      </div>

      {entries.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {entries.map((entry) => {
            const group = entry.type === "scene-group"
              ? sceneGroups.find((g) => g.id === entry.id)
              : undefined;
            const isExpanded = expandedGroupId === entry.id;

            return (
              <div
                key={entry.id}
                className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="relative aspect-[9/16] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className={cn(
                    "absolute top-2 left-2 z-10 px-2 py-0.5 text-white text-[10px] rounded-full",
                    entry.type === "single" ? "bg-violet-500" : "bg-teal-500"
                  )}>
                    {entry.type === "single" ? "单方案" : "场景组"}
                  </div>
                  {entry.thumbnail ? (
                    <img src={entry.thumbnail} alt={entry.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-300 text-3xl">
                      {entry.type === "single" ? "📱" : "📱📱"}
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h4 className="text-xs font-medium text-gray-800 truncate">{entry.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-rose-500 font-bold">¥{entry.totalPrice}</span>
                    <div className="flex items-center gap-1">
                      {entry.type === "scene-group" && (
                        <span className="text-[10px] text-gray-400">{entry.sceneCount}场景</span>
                      )}
                      <span className="text-[10px] text-gray-400">{entry.assetCount}素材</span>
                    </div>
                  </div>

                  {entry.type === "scene-group" && group && (
                    <div className="mt-1.5">
                      <button
                        onClick={() => setExpandedGroupId(isExpanded ? null : entry.id)}
                        className="text-[10px] text-teal-500 hover:text-teal-600 flex items-center gap-0.5"
                      >
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        恢复单个场景
                      </button>
                      {isExpanded && (
                        <div className="mt-1 space-y-1">
                          {group.scenes.map((scene) => (
                            <button
                              key={scene.id}
                              onClick={() => handleRestoreScene(entry.id, scene.id)}
                              className="w-full flex items-center justify-between px-2 py-1 bg-gray-50 rounded text-[10px] hover:bg-teal-50 transition-colors"
                            >
                              <span className="flex items-center gap-1">
                                <span>{SCENE_ICONS[scene.sceneType]}</span>
                                <span className="text-gray-700">{scene.sceneType}</span>
                              </span>
                              <span className="text-teal-500">恢复</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-1 mt-1.5">
                    <button
                      onClick={() => handleLoad(entry)}
                      className="flex-1 py-1 text-[10px] bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                    >
                      加载
                    </button>
                    <button
                      onClick={() => handleDelete(entry)}
                      className="p-1 text-[10px] text-red-400 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">暂无历史方案</p>
        </div>
      )}
    </div>
  );
}
