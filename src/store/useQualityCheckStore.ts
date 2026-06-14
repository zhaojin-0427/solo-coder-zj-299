import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  QualityCheckResult,
  PublishDraft,
  PublishSourceType,
  HistoryItemType,
  ProjectTag,
  SceneType,
  CaseTemplate,
  CanvasElement,
  InspirationSceneBreakdown,
} from "@/types";
import { generateId } from "@/utils/idGenerator";

interface QualityCheckState {
  isOpen: boolean;
  currentSourceType: PublishSourceType | null;
  currentSourceId: string | null;
  currentDraftId: string | null;
  qualityResult: QualityCheckResult | null;
  isChecking: boolean;
  drafts: PublishDraft[];
  selectedDraftId: string | null;

  setOpen: (open: boolean) => void;
  setCurrentSource: (
    sourceType: PublishSourceType,
    sourceId: string
  ) => void;
  setQualityResult: (result: QualityCheckResult | null) => void;
  setIsChecking: (checking: boolean) => void;
  setSelectedDraftId: (id: string | null) => void;

  createDraft: (params: {
    sourceType: PublishSourceType;
    sourceId: string;
    name: string;
    description: string;
    type: HistoryItemType;
    phoneModel: string;
    caseTemplate: CaseTemplate;
    styleTags: ProjectTag[];
    sceneTypeTags: SceneType[];
    thumbnail?: string;
    elements: CanvasElement[];
    sceneBreakdowns: InspirationSceneBreakdown[];
    qualityCheck?: QualityCheckResult;
  }) => string;

  updateDraft: (
    draftId: string,
    updates: Partial<PublishDraft>
  ) => void;

  deleteDraft: (draftId: string) => void;

  getDraftById: (draftId: string) => PublishDraft | undefined;

  getDraftsBySource: (
    sourceType: PublishSourceType,
    sourceId: string
  ) => PublishDraft[];

  startQualityCheck: (params: {
    sourceType: PublishSourceType;
    sourceId: string;
  }) => void;

  reset: () => void;
}

export const useQualityCheckStore = create<QualityCheckState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      currentSourceType: null,
      currentSourceId: null,
      currentDraftId: null,
      qualityResult: null,
      isChecking: false,
      drafts: [],
      selectedDraftId: null,

      setOpen: (open) => set({ isOpen: open }),

      setCurrentSource: (sourceType, sourceId) =>
        set({
          currentSourceType: sourceType,
          currentSourceId: sourceId,
        }),

      setQualityResult: (result) => set({ qualityResult: result }),

      setIsChecking: (checking) => set({ isChecking: checking }),

      setSelectedDraftId: (id) => set({ selectedDraftId: id }),

      createDraft: (params) => {
        const now = Date.now();
        const draft: PublishDraft = {
          id: generateId(),
          ...params,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          drafts: [draft, ...state.drafts],
          currentDraftId: draft.id,
        }));

        return draft.id;
      },

      updateDraft: (draftId, updates) => {
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === draftId
              ? { ...d, ...updates, updatedAt: Date.now() }
              : d
          ),
        }));
      },

      deleteDraft: (draftId) => {
        set((state) => ({
          drafts: state.drafts.filter((d) => d.id !== draftId),
          selectedDraftId:
            state.selectedDraftId === draftId
              ? null
              : state.selectedDraftId,
          currentDraftId:
            state.currentDraftId === draftId
              ? null
              : state.currentDraftId,
        }));
      },

      getDraftById: (draftId) => {
        return get().drafts.find((d) => d.id === draftId);
      },

      getDraftsBySource: (sourceType, sourceId) => {
        return get().drafts.filter(
          (d) => d.sourceType === sourceType && d.sourceId === sourceId
        );
      },

      startQualityCheck: (params) => {
        set({
          isOpen: true,
          currentSourceType: params.sourceType,
          currentSourceId: params.sourceId,
          isChecking: true,
          qualityResult: null,
        });
      },

      reset: () => {
        set({
          isOpen: false,
          currentSourceType: null,
          currentSourceId: null,
          currentDraftId: null,
          qualityResult: null,
          isChecking: false,
          selectedDraftId: null,
        });
      },
    }),
    {
      name: "quality-check-drafts-storage",
      partialize: (state) => ({
        drafts: state.drafts,
      }),
    }
  )
);
