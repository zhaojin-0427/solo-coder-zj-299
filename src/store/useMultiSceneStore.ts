import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ScenePlan,
  SceneGroup,
  SceneCombo,
  SceneType,
  CaseTemplate,
  CanvasElement,
  ElementType,
  ProjectTag,
  HistoryEntry,
  HistorySortOption,
  HistoryItemType,
} from "@/types";
import { generateId } from "@/utils/idGenerator";
import { generateShoppingList, calculateTotal } from "@/utils/shoppingList";
import { generateSceneCombos } from "@/utils/sceneRecommendationEngine";
import { phoneModels } from "@/data/phoneModels";
import { assets } from "@/data/assets";
import { useDesignStore } from "@/store/useDesignStore";

interface MultiSceneState {
  isOpen: boolean;
  sceneGroups: SceneGroup[];
  currentGroupId: string | null;
  activeSceneId: string | null;
  combos: SceneCombo[];
  isGeneratingCombos: boolean;
  previewSceneId: string | null;
  historyFilter: HistoryItemType | "all";
  historySort: HistorySortOption;
  historyTagFilter: ProjectTag[];

  setOpen: (open: boolean) => void;
  createSceneGroup: (name: string, phoneModel: string) => string;
  deleteSceneGroup: (groupId: string) => void;
  renameSceneGroup: (groupId: string, name: string) => void;
  addSceneToGroup: (groupId: string, sceneType: SceneType) => void;
  removeSceneFromGroup: (groupId: string, sceneId: string) => void;
  updateScenePlan: (groupId: string, sceneId: string, updates: Partial<ScenePlan>) => void;
  setActiveScene: (sceneId: string | null) => void;
  setCurrentGroup: (groupId: string | null) => void;
  setPreviewScene: (sceneId: string | null) => void;
  generateCombos: (groupId: string) => void;
  applySceneToCanvas: (groupId: string, sceneId: string) => void;
  applyComboToCanvas: (comboId: string, sceneId: string) => void;
  saveCurrentGroup: () => void;
  loadSceneGroup: (groupId: string) => void;
  deleteSceneGroupFromHistory: (groupId: string) => void;
  getHistoryEntries: () => HistoryEntry[];
  setHistoryFilter: (filter: HistoryItemType | "all") => void;
  setHistorySort: (sort: HistorySortOption) => void;
  setHistoryTagFilter: (tags: ProjectTag[]) => void;
  duplicateScene: (groupId: string, sceneId: string) => void;
  batchApplyCombo: (comboId: string) => SceneGroup | null;
  addAssetToScene: (groupId: string, sceneId: string, assetId: string, x: number, y: number) => void;
  removeElementFromScene: (groupId: string, sceneId: string, elementId: string) => void;
  addTagToScene: (groupId: string, sceneId: string, tag: ProjectTag) => void;
  removeTagFromScene: (groupId: string, sceneId: string, tag: ProjectTag) => void;
  addTextLabelToScene: (groupId: string, sceneId: string, label: string) => void;
  restoreSceneFromHistory: (groupId: string, sceneId: string) => void;
  getSceneById: (groupId: string, sceneId: string) => ScenePlan | undefined;
  getSceneShoppingList: (groupId: string, sceneId: string) => { items: ReturnType<typeof generateShoppingList>; total: number };
  getGroupShoppingList: (groupId: string) => { items: ReturnType<typeof generateShoppingList>; total: number };
}

const DEFAULT_BUDGETS: Record<SceneType, number> = {
  "通勤": 80,
  "约会": 120,
  "节日": 100,
  "旅行": 150,
  "礼物": 200,
};

const DEFAULT_CASE_COLORS: Record<SceneType, string> = {
  "通勤": "#667eea",
  "约会": "#f093fb",
  "节日": "#ff6b6b",
  "旅行": "#4ecdc4",
  "礼物": "#ffd93d",
};

function applySceneToDesignStore(scene: ScenePlan) {
  const store = useDesignStore.getState();
  store.pushHistory();
  store.setCaseTemplate(scene.caseTemplate);
  store.setCaseColor(scene.caseColor);
  useDesignStore.setState({
    elements: scene.elements,
    selectedElementId: null,
  });
}

export const useMultiSceneStore = create<MultiSceneState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      sceneGroups: [],
      currentGroupId: null,
      activeSceneId: null,
      combos: [],
      isGeneratingCombos: false,
      previewSceneId: null,
      historyFilter: "all",
      historySort: "recent",
      historyTagFilter: [],

      setOpen: (open) => set({ isOpen: open }),

      createSceneGroup: (name, phoneModel) => {
        const id = generateId();
        const now = Date.now();
        const group: SceneGroup = {
          id,
          name,
          phoneModel,
          scenes: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          sceneGroups: [...state.sceneGroups, group],
          currentGroupId: id,
        }));
        return id;
      },

      deleteSceneGroup: (groupId) => {
        set((state) => ({
          sceneGroups: state.sceneGroups.filter((g) => g.id !== groupId),
          currentGroupId: state.currentGroupId === groupId ? null : state.currentGroupId,
        }));
      },

      renameSceneGroup: (groupId, name) => {
        set((state) => ({
          sceneGroups: state.sceneGroups.map((g) =>
            g.id === groupId ? { ...g, name, updatedAt: Date.now() } : g
          ),
        }));
      },

      addSceneToGroup: (groupId, sceneType) => {
        const scene: ScenePlan = {
          id: generateId(),
          sceneType,
          caseTemplate: "transparent",
          caseColor: DEFAULT_CASE_COLORS[sceneType],
          elements: [],
          textLabels: [],
          budgetLimit: DEFAULT_BUDGETS[sceneType],
          tags: [],
        };
        set((state) => ({
          sceneGroups: state.sceneGroups.map((g) =>
            g.id === groupId
              ? { ...g, scenes: [...g.scenes, scene], updatedAt: Date.now() }
              : g
          ),
        }));
      },

      removeSceneFromGroup: (groupId, sceneId) => {
        set((state) => ({
          sceneGroups: state.sceneGroups.map((g) =>
            g.id === groupId
              ? { ...g, scenes: g.scenes.filter((s) => s.id !== sceneId), updatedAt: Date.now() }
              : g
          ),
          activeSceneId: state.activeSceneId === sceneId ? null : state.activeSceneId,
        }));
      },

      updateScenePlan: (groupId, sceneId, updates) => {
        set((state) => ({
          sceneGroups: state.sceneGroups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  scenes: g.scenes.map((s) =>
                    s.id === sceneId ? { ...s, ...updates } : s
                  ),
                  updatedAt: Date.now(),
                }
              : g
          ),
        }));
      },

      setActiveScene: (sceneId) => set({ activeSceneId: sceneId }),

      setCurrentGroup: (groupId) => set({ currentGroupId: groupId }),

      setPreviewScene: (sceneId) => set({ previewSceneId: sceneId }),

      generateCombos: (groupId) => {
        const { sceneGroups } = get();
        const group = sceneGroups.find((g) => g.id === groupId);
        if (!group) return;

        set({ isGeneratingCombos: true });

        setTimeout(() => {
          const phoneModel = phoneModels.find((m) => m.id === group.phoneModel) || phoneModels[0];
          const combos = generateSceneCombos(group, phoneModel);
          set({ combos, isGeneratingCombos: false });
        }, 500);
      },

      applySceneToCanvas: (groupId, sceneId) => {
        const { sceneGroups } = get();
        const group = sceneGroups.find((g) => g.id === groupId);
        if (!group) return;
        const scene = group.scenes.find((s) => s.id === sceneId);
        if (!scene) return;
        applySceneToDesignStore(scene);
      },

      applyComboToCanvas: (comboId, sceneId) => {
        const { combos } = get();
        const combo = combos.find((c) => c.id === comboId);
        if (!combo) return;
        const scene = combo.scenes.find((s) => s.id === sceneId);
        if (!scene) return;
        applySceneToDesignStore(scene);
      },

      saveCurrentGroup: () => {
        set((state) => ({
          sceneGroups: state.sceneGroups.map((g) =>
            g.id === state.currentGroupId ? { ...g, updatedAt: Date.now() } : g
          ),
        }));
      },

      loadSceneGroup: (groupId) => {
        set({ currentGroupId: groupId });
      },

      deleteSceneGroupFromHistory: (groupId) => {
        set((state) => ({
          sceneGroups: state.sceneGroups.filter((g) => g.id !== groupId),
          currentGroupId: state.currentGroupId === groupId ? null : state.currentGroupId,
        }));
      },

      getHistoryEntries: () => {
        const { sceneGroups, historySort, historyTagFilter, historyFilter } = get();
        const { projects } = useDesignStore.getState();

        const entries: HistoryEntry[] = [];

        if (historyFilter === "all" || historyFilter === "single") {
          projects.forEach((p) => {
            const items = generateShoppingList(p.elements, p.caseTemplate);
            const totalPrice = calculateTotal(items);
            const assetCount = p.elements.filter((e) => e.assetId).length;
            entries.push({
              id: p.id,
              type: "single",
              name: p.name,
              phoneModel: p.phoneModel,
              tags: p.tags,
              updatedAt: p.updatedAt,
              thumbnail: p.thumbnail,
              totalPrice,
              assetCount,
              sceneCount: 1,
            });
          });
        }

        if (historyFilter === "all" || historyFilter === "scene-group") {
          sceneGroups.forEach((g) => {
            let totalPrice = 0;
            let assetCount = 0;
            g.scenes.forEach((s) => {
              const items = generateShoppingList(s.elements, s.caseTemplate);
              totalPrice += calculateTotal(items);
              assetCount += s.elements.filter((e) => e.assetId).length;
            });
            const tags = [...new Set(g.scenes.flatMap((s) => s.tags))];
            entries.push({
              id: g.id,
              type: "scene-group",
              name: g.name,
              phoneModel: g.phoneModel,
              tags,
              updatedAt: g.updatedAt,
              totalPrice,
              assetCount,
              sceneCount: g.scenes.length,
            });
          });
        }

        let filtered = entries;
        if (historyTagFilter.length > 0) {
          filtered = filtered.filter((e) =>
            e.tags.some((t) => historyTagFilter.includes(t))
          );
        }

        switch (historySort) {
          case "recent":
            return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
          case "price-asc":
            return filtered.sort((a, b) => a.totalPrice - b.totalPrice);
          case "asset-count":
            return filtered.sort((a, b) => a.assetCount - b.assetCount);
          case "scene-count":
            return filtered.sort((a, b) => b.sceneCount - a.sceneCount);
          case "tag-match": {
            if (historyTagFilter.length === 0) return filtered;
            return filtered.sort((a, b) => {
              const matchA = a.tags.filter((t) => historyTagFilter.includes(t)).length;
              const matchB = b.tags.filter((t) => historyTagFilter.includes(t)).length;
              return matchB - matchA;
            });
          }
          default:
            return filtered;
        }
      },

      setHistoryFilter: (filter) => set({ historyFilter: filter }),
      setHistorySort: (sort) => set({ historySort: sort }),
      setHistoryTagFilter: (tags) => set({ historyTagFilter: tags }),

      duplicateScene: (groupId, sceneId) => {
        const { sceneGroups } = get();
        const group = sceneGroups.find((g) => g.id === groupId);
        if (!group) return;
        const scene = group.scenes.find((s) => s.id === sceneId);
        if (!scene) return;

        const newScene: ScenePlan = {
          ...scene,
          id: generateId(),
          elements: scene.elements.map((el) => ({ ...el, id: generateId() })),
        };
        set((state) => ({
          sceneGroups: state.sceneGroups.map((g) =>
            g.id === groupId
              ? { ...g, scenes: [...g.scenes, newScene], updatedAt: Date.now() }
              : g
          ),
        }));
      },

      batchApplyCombo: (comboId) => {
        const { combos } = get();
        const combo = combos.find((c) => c.id === comboId);
        if (!combo) return null;

        const groupId = generateId();
        const now = Date.now();
        const phoneModelId = useDesignStore.getState().phoneModel;
        const group: SceneGroup = {
          id: groupId,
          name: combo.name,
          phoneModel: phoneModelId,
          scenes: combo.scenes.map((s) => ({
            ...s,
            id: generateId(),
            elements: s.elements.map((el) => ({ ...el, id: generateId() })),
          })),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          sceneGroups: [...state.sceneGroups, group],
          currentGroupId: groupId,
        }));

        if (combo.scenes.length > 0) {
          applySceneToDesignStore(combo.scenes[0]);
        }

        return group;
      },

      addAssetToScene: (groupId, sceneId, assetId, x, y) => {
        const asset = assets.find((a) => a.id === assetId);
        if (!asset) return;

        const { sceneGroups } = get();
        const group = sceneGroups.find((g) => g.id === groupId);
        if (!group) return;
        const scene = group.scenes.find((s) => s.id === sceneId);
        if (!scene) return;

        const maxZ = scene.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
        const element: CanvasElement = {
          id: generateId(),
          type: asset.type as ElementType,
          assetId: asset.id,
          x,
          y,
          width: asset.defaultWidth,
          height: asset.defaultHeight,
          rotation: 0,
          opacity: 1,
          zIndex: maxZ + 1,
          scale: 1,
        };

        const updates: Partial<ScenePlan> = {
          elements: [...scene.elements, element],
        };
        if (asset.type === "lens-ring") {
          updates.lensRingAssetId = asset.id;
        }

        set((state) => ({
          sceneGroups: state.sceneGroups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  scenes: g.scenes.map((s) =>
                    s.id === sceneId ? { ...s, ...updates } : s
                  ),
                  updatedAt: Date.now(),
                }
              : g
          ),
        }));
      },

      removeElementFromScene: (groupId, sceneId, elementId) => {
        const { sceneGroups } = get();
        const group = sceneGroups.find((g) => g.id === groupId);
        if (!group) return;
        const scene = group.scenes.find((s) => s.id === sceneId);
        if (!scene) return;

        const element = scene.elements.find((e) => e.id === elementId);
        const updates: Partial<ScenePlan> = {
          elements: scene.elements.filter((e) => e.id !== elementId),
        };
        if (element?.type === "lens-ring" && element.assetId === scene.lensRingAssetId) {
          updates.lensRingAssetId = undefined;
        }

        set((state) => ({
          sceneGroups: state.sceneGroups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  scenes: g.scenes.map((s) =>
                    s.id === sceneId ? { ...s, ...updates } : s
                  ),
                  updatedAt: Date.now(),
                }
              : g
          ),
        }));
      },

      addTagToScene: (groupId, sceneId, tag) => {
        const { sceneGroups } = get();
        const group = sceneGroups.find((g) => g.id === groupId);
        if (!group) return;
        const scene = group.scenes.find((s) => s.id === sceneId);
        if (!scene || scene.tags.includes(tag)) return;

        set((state) => ({
          sceneGroups: state.sceneGroups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  scenes: g.scenes.map((s) =>
                    s.id === sceneId ? { ...s, tags: [...s.tags, tag] } : s
                  ),
                  updatedAt: Date.now(),
                }
              : g
          ),
        }));
      },

      removeTagFromScene: (groupId, sceneId, tag) => {
        const { sceneGroups } = get();
        const group = sceneGroups.find((g) => g.id === groupId);
        if (!group) return;
        const scene = group.scenes.find((s) => s.id === sceneId);
        if (!scene) return;

        set((state) => ({
          sceneGroups: state.sceneGroups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  scenes: g.scenes.map((s) =>
                    s.id === sceneId ? { ...s, tags: s.tags.filter((t) => t !== tag) } : s
                  ),
                  updatedAt: Date.now(),
                }
              : g
          ),
        }));
      },

      addTextLabelToScene: (groupId, sceneId, label) => {
        const { sceneGroups } = get();
        const group = sceneGroups.find((g) => g.id === groupId);
        if (!group) return;
        const scene = group.scenes.find((s) => s.id === sceneId);
        if (!scene) return;

        set((state) => ({
          sceneGroups: state.sceneGroups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  scenes: g.scenes.map((s) =>
                    s.id === sceneId ? { ...s, textLabels: [...s.textLabels, label] } : s
                  ),
                  updatedAt: Date.now(),
                }
              : g
          ),
        }));
      },

      restoreSceneFromHistory: (groupId, sceneId) => {
        const { sceneGroups } = get();
        const group = sceneGroups.find((g) => g.id === groupId);
        if (!group) return;
        const scene = group.scenes.find((s) => s.id === sceneId);
        if (!scene) return;
        applySceneToDesignStore(scene);
        set({ currentGroupId: groupId });
      },

      getSceneById: (groupId, sceneId) => {
        const { sceneGroups } = get();
        const group = sceneGroups.find((g) => g.id === groupId);
        if (!group) return undefined;
        return group.scenes.find((s) => s.id === sceneId);
      },

      getSceneShoppingList: (groupId, sceneId) => {
        const scene = get().getSceneById(groupId, sceneId);
        if (!scene) return { items: [], total: 0 };
        const items = generateShoppingList(scene.elements, scene.caseTemplate);
        return { items, total: calculateTotal(items) };
      },

      getGroupShoppingList: (groupId) => {
        const { sceneGroups } = get();
        const group = sceneGroups.find((g) => g.id === groupId);
        if (!group) return { items: [], total: 0 };
        const allItems = group.scenes.flatMap((s) =>
          generateShoppingList(s.elements, s.caseTemplate)
        );
        return { items: allItems, total: calculateTotal(allItems) };
      },
    }),
    {
      name: "multi-scene-storage",
      partialize: (state) => ({
        sceneGroups: state.sceneGroups,
      }),
    }
  )
);
