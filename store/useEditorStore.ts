import { create } from "zustand"
import { Section } from "@/types/section"

type EditorStore = {
  sections: Section[]
  setSections: (sections: Section[]) => void
  addSection: (section: Section) => void
  reorderSections: (from: number, to: number) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  sections: [],

  setSections: (sections) => set({ sections }),

  addSection: (section) =>
    set((state) => ({
      sections: [...state.sections, section],
    })),

  reorderSections: (from, to) =>
    set((state) => {
      const updated = [...state.sections]
      const [moved] = updated.splice(from, 1)
      updated.splice(to, 0, moved)

      return { sections: updated }
    }),
}))