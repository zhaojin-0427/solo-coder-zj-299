import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CanvasElement,
  CaseTemplate,
  Project,
  ProjectTag,
  HistoryState,
  RecommendationScheme,
  SortOption,
} from "@/types";
import { phoneModels } from "@/data/phoneModels";
import { generateId } from "@/utils/idGenerator";
import { generateRecommendations } from "@/utils/recommendationEngine";
import { calculateSchemePrice } from "@/utils/recommendationEngine";

interface DesignState {
  phoneModel: string;
  caseTemplate: CaseTemplate;
  caseColor: string;
  elements: CanvasElement[];
  selectedElementId: string | null;
  projects: Project[];
  currentProjectId: string | null;
  projectName: string;
  projectTags: ProjectTag[];
  history: HistoryState;
  smartWorkbenchOpen: boolean;
  recommendations: RecommendationScheme[];
  previewSchemeId: string | null;
  isGeneratingRecommendations: boolean;
  historySortOption: SortOption;
  setPhoneModel: (model: string) => void;
  setCaseTemplate: (template: CaseTemplate) => void;
  setCaseColor: (color: string) => void;
  addElement: (element: Omit<CanvasElement, "id" | "zIndex">) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  moveElementUp: (id: string) => void;
  moveElementDown: (id: string) => void;
  clearElements: () => void;
  undo: () => void;
  redo: () => void;
  saveProject: (name: string, tags: ProjectTag[], thumbnail?: string) => void;
  loadProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  updateProjectTags: (projectId: string, tags: ProjectTag[]) => void;
  renameProject: (projectId: string, name: string) => void;
  setProjectName: (name: string) => void;
  setProjectTags: (tags: ProjectTag[]) => void;
  pushHistory: () => void;
  setSmartWorkbenchOpen: (open: boolean) => void;
  generateRecommendations: () => void;
  setPreviewScheme: (schemeId: string | null) => void;
  applyRecommendation: (schemeId: string) => void;
  saveRecommendationAsProject: (schemeId: string, name: string) => void;
  setHistorySortOption: (option: SortOption) => void;
  getSortedProjects: () => Project[];
  getDisplayElements: () => CanvasElement[];
  createProjectFromElements: (name: string, tags: ProjectTag[], elements: CanvasElement[], thumbnail?: string) => void;
}

const defaultPhoneModel = phoneModels[0].id;

export const useDesignStore = create<DesignState>()(
  persist(
    (set, get) => ({
      phoneModel: defaultPhoneModel,
      caseTemplate: "transparent",
      caseColor: "#FFFFFF",
      elements: [],
      selectedElementId: null,
      projects: [],
      currentProjectId: null,
      projectName: "未命名方案",
      projectTags: [],
      history: { past: [], future: [] },

      setPhoneModel: (model) => set({ phoneModel: model }),

      setCaseTemplate: (template) => set({ caseTemplate: template }),

      setCaseColor: (color) => set({ caseColor: color }),

      addElement: (element) => {
        const { elements, pushHistory } = get();
        const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
        const newElement: CanvasElement = {
          ...element,
          id: generateId(),
          zIndex: maxZ + 1,
        };
        pushHistory();
        set({
          elements: [...elements, newElement],
          selectedElementId: newElement.id,
        });
      },

      updateElement: (id, updates) => {
        const { elements } = get();
        set({
          elements: elements.map((el) =>
            el.id === id ? { ...el, ...updates } : el
          ),
        });
      },

      deleteElement: (id) => {
        const { elements, selectedElementId, pushHistory } = get();
        pushHistory();
        set({
          elements: elements.filter((el) => el.id !== id),
          selectedElementId: selectedElementId === id ? null : selectedElementId,
        });
      },

      selectElement: (id) => set({ selectedElementId: id }),

      moveElementUp: (id) => {
        const { elements } = get();
        const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
        const index = sorted.findIndex((el) => el.id === id);
        if (index < sorted.length - 1) {
          const temp = sorted[index].zIndex;
          sorted[index].zIndex = sorted[index + 1].zIndex;
          sorted[index + 1].zIndex = temp;
          set({ elements: [...sorted] });
        }
      },

      moveElementDown: (id) => {
        const { elements } = get();
        const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
        const index = sorted.findIndex((el) => el.id === id);
        if (index > 0) {
          const temp = sorted[index].zIndex;
          sorted[index].zIndex = sorted[index - 1].zIndex;
          sorted[index - 1].zIndex = temp;
          set({ elements: [...sorted] });
        }
      },

      clearElements: () => {
        const { pushHistory } = get();
        pushHistory();
        set({ elements: [], selectedElementId: null });
      },

      undo: () => {
        const { history } = get();
        if (history.past.length === 0) return;
        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, -1);
        const currentElements = get().elements;
        set({
          elements: previous,
          history: {
            past: newPast,
            future: [currentElements, ...history.future],
          },
          selectedElementId: null,
        });
      },

      redo: () => {
        const { history } = get();
        if (history.future.length === 0) return;
        const next = history.future[0];
        const newFuture = history.future.slice(1);
        const currentElements = get().elements;
        set({
          elements: next,
          history: {
            past: [...history.past, currentElements],
            future: newFuture,
          },
          selectedElementId: null,
        });
      },

      pushHistory: () => {
        const { elements, history } = get();
        set({
          history: {
            past: [...history.past, elements],
            future: [],
          },
        });
      },

      saveProject: (name, tags, thumbnail) => {
        const {
          phoneModel,
          caseTemplate,
          caseColor,
          elements,
          projects,
          currentProjectId,
        } = get();
        const now = Date.now();

        if (currentProjectId) {
          set({
            projects: projects.map((p) =>
              p.id === currentProjectId
                ? {
                    ...p,
                    name,
                    tags,
                    phoneModel,
                    caseTemplate,
                    caseColor,
                    elements,
                    thumbnail,
                    updatedAt: now,
                  }
                : p
            ),
            projectName: name,
            projectTags: tags,
          });
        } else {
          const newProject: Project = {
            id: generateId(),
            name,
            phoneModel,
            caseTemplate,
            caseColor,
            elements,
            tags,
            thumbnail,
            createdAt: now,
            updatedAt: now,
          };
          set({
            projects: [...projects, newProject],
            currentProjectId: newProject.id,
            projectName: name,
            projectTags: tags,
          });
        }
      },

      loadProject: (projectId) => {
        const { projects } = get();
        const project = projects.find((p) => p.id === projectId);
        if (project) {
          set({
            phoneModel: project.phoneModel,
            caseTemplate: project.caseTemplate,
            caseColor: project.caseColor,
            elements: project.elements,
            currentProjectId: project.id,
            projectName: project.name,
            projectTags: project.tags,
            selectedElementId: null,
            history: { past: [], future: [] },
          });
        }
      },

      deleteProject: (projectId) => {
        const { projects, currentProjectId } = get();
        set({
          projects: projects.filter((p) => p.id !== projectId),
          currentProjectId:
            currentProjectId === projectId ? null : currentProjectId,
        });
      },

      updateProjectTags: (projectId, tags) => {
        const { projects } = get();
        set({
          projects: projects.map((p) =>
            p.id === projectId ? { ...p, tags, updatedAt: Date.now() } : p
          ),
        });
      },

      renameProject: (projectId, name) => {
        const { projects } = get();
        set({
          projects: projects.map((p) =>
            p.id === projectId ? { ...p, name, updatedAt: Date.now() } : p
          ),
        });
      },

      setProjectName: (name) => set({ projectName: name }),

      setProjectTags: (tags) => set({ projectTags: tags }),

      smartWorkbenchOpen: false,
      recommendations: [],
      previewSchemeId: null,
      isGeneratingRecommendations: false,
      historySortOption: "recent",

      setSmartWorkbenchOpen: (open) => set({ smartWorkbenchOpen: open }),

      generateRecommendations: () => {
        const { phoneModel: phoneModelId, caseTemplate, caseColor, elements, projectTags } = get();
        const phoneModel = phoneModels.find((m) => m.id === phoneModelId) || phoneModels[0];
        
        set({ isGeneratingRecommendations: true });
        
        setTimeout(() => {
          const recs = generateRecommendations({
            phoneModel,
            caseTemplate,
            caseColor,
            existingElements: elements,
            projectTags,
          });
          set({ 
            recommendations: recs, 
            isGeneratingRecommendations: false,
            previewSchemeId: null,
          });
        }, 300);
      },

      setPreviewScheme: (schemeId) => set({ previewSchemeId: schemeId }),

      applyRecommendation: (schemeId) => {
        const { recommendations, pushHistory } = get();
        const scheme = recommendations.find((r) => r.id === schemeId);
        if (scheme) {
          pushHistory();
          set({ 
            elements: scheme.elements,
            selectedElementId: null,
            previewSchemeId: null,
          });
        }
      },

      setHistorySortOption: (option) => set({ historySortOption: option }),

      getSortedProjects: () => {
        const { projects, historySortOption } = get();
        const sorted = [...projects];
        
        switch (historySortOption) {
          case "recent":
            return sorted.sort((a, b) => b.updatedAt - a.updatedAt);
          case "price-asc":
            return sorted.sort((a, b) => {
              const priceA = calculateSchemePrice(a.elements, a.caseTemplate);
              const priceB = calculateSchemePrice(b.elements, b.caseTemplate);
              return priceA - priceB;
            });
          case "asset-count":
            return sorted.sort((a, b) => {
              const countA = a.elements.filter((e) => e.assetId).length;
              const countB = b.elements.filter((e) => e.assetId).length;
              return countA - countB;
            });
          default:
            return sorted;
        }
      },

      getDisplayElements: () => {
        const { elements, previewSchemeId, recommendations } = get();
        if (previewSchemeId) {
          const scheme = recommendations.find((r) => r.id === previewSchemeId);
          if (scheme) {
            return scheme.elements;
          }
        }
        return elements;
      },

      createProjectFromElements: (name, tags, elements, thumbnail) => {
        const {
          phoneModel,
          caseTemplate,
          caseColor,
          projects,
        } = get();
        const now = Date.now();

        const newProject: Project = {
          id: generateId(),
          name,
          phoneModel,
          caseTemplate,
          caseColor,
          elements,
          tags,
          thumbnail,
          createdAt: now,
          updatedAt: now,
        };
        set({
          projects: [...projects, newProject],
        });
      },

      saveRecommendationAsProject: (schemeId, name) => {
        const { recommendations, createProjectFromElements } = get();
        const scheme = recommendations.find((r) => r.id === schemeId);
        if (scheme) {
          const tags = scheme.styleTags.length > 0 ? scheme.styleTags : [];
          createProjectFromElements(name, tags, scheme.elements);
        }
      },
    }),
    {
      name: "phone-case-design-storage",
      partialize: (state) => ({
        projects: state.projects,
      }),
    }
  )
);
