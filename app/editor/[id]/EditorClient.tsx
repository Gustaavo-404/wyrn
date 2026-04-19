"use client"

import { useEffect } from "react"
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
  const setSections = useEditorStore((s) => s.setSections)
  const setProjectId = useEditorStore((s) => s.setProjectId)
  const setProjectName = useEditorStore((s) => s.setProjectName)

  useEffect(() => {
    setProjectId(project.id)
    setProjectName(project.name)

    const raw = project.data?.sections
    setSections(Array.isArray(raw) ? raw : [])
  }, [project.id])

  return (
    <div style={{ display: "flex", height: "100vh", background: "#000", color: "#fff" }}>
      <Sidebar />
      <Preview />
      <PropertiesPanel />
    </div>
  )
}