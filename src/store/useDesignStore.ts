import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CanvasElement,
  CaseTemplate,
  Project,
  ProjectTag,
  HistoryState,
} from "@/types";
import { phoneModels } from "@/data/phoneModels";
import { generateId } from "@/utils/idGenerator";

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
    }),
    {
      name: "phone-case-design-storage",
      partialize: (state) => ({
        projects: state.projects,
      }),
    }
  )
);
