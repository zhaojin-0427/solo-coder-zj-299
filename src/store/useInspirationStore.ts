import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  InspirationCard,
  InspirationSortOption,
  InspirationSceneBreakdown,
  ProjectTag,
  SceneType,
  CaseTemplate,
  ReplicationMethod,
} from "@/types";
import { generateId } from "@/utils/idGenerator";
import { generateShoppingList, calculateTotal } from "@/utils/shoppingList";
import { useDesignStore } from "@/store/useDesignStore";
import { useMultiSceneStore } from "@/store/useMultiSceneStore";
import { getSampleInspirationCards } from "@/data/sampleInspirations";

interface InspirationState {
  isOpen: boolean;
  cards: InspirationCard[];
  filterStyleTags: ProjectTag[];
  filterSceneTypes: SceneType[];
  sortOption: InspirationSortOption;
  selectedCardId: string | null;

  setOpen: (open: boolean) => void;
  setFilterStyleTags: (tags: ProjectTag[]) => void;
  setFilterSceneTypes: (types: SceneType[]) => void;
  setSortOption: (option: InspirationSortOption) => void;
  setSelectedCardId: (id: string | null) => void;

  publishFromProject: (projectId: string, description?: string) => void;
  publishFromSceneGroup: (groupId: string, description?: string) => void;
  deleteCard: (cardId: string) => void;
  toggleFavorite: (cardId: string) => void;
  incrementViewCount: (cardId: string) => void;
  replicateToCanvas: (cardId: string) => void;
  replicateAsNewProject: (cardId: string) => void;
  replicateAsNewSceneGroup: (cardId: string) => void;

  getFilteredCards: () => InspirationCard[];
}

export const useInspirationStore = create<InspirationState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      cards: [],
      filterStyleTags: [],
      filterSceneTypes: [],
      sortOption: "recent",
      selectedCardId: null,

      setOpen: (open) => set({ isOpen: open }),
      setFilterStyleTags: (tags) => set({ filterStyleTags: tags }),
      setFilterSceneTypes: (types) => set({ filterSceneTypes: types }),
      setSortOption: (option) => set({ sortOption: option }),
      setSelectedCardId: (id) => set({ selectedCardId: id }),

      publishFromProject: (projectId, description) => {
        const { projects } = useDesignStore.getState();
        const project = projects.find((p) => p.id === projectId);
        if (!project) return;

        const items = generateShoppingList(project.elements, project.caseTemplate);
        const totalPrice = calculateTotal(items);
        const assetCount = project.elements.filter((e) => e.assetId).length;

        const breakdown: InspirationSceneBreakdown = {
          sceneType: "通勤",
          caseTemplate: project.caseTemplate,
          caseColor: project.caseColor,
          elements: project.elements.map((el) => ({ ...el, id: generateId() })),
          tags: project.tags,
          price: totalPrice,
        };

        const card: InspirationCard = {
          id: generateId(),
          type: "single",
          name: project.name,
          phoneModel: project.phoneModel,
          caseTemplate: project.caseTemplate,
          styleTags: project.tags,
          sceneTypeTags: ["通勤"],
          assetCount,
          estimatedTotalPrice: totalPrice,
          sceneCount: 1,
          publishedAt: Date.now(),
          thumbnail: project.thumbnail,
          isFavorited: false,
          favoriteCount: Math.floor(Math.random() * 50),
          viewCount: 0,
          replicateCount: 0,
          elements: project.elements.map((el) => ({ ...el, id: generateId() })),
          sceneBreakdowns: [breakdown],
          description: description || `${project.name}的搭配灵感`,
          sourceProjectId: project.id,
        };

        set((state) => ({ cards: [card, ...state.cards] }));
      },

      publishFromSceneGroup: (groupId, description) => {
        const { sceneGroups } = useMultiSceneStore.getState();
        const group = sceneGroups.find((g) => g.id === groupId);
        if (!group) return;

        let totalPrice = 0;
        let assetCount = 0;
        const sceneTypeTags: SceneType[] = [];
        const allTags: ProjectTag[] = [];
        const breakdowns: InspirationSceneBreakdown[] = [];

        group.scenes.forEach((scene) => {
          const items = generateShoppingList(scene.elements, scene.caseTemplate);
          const scenePrice = calculateTotal(items);
          totalPrice += scenePrice;
          assetCount += scene.elements.filter((e) => e.assetId).length;

          if (!sceneTypeTags.includes(scene.sceneType)) {
            sceneTypeTags.push(scene.sceneType);
          }

          scene.tags.forEach((t) => {
            if (!allTags.includes(t)) allTags.push(t);
          });

          breakdowns.push({
            sceneType: scene.sceneType,
            caseTemplate: scene.caseTemplate,
            caseColor: scene.caseColor,
            elements: scene.elements.map((el) => ({ ...el, id: generateId() })),
            tags: scene.tags,
            price: scenePrice,
          });
        });

        const caseTemplate: CaseTemplate = group.scenes.length > 0 ? group.scenes[0].caseTemplate : "transparent";

        const card: InspirationCard = {
          id: generateId(),
          type: "scene-group",
          name: group.name,
          phoneModel: group.phoneModel,
          caseTemplate,
          styleTags: allTags,
          sceneTypeTags,
          assetCount,
          estimatedTotalPrice: totalPrice,
          sceneCount: group.scenes.length,
          publishedAt: Date.now(),
          isFavorited: false,
          favoriteCount: Math.floor(Math.random() * 80),
          viewCount: 0,
          replicateCount: 0,
          elements: [],
          sceneBreakdowns: breakdowns,
          description: description || `${group.name}的多场景搭配灵感`,
          sourceGroupId: group.id,
        };

        set((state) => ({ cards: [card, ...state.cards] }));
      },

      deleteCard: (cardId) => {
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== cardId),
          selectedCardId: state.selectedCardId === cardId ? null : state.selectedCardId,
        }));
      },

      toggleFavorite: (cardId) => {
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === cardId
              ? {
                  ...c,
                  isFavorited: !c.isFavorited,
                  favoriteCount: c.isFavorited ? c.favoriteCount - 1 : c.favoriteCount + 1,
                }
              : c
          ),
        }));
      },

      incrementViewCount: (cardId) => {
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === cardId ? { ...c, viewCount: c.viewCount + 1 } : c
          ),
        }));
      },

      replicateToCanvas: (cardId) => {
        const { cards } = get();
        const card = cards.find((c) => c.id === cardId);
        if (!card) return;

        const store = useDesignStore.getState();
        store.pushHistory();

        if (card.type === "single" && card.elements.length > 0) {
          store.setCaseTemplate(card.caseTemplate);
          const firstBreakdown = card.sceneBreakdowns[0];
          if (firstBreakdown) {
            store.setCaseColor(firstBreakdown.caseColor);
          }
          useDesignStore.setState({
            elements: card.elements.map((el) => ({ ...el, id: generateId() })),
            selectedElementId: null,
          });
        } else if (card.type === "scene-group" && card.sceneBreakdowns.length > 0) {
          const firstScene = card.sceneBreakdowns[0];
          store.setCaseTemplate(firstScene.caseTemplate);
          store.setCaseColor(firstScene.caseColor);
          useDesignStore.setState({
            elements: firstScene.elements.map((el) => ({ ...el, id: generateId() })),
            selectedElementId: null,
          });
        }

        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === cardId ? { ...c, replicateCount: c.replicateCount + 1 } : c
          ),
          isOpen: false,
        }));
      },

      replicateAsNewProject: (cardId) => {
        const { cards } = get();
        const card = cards.find((c) => c.id === cardId);
        if (!card) return;

        const store = useDesignStore.getState();
        const newName = `${card.name} · 复刻`;

        const replicationSource = {
          inspirationCardId: card.id,
          inspirationCardName: card.name,
          replicatedAt: Date.now(),
          method: "as-new-project" as ReplicationMethod,
          hasBeenEdited: false,
        };

        if (card.type === "single" && card.elements.length > 0) {
          const newProject = {
            id: generateId(),
            name: newName,
            phoneModel: card.phoneModel,
            caseTemplate: card.caseTemplate,
            caseColor: card.sceneBreakdowns[0]?.caseColor || "#FFFFFF",
            elements: card.elements.map((el) => ({ ...el, id: generateId() })),
            tags: [...card.styleTags],
            thumbnail: card.thumbnail,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            replicationSource,
          };

          useDesignStore.setState((state) => ({
            projects: [...state.projects, newProject],
          }));
        } else if (card.type === "scene-group" && card.sceneBreakdowns.length > 0) {
          const allElements = card.sceneBreakdowns.flatMap((s) => s.elements);
          const firstBreakdown = card.sceneBreakdowns[0];
          
          const newProject = {
            id: generateId(),
            name: newName,
            phoneModel: card.phoneModel,
            caseTemplate: firstBreakdown?.caseTemplate || "transparent",
            caseColor: firstBreakdown?.caseColor || "#FFFFFF",
            elements: allElements.map((el) => ({ ...el, id: generateId() })),
            tags: [...card.styleTags],
            thumbnail: card.thumbnail,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            replicationSource,
          };

          useDesignStore.setState((state) => ({
            projects: [...state.projects, newProject],
          }));
        }

        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === cardId ? { ...c, replicateCount: c.replicateCount + 1 } : c
          ),
        }));
      },

      replicateAsNewSceneGroup: (cardId) => {
        const { cards } = get();
        const card = cards.find((c) => c.id === cardId);
        if (!card || card.sceneBreakdowns.length === 0) return;

        const newName = `${card.name} · 复刻`;

        const replicationSource = {
          inspirationCardId: card.id,
          inspirationCardName: card.name,
          replicatedAt: Date.now(),
          method: "as-new-scene-group" as ReplicationMethod,
          hasBeenEdited: false,
        };

        const now = Date.now();
        const newGroup = {
          id: generateId(),
          name: newName,
          phoneModel: card.phoneModel,
          scenes: card.sceneBreakdowns.map((breakdown) => ({
            id: generateId(),
            sceneType: breakdown.sceneType,
            caseTemplate: breakdown.caseTemplate,
            caseColor: breakdown.caseColor,
            elements: breakdown.elements.map((el) => ({ ...el, id: generateId() })),
            lensRingAssetId: breakdown.elements.find((e) => e.type === "lens-ring")?.assetId,
            textLabels: [] as string[],
            budgetLimit: 100,
            tags: [...breakdown.tags],
          })),
          createdAt: now,
          updatedAt: now,
          replicationSource,
        };

        useMultiSceneStore.setState((state) => ({
          sceneGroups: [...state.sceneGroups, newGroup],
        }));

        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === cardId ? { ...c, replicateCount: c.replicateCount + 1 } : c
          ),
        }));
      },

      getFilteredCards: () => {
        const { cards, filterStyleTags, filterSceneTypes, sortOption } = get();

        let filtered = cards;

        if (filterStyleTags.length > 0) {
          filtered = filtered.filter((c) =>
            c.styleTags.some((t) => filterStyleTags.includes(t))
          );
        }

        if (filterSceneTypes.length > 0) {
          filtered = filtered.filter((c) =>
            c.sceneTypeTags.some((t) => filterSceneTypes.includes(t))
          );
        }

        switch (sortOption) {
          case "popularity":
            return filtered.sort((a, b) => (b.favoriteCount + b.viewCount + b.replicateCount) - (a.favoriteCount + a.viewCount + a.replicateCount));
          case "recent":
            return filtered.sort((a, b) => b.publishedAt - a.publishedAt);
          case "price-asc":
            return filtered.sort((a, b) => a.estimatedTotalPrice - b.estimatedTotalPrice);
          case "price-desc":
            return filtered.sort((a, b) => b.estimatedTotalPrice - a.estimatedTotalPrice);
          case "asset-count":
            return filtered.sort((a, b) => b.assetCount - a.assetCount);
          default:
            return filtered;
        }
      },
    }),
    {
      name: "inspiration-plaza-storage",
      partialize: (state) => ({
        cards: state.cards,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.cards.length === 0) {
          state.cards = getSampleInspirationCards();
        }
      },
    }
  )
);
