export type SectionType = "hero"

export type SectionVariant = "default"

export type Section = {
  id: string
  type: SectionType
  variant: SectionVariant
  content: any
}