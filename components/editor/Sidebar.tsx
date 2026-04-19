"use client"

import { useMemo, useState, useRef } from "react"
import { useEditorStore } from "@/store/useEditorStore"
import { sectionLibrary } from "@/lib/sections/library"
import { SectionTemplate } from "@/types/template"
import { SectionInstance } from "@/types/section"
import { buildSectionIndex } from "@/lib/buildSectionIndex"

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function IconPlus({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 10 10" fill="none"
      style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M2 3.5L5 6.5L8 3.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconPanelCollapse({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      style={{ transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)", transform: collapsed ? "scaleX(-1)" : "scaleX(1)" }}
    >
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.15" />
      <line x1="5.5" y1="2.5" x2="5.5" y2="13.5" stroke="currentColor" strokeWidth="1.15" />
      <path d="M9.5 5.5L7.5 8L9.5 10.5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function useToast() {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showToast(name: string) {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message: `${name} added`, visible: true })
    timerRef.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      1800
    )
  }

  return { toast, showToast }
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  template,
  onAdd,
}: {
  template: SectionTemplate
  onAdd: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onAdd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        cursor: "pointer",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 8,
        background: hovered ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.02)",
        padding: "10px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        transition: "all 0.18s",
        transform: hovered ? "translateX(1px)" : "translateX(0)",
        overflow: "hidden",
      }}
    >
      {/* Accent bar */}
      <div style={{
        position: "absolute",
        left: 0, top: 0, bottom: 0,
        width: 2,
        borderRadius: "2px 0 0 2px",
        background: hovered ? "#FFD300" : "transparent",
        transition: "background 0.2s",
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12.5,
          fontWeight: 400,
          color: hovered ? "#ffffff" : "rgba(255,255,255,0.72)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginBottom: 2,
          transition: "color 0.15s",
        }}>
          {template.name}
        </div>
        <div style={{
          fontFamily: "monospace",
          fontSize: 9.5,
          color: "rgba(255,255,255,0.2)",
        }}>
          {template.theme} · {template.type}
          {template.variant ? ` · ${template.variant}` : ""}
        </div>
      </div>

      <div style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        background: hovered ? "rgba(255,211,0,0.1)" : "transparent",
        border: `1px solid ${hovered ? "rgba(255,211,0,0.3)" : "transparent"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hovered ? "#FFD300" : "rgba(255,255,255,0.2)",
        transition: "all 0.15s",
        flexShrink: 0,
      }}>
        <IconPlus />
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const addSection = useEditorStore((s) => s.addSection)
  const fullscreen = useEditorStore((s) => s.fullscreen)

  const [search, setSearch] = useState("")
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const [collapsed, setCollapsed] = useState(false)
  const { toast, showToast } = useToast()

  const indexed = useMemo(() => buildSectionIndex(sectionLibrary), [])

  const totalCount = useMemo(() => {
    let count = 0
    Object.values(indexed).forEach((types) =>
      Object.values(types).forEach((sections) => (count += sections.length))
    )
    return count
  }, [indexed])

  const filtered = useMemo(() => {
    if (!search.trim()) return indexed
    const q = search.toLowerCase()
    const result: typeof indexed = {}
    Object.entries(indexed).forEach(([theme, types]) => {
      const matchedTypes: Record<string, SectionTemplate[]> = {}
      Object.entries(types).forEach(([type, sections]) => {
        const matched = sections.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.type.toLowerCase().includes(q) ||
            s.theme.toLowerCase().includes(q)
        )
        if (matched.length) matchedTypes[type] = matched
      })
      if (Object.keys(matchedTypes).length) result[theme] = matchedTypes
    })
    return result
  }, [indexed, search])

  function toggleGroup(key: string) {
    setOpenGroups((prev) => ({ ...prev, [key]: !(prev[key] ?? true) }))
  }

  function isGroupOpen(key: string) {
    return openGroups[key] ?? true
  }

  // ─── Cria SectionInstance ──────
  function handleAdd(template: SectionTemplate) {
    const instance: SectionInstance = {
      id: crypto.randomUUID(),
      templateId: template.id,
      type: template.type,
      theme: template.theme,
      variant: template.variant,
      content: { ...template.defaultContent },
    }
    addSection(instance)
    showToast(template.name)
  }

  return (
    <div
      style={{
        width: collapsed ? 44 : 320,
        minWidth: collapsed ? 44 : 320,
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)",
        background: "#000",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        flexShrink: 0,
        opacity: fullscreen ? 0 : 1,
        transform: fullscreen ? "translateX(-12px)" : "translateX(0)",
        pointerEvents: fullscreen ? "none" : "auto",
        transitionProperty: "width, min-width, opacity, transform",
        transitionDuration: "0.3s, 0.3s, 0.2s, 0.2s",
      }}
    >
      {/* ── Strip colapsada ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 16,
        gap: 20,
        opacity: collapsed ? 1 : 0,
        pointerEvents: collapsed ? "auto" : "none",
        transition: "opacity 0.2s",
      }}>
        <button
          onClick={() => setCollapsed(false)}
          title="Expand sidebar"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.3)",
            padding: 6,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#FFD300" }}
          onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)" }}
        >
          <IconPanelCollapse collapsed={true} />
        </button>

        <span style={{
          fontFamily: "monospace",
          fontSize: 9,
          color: "#FFD300",
          writingMode: "vertical-rl",
          letterSpacing: "0.08em",
          opacity: 0.5,
        }}>
          {totalCount} sections
        </span>
      </div>

      {/* ── Conteúdo expandido ── */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
        opacity: collapsed ? 0 : 1,
        pointerEvents: collapsed ? "none" : "auto",
        transition: "opacity 0.15s",
      }}>

        {/* Header */}
        <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}>
              Section Marketplace
            </span>
            <span style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: "#FFD300",
              background: "rgba(255,211,0,0.08)",
              border: "1px solid rgba(255,211,0,0.18)",
              padding: "2px 8px",
              borderRadius: 20,
            }}>
              {totalCount}
            </span>
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <div style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.22)",
              pointerEvents: "none",
            }}>
              <IconSearch />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a section..."
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                color: "rgba(255,255,255,0.7)",
                fontFamily: "inherit",
                fontSize: 13,
                padding: "8px 12px 8px 34px",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FFD300"
                e.target.style.boxShadow = "0 0 0 3px rgba(255,211,0,0.08)"
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.08)"
                e.target.style.boxShadow = "none"
              }}
            />
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 -20px" }} />
        </div>

        {/* Scroll area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px 24px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.08) transparent",
          }}
        >
          {Object.entries(filtered).length === 0 && (
            <div style={{
              textAlign: "center",
              paddingTop: 40,
              color: "rgba(255,255,255,0.2)",
              fontSize: 13,
            }}>
              No sections found
            </div>
          )}

          {Object.entries(filtered).map(([theme, types]) => (
            <div key={theme} style={{ marginBottom: 28 }}>
              {/* Theme label */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 9.5,
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.18)",
                marginBottom: 12,
              }}>
                {theme}
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              </div>

              {Object.entries(types).map(([type, sections]) => {
                const groupKey = `${theme}:${type}`
                const open = isGroupOpen(groupKey)

                return (
                  <div key={type} style={{ marginBottom: 8 }}>
                    {/* Group toggle */}
                    <button
                      onClick={() => toggleGroup(groupKey)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "6px 0",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: open ? "#FFD300" : "rgba(255,255,255,0.15)",
                          transition: "background 0.2s",
                        }} />
                        <span style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: open ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.35)",
                          transition: "color 0.2s",
                        }}>
                          {type}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.2)" }}>
                          {sections.length}
                        </span>
                        <IconChevron open={open} />
                      </div>
                    </button>

                    {/* Cards */}
                    <div style={{
                      overflow: "hidden",
                      maxHeight: open ? sections.length * 72 : 0,
                      opacity: open ? 1 : 0,
                      transition: "max-height 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      marginTop: open ? 4 : 0,
                    }}>
                      {sections.map((template) => (
                        <SectionCard
                          key={template.id}
                          template={template}
                          onAdd={() => handleAdd(template)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 20px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          background: "#000",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "rgba(255,255,255,0.18)",
          }}>
            <kbd style={{
              fontFamily: "monospace",
              fontSize: 9,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 3,
              padding: "1px 5px",
              color: "rgba(255,255,255,0.25)",
            }}>
              ⌘K
            </kbd>
            quick add
          </div>

          <button
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontFamily: "inherit",
              color: "rgba(255,255,255,0.3)",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 6,
              padding: "5px 10px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "#FFD300"
              e.currentTarget.style.borderColor = "rgba(255,211,0,0.25)"
              e.currentTarget.style.background = "rgba(255,211,0,0.04)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "rgba(255,255,255,0.3)"
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"
              e.currentTarget.style.background = "transparent"
            }}
          >
            <IconPanelCollapse collapsed={false} />
            <span>Collapse</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      <div style={{
        position: "absolute",
        bottom: 58,
        left: "50%",
        transform: `translateX(-50%) translateY(${toast.visible ? 0 : 6}px)`,
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 8,
        padding: "8px 14px",
        fontSize: 12,
        color: "rgba(255,255,255,0.75)",
        whiteSpace: "nowrap",
        opacity: toast.visible ? 1 : 0,
        transition: "opacity 0.2s, transform 0.2s",
        pointerEvents: "none",
        zIndex: 10,
      }}>
        {toast.message}
      </div>
    </div>
  )
}