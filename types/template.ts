import { Section } from "./section"
import { ComponentType } from "react"

export type SectionTemplate = {
  id: string
  name: string
  type: Section["type"]
  theme: Section["theme"]
  variant: Section["variant"]

  component: ComponentType<any>
  defaultContent: any
}