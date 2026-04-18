import { Section } from "@/types/section"

/**
 * CORE RENDER FUNCTION
 */
export function renderSection(section: Section) {
  const Component = section.component

  if (!Component) return null

  return (
    <div key={section.id}>
      <Component {...section.content} />
    </div>
  )
}

/**
 * FULL PAGE RENDER
 */
export function renderSections(sections: Section[]) {
  return sections.map(renderSection)
}