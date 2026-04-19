import { SectionInstance, HydratedSection } from "@/types/section"
import { templateMap } from "@/lib/sections/library"

export function hydrateSections(instances: SectionInstance[]): HydratedSection[] {
  if (!Array.isArray(instances)) return []

  return instances.reduce<HydratedSection[]>((acc, instance) => {
    const template = templateMap.get(instance.templateId)

    if (!template) {
      console.warn(`[hydrate] Template não encontrado: "${instance.templateId}"`)
      return acc
    }

    acc.push({
      ...instance,
      component: template.component,
    })

    return acc
  }, [])
}