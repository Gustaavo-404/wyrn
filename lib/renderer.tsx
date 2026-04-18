import { Section } from "@/types/section"
import Hero from "@/components/sections/hero/Hero"

const components = {
  hero: {
    default: Hero,
  },
} as const

export function renderSections(sections: Section[]) {
  return sections.map((section) => {
    const Component =
      components[section.type]?.[section.variant]

    if (!Component) return null

    return (
      <Component key={section.id} {...section.content} />
    )
  })
}