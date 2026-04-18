"use client"

import { useEditorStore } from "@/store/useEditorStore"
import { SectionType } from "@/types/section"

const defaultSections: Partial<Record<SectionType, any>> = {
  hero: {
    title: "Título incrível",
    subtitle: "Subtítulo aqui",
  },

  pricing: {
    title: "Planos",
    subtitle: "Escolha o melhor",
    plans: [],
  },

  steps: {
    title: "Como funciona",
    steps: [],
  },
}

export default function Sidebar() {
  const addSection = useEditorStore((s: any) => s.addSection)

  function handleAdd(type: SectionType) {
    addSection({
      id: crypto.randomUUID(),
      type,
      variant: "default",
      theme: "minimal-dark",
      content: defaultSections[type] ?? {},
    })
  }

  return (
    <div className="w-64 border-r border-white/10 p-4">
      <h2 className="mb-4 font-semibold">Blocos</h2>

      <div className="space-y-2">
        <button
          onClick={() => handleAdd("hero")}
          className="w-full p-2 bg-white text-black rounded"
        >
          + Hero
        </button>

        <button
          onClick={() => handleAdd("pricing")}
          className="w-full p-2 bg-white text-black rounded"
        >
          + Pricing
        </button>

        <button
          onClick={() => handleAdd("steps")}
          className="w-full p-2 bg-white text-black rounded"
        >
          + Steps
        </button>
      </div>
    </div>
  )
}