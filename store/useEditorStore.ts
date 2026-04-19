import { create } from "zustand"
import { SectionInstance } from "@/types/section"
import { scheduleAutosave } from "@/lib/autosave"
import { set as _set, cloneDeep } from "lodash"

type SaveStatus = "idle" | "saving" | "saved" | "error"

type EditorStore = {
  // ─── Projeto ────────────────────────────────────────────────
  projectId: string | null
  setProjectId: (id: string) => void

  projectName: string
  setProjectName: (name: string) => void

  // ─── Sections ───────────────────────────────────────────────
  sections: SectionInstance[]
  setSections: (sections: SectionInstance[]) => void
  addSection: (instance: SectionInstance) => void
  removeSection: (id: string) => void
  reorderSections: (from: number, to: number) => void

  // ─── Edição ─────────────────────────────────────────────────
  selectedSectionId: string | null
  selectSection: (id: string | null) => void
  updateSectionContent: (id: string, patch: Record<string, any>) => void
  updateSectionField: (id: string, path: string, value: any) => void

  // ─── UI ─────────────────────────────────────────────────────
  fullscreen: boolean
  setFullscreen: (value: boolean) => void

  // ─── Autosave ───────────────────────────────────────────────
  saveStatus: SaveStatus
  setSaveStatus: (status: SaveStatus) => void
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  // ─── Projeto ────────────────────────────────────────────────
  projectId: null,
  setProjectId: (id) => set({ projectId: id }),

  projectName: "",
  setProjectName: (name) => {
    set({ projectName: name })

    const { projectId, sections } = get()
    if (projectId) {
      set({ saveStatus: "saving" })
      scheduleAutosave(
        projectId,
        sections,
        () => set({ saveStatus: "saved" }),
        () => set({ saveStatus: "error" })
      )
    }
  },

  // ─── Sections ───────────────────────────────────────────────
  sections: [],

  setSections: (sections) => {
    if (!Array.isArray(sections)) {
      console.warn("[store] setSections recebeu valor inválido:", sections)
      set({ sections: [] })
      return
    }
    set({ sections })
  },

  addSection: (instance) => {
    set((state) => ({ sections: [...state.sections, instance] }))

    const { projectId, sections } = get()
    if (projectId) {
      set({ saveStatus: "saving" })
      scheduleAutosave(
        projectId,
        [...sections, instance],
        () => set({ saveStatus: "saved" }),
        () => set({ saveStatus: "error" })
      )
    }
  },

  removeSection: (id) => {
    const next = get().sections.filter((s) => s.id !== id)
    set({ sections: next })

    const { projectId } = get()
    if (projectId) {
      set({ saveStatus: "saving" })
      scheduleAutosave(
        projectId,
        next,
        () => set({ saveStatus: "saved" }),
        () => set({ saveStatus: "error" })
      )
    }
  },

  reorderSections: (from, to) => {
    const updated = [...get().sections]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)

    set({ sections: updated })

    const { projectId } = get()
    if (projectId) {
      set({ saveStatus: "saving" })
      scheduleAutosave(
        projectId,
        updated,
        () => set({ saveStatus: "saved" }),
        () => set({ saveStatus: "error" })
      )
    }
  },

  // ─── Edição ─────────────────────────────────────────────────
  selectedSectionId: null,
  selectSection: (id) => set({ selectedSectionId: id }),

  updateSectionContent: (id, patch) => {
    const next = get().sections.map((s) =>
      s.id === id
        ? { ...s, content: { ...s.content, ...patch } }
        : s
    )

    set({ sections: next })

    const { projectId } = get()
    if (projectId) {
      set({ saveStatus: "saving" })
      scheduleAutosave(
        projectId,
        next,
        () => set({ saveStatus: "saved" }),
        () => set({ saveStatus: "error" })
      )
    }
  },

  updateSectionField: (id, path, value) => {
    const next = get().sections.map((s) => {
      if (s.id !== id) return s
      const content = cloneDeep(s.content)
      _set(content, path, value)
      return { ...s, content }
    })

    set({ sections: next })

    const { projectId } = get()
    if (projectId) {
      set({ saveStatus: "saving" })
      scheduleAutosave(
        projectId,
        next,
        () => set({ saveStatus: "saved" }),
        () => set({ saveStatus: "error" })
      )
    }
  },

  // ─── UI ─────────────────────────────────────────────────────
  fullscreen: false,
  setFullscreen: (value) => set({ fullscreen: value }),

  // ─── Autosave ───────────────────────────────────────────────
  saveStatus: "idle",
  setSaveStatus: (status) => set({ saveStatus: status }),
}))