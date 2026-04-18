import Hero from "@/components/sections/hero/Hero"
import Pricing from "@/components/sections/pricing/Pricing"
import Steps from "@/components/sections/steps/Steps"
import { SectionType } from "@/types/section"

const components: Partial<Record<SectionType, any>> = {
  hero: Hero,
  pricing: Pricing,
  steps: Steps,

  features: () => <div className="p-4">Features</div>,
  testimonials: () => <div className="p-4">Testimonials</div>,
  faq: () => <div className="p-4">FAQ</div>,
  cta: () => <div className="p-4">CTA</div>,
}

export function renderSectionPreview(type: SectionType) {
  const Component = components[type]

  if (!Component) return null

  return <Component {...getMockContent(type)} />
}

function getMockContent(type: SectionType) {
  switch (type) {
    case "hero":
      return {
        title: "Hero Preview",
        subtitle: "Subtitle",
      }

    case "pricing":
      return {
        title: "Pricing",
        subtitle: "Plans",
        plans: [
          { name: "Basic", price: "$9", features: ["x"] },
          { name: "Pro", price: "$29", features: ["x"] },
        ],
      }

    case "steps":
      return {
        title: "Steps",
        steps: [
          { title: "Step 1", description: "..." },
          { title: "Step 2", description: "..." },
        ],
      }

    default:
      return {}
  }
}