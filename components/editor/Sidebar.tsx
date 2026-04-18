"use client"

import { useEditorStore } from "@/store/useEditorStore"

export default function Sidebar() {
  const addSection = useEditorStore((s: any) => s.addSection)

  function addHero() {
    addSection({
      id: crypto.randomUUID(),
      type: "hero",
      variant: "default",
      content: {
        title: "Título incrível",
        subtitle: "Subtítulo aqui",
      },
    })
  }

  return (
    <div className="w-64 border-r border-white/10 p-4">
      <h2 className="mb-4 font-semibold">Blocos</h2>

      <button
        onClick={addHero}
        className="w-full p-2 bg-white text-black rounded"
      >
        + Hero
      </button>
    </div>
  )
}