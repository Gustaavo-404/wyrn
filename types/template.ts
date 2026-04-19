import { SectionType, Theme, SectionVariant } from "./section"
import { ComponentType } from "react"

export type FieldType = "text" | "textarea" | "url" | "color" | "image" | "boolean"

export type EditableField = {
  key: string
  label: string
  type: FieldType
  placeholder?: string
}

export type SectionTemplate = {
  id: string
  name: string
  type: SectionType
  theme: Theme
  variant?: SectionVariant

  component: ComponentType<any>
  defaultContent: Record<string, any>
  fields: EditableField[]
}