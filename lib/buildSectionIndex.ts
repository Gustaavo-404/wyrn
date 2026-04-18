import { SectionTemplate } from "@/types/template"

export type SectionIndex = Record<
  string,
  Record<string, SectionTemplate[]>
>

export function buildSectionIndex(
  sectionLibrary: Record<string, SectionTemplate[]>
): SectionIndex {
  const index: SectionIndex = {}

  for (const [theme, sections] of Object.entries(sectionLibrary)) {
    index[theme] = {}

    for (const section of sections) {
      const type = section.type

      if (!index[theme][type]) {
        index[theme][type] = []
      }

      index[theme][type].push(section)
    }
  }

  return index
}