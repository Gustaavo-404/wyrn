import { create } from "zustand"

export const useEditorStore = create((set) => ({
  sections: [],
  setSections: (sections: any) => set({ sections }),

  addSection: (section: any) =>
    set((state: any) => ({
      sections: [...state.sections, section],
    })),
}))