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

export type Section = {
  id: string
  type: SectionType
  theme: Theme
  variant: SectionVariant
  content: any
  component?: ComponentType<any>
}