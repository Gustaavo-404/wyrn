import { Section, SectionVariant, Theme } from "@/types/section"

import Hero from "@/components/sections/hero/Hero"
import Pricing from "@/components/sections/pricing/Pricing"
import Steps from "@/components/sections/steps/Steps"

/**
 * SECTION REGISTRY
 */
const components: Partial<Record<Section["type"], any>> = {
  hero: Hero,
  pricing: Pricing,
  steps: Steps,
}

/**
 * VARIANT WRAPPERS
 */
const variantWrappers: Partial<
  Record<SectionVariant, (c: any) => any>
> = {
  default: (c) => c,
  centered: (c) => <div className="text-center">{c}</div>,
  dark: (c) => <div className="bg-black text-white">{c}</div>,
}

/**
 * THEME WRAPPERS
 */
const themeWrappers: Partial<
  Record<Theme, (c: any) => any>
> = {
  "minimal-dark": (c) => (
    <div className="bg-black text-white min-h-screen">
      {c}
    </div>
  ),
  "minimal-light": (c) => (
    <div className="bg-white text-black min-h-screen">
      {c}
    </div>
  ),
}

/**
 * MAIN RENDERER
 */
export function renderSections(sections: Section[]) {
  return sections.map((section) => {
    const Component = components[section.type]

    if (!Component) return null

    const VariantWrapper =
      variantWrappers[section.variant] ?? ((c: any) => c)

    const ThemeWrapper =
      section.theme
        ? themeWrappers[section.theme] ?? ((c: any) => c)
        : (c: any) => c

    const content = (
      <Component {...section.content} />
    )

    return (
      <div key={section.id}>
        {ThemeWrapper(VariantWrapper(content))}
      </div>
    )
  })
}