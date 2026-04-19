"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewProjectButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "New Project",
          slug: "project-" + Date.now(),
          data: {},
        }),
      })
      if (!res.ok) return
      const project = await res.json()
      router.push(`/editor/${project.id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-medium text-black disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-85 active:scale-[0.97] transition-all shrink-0"
      style={{ background: "#FFD300" }}
    >
      {loading ? (
        <span
          className="w-3 h-3 rounded-full border-[1.5px] border-black/20 border-t-black animate-spin"
        />
      ) : (
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className="transition-transform group-hover:rotate-90"
        >
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
      {loading ? "Creating…" : "New project"}
    </button>
  )
}