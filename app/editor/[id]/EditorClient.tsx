"use client"

import { useEffect } from "react"
import { useEditorStore } from "@/store/useEditorStore"
import Sidebar from "@/components/editor/Sidebar"
import Preview from "@/components/editor/Preview"

export default function EditorClient({ project }: any) {
  const setSections = useEditorStore((s: any) => s.setSections)

  useEffect(() => {
    setSections(project.data?.sections || [])
  }, [project])

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <Preview />
    </div>
  )
}