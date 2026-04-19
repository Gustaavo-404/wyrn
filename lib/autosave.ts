let timer: ReturnType<typeof setTimeout> | null = null

export function scheduleAutosave(
  projectId: string,
  sections: import("@/types/section").SectionInstance[],
  onSaved?: () => void,
  onError?: (err: Error) => void
) {
  if (timer) clearTimeout(timer)

  timer = setTimeout(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: { version: 1, sections },
        }),
      })

      if (!res.ok) throw new Error(`Autosave failed: ${res.status}`)
      onSaved?.()
    } catch (err) {
      onError?.(err as Error)
    }
  }, 1000)
}