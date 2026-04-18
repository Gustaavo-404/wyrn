"use client"

import { useRouter } from "next/navigation"

export default function NewProjectButton() {
  const router = useRouter()

  async function handleCreate() {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Novo Projeto",
        slug: crypto.randomUUID(),
        data: {},
      }),
    })

    if (!res.ok) return

    const project = await res.json()

    router.push(`/editor/${project.id}`)
  }

  return (
    <button
      onClick={handleCreate}
      className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:opacity-90"
    >
      + Novo Projeto
    </button>
  )
}