import { create } from "zustand"
import { Section } from "@/types/section"

type EditorStore = {
  sections: Section[]
  setSections: (sections: Section[]) => void
  addSection: (section: Section) => void
  removeSection: (id: string) => void
  reorderSections: (from: number, to: number) => void

  fullscreen: boolean
  setFullscreen: (value: boolean) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  sections: [],

  fullscreen: false,

  setSections: (sections) => set({ sections }),

  addSection: (section) =>
    set((state) => ({
      sections: [...state.sections, section],
    })),

  removeSection: (id) =>
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== id),
    })),

  reorderSections: (from, to) =>
    set((state) => {
      const updated = [...state.sections]
      const [moved] = updated.splice(from, 1)
      updated.splice(to, 0, moved)
      return { sections: updated }
    }),

  setFullscreen: (value) => set({ fullscreen: value }),
}))