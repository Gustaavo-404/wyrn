"use client"

import { useEditorStore } from "@/store/useEditorStore"
import { renderSections } from "@/lib/renderer"

export default function Preview() {
  const sections = useEditorStore((s: any) => s.sections)

  return (
    <div className="flex-1 overflow-auto p-10">
      {renderSections(sections)}
    </div>
  )
}