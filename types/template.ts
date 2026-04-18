import { Section } from "./section"

export type TemplateCategory =
  | "saas"
  | "portfolio"
  | "agency"
  | "ecommerce"
  | "landing"
  | "product-launch"

export type Template = {
  id: string
  name: string
  category: TemplateCategory

  description?: string
  thumbnail?: string

  sections: Section[]
}