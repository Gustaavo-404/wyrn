import { HydratedSection } from "@/types/section"

/**
 * CORE RENDER FUNCTION
 */
export function renderSection(section: HydratedSection) {
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
export function renderSections(sections: HydratedSection[]) {
  return sections.map(renderSection)
}