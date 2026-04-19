"use client"

import { useEffect, useRef } from "react"
import { useEditorStore } from "@/store/useEditorStore"
import { SectionInstance } from "@/types/section"
import Sidebar from "@/components/editor/Sidebar"
import Preview from "@/components/editor/Preview"
import PropertiesPanel from "@/components/editor/PropertiesPanel"

interface Props {
  project: {
    id: string
    name: string
    data: { version: number; sections: SectionInstance[] } | null
  }
}

export default function EditorClient({ project }: Props) {
  const initEditor = useEditorStore((s) => s.initEditor)
  const initializedFor = useRef<string | null>(null)

  useEffect(() => {
    if (initializedFor.current === project.id) return
    initializedFor.current = project.id

    initEditor({
      projectId: project.id,
      projectName: project.name,
      sections: Array.isArray(project.data?.sections)
        ? project.data.sections
        : [],
    })
  }, [project.id])

  return (
    <div style={{ display: "flex", height: "100vh", background: "#000", color: "#fff" }}>
      <Sidebar />
      <Preview />
      <PropertiesPanel />
    </div>
  )
}