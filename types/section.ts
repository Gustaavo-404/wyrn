import { ComponentType } from "react"

export type Theme =
  | "minimal-dark"
  | "saas-modern"
  | "creative-studio"

export type SectionType =
  | "hero"
  | "pricing"
  | "steps"
  | "features"
  | "testimonials"
  | "cta"
  | "faq"

export type SectionVariant =
  | "default"
  | "centered"
  | "split"
  | "dark"

// ─── O que fica no banco ───────────────────────────────────────────────────────
export type SectionInstance = {
  id: string
  templateId: string
  type: SectionType
  theme: Theme
  variant?: SectionVariant
  content: Record<string, any>
  style?: Record<string, any>
}

// ─── Forma hidratada: instance + componente ──
export type HydratedSection = SectionInstance & {
  component: ComponentType<any>
}