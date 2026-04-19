"use client"

import { useEditorStore } from "@/store/useEditorStore"
import { HydratedSection } from "@/types/section"
import { hydrateSections } from "@/lib/hydrate"
import { useRef, useState, useCallback, useMemo } from "react"
import ExportModal from "./ExportModal"

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconTrash() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 3.5h9M5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M10.5 3.5l-.7 6.3a.5.5 0 0 1-.5.45H3.7a.5.5 0 0 1-.5-.45L2.5 3.5"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconDownload() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconFullscreen() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1.5 4.5V2a.5.5 0 0 1 .5-.5h2.5M8.5 1.5H11a.5.5 0 0 1 .5.5v2.5M11.5 8.5V11a.5.5 0 0 1-.5.5H8.5M4.5 11.5H2a.5.5 0 0 1-.5-.5V8.5"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function IconExitFullscreen() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M4.5 1.5V4a.5.5 0 0 1-.5.5H1.5M8.5 4.5H11a.5.5 0 0 0 .5-.5V1.5M11.5 8.5H9a.5.5 0 0 0-.5.5v2.5M4.5 8.5H2a.5.5 0 0 0-.5.5v2.5"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function IconDragHandle() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
      <circle cx="3" cy="3" r="1.1" fill="currentColor" />
      <circle cx="7" cy="3" r="1.1" fill="currentColor" />
      <circle cx="3" cy="7" r="1.1" fill="currentColor" />
      <circle cx="7" cy="7" r="1.1" fill="currentColor" />
      <circle cx="3" cy="11" r="1.1" fill="currentColor" />
      <circle cx="7" cy="11" r="1.1" fill="currentColor" />
    </svg>
  )
}

// ─── Save indicator ───────────────────────────────────────────────────────────

type SaveStatus = "idle" | "saving" | "saved" | "error"

function SaveIndicator({ status }: { status: SaveStatus }) {
  const map: Record<SaveStatus, { label: string; color: string } | null> = {
    idle: null,
    saving: { label: "Saving...", color: "rgba(255,255,255,0.3)" },
    saved: { label: "Saved", color: "rgba(100,220,100,0.6)" },
    error: { label: "Save failed", color: "rgba(255,80,80,0.7)" },
  }

  const item = map[status]
  if (!item) return null

  return (
    <span style={{ fontFamily: "monospace", fontSize: 10, color: item.color, transition: "color 0.3s" }}>
      {item.label}
    </span>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      userSelect: "none",
      minHeight: "60vh",
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        border: "1px dashed rgba(255,255,255,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 3v12M3 9h12" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p style={{
        fontSize: 13,
        color: "rgba(255,255,255,0.2)",
        margin: 0,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Add sections from the sidebar
      </p>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

interface SectionWrapperProps {
  section: HydratedSection
  index: number
  isSelected: boolean
  onRemove: (id: string) => void
  onSelect: () => void
  onDragStart: (index: number) => void
  onDragOver: (index: number) => void
  onDragEnd: () => void
  isDragging: boolean
  isOver: boolean
}

function SectionWrapper({
  section,
  index,
  isSelected,
  onRemove,
  onSelect,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  isOver,
}: SectionWrapperProps) {
  const [hovered, setHovered] = useState(false)
  const Component = section.component
  const showControls = hovered || isOver

  const outlineColor = isSelected
    ? "2px solid rgba(255,211,0,0.8)"
    : isOver
      ? "2px solid rgba(255,211,0,0.45)"
      : hovered
        ? "1px solid rgba(255,255,255,0.12)"
        : "1px solid transparent"

  return (
    <div
      draggable
      onClick={onSelect}
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(index) }}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        outline: outlineColor,
        outlineOffset: 0,
        opacity: isDragging ? 0.35 : 1,
        transition: "outline 0.12s, opacity 0.12s",
        cursor: "pointer",
      }}
    >
      {/* Floating toolbar */}
      <div style={{
        position: "absolute",
        top: 10,
        right: 12,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 4,
        opacity: showControls ? 1 : 0,
        transform: showControls ? "translateY(0)" : "translateY(-4px)",
        transition: "opacity 0.15s, transform 0.15s",
        pointerEvents: showControls ? "auto" : "none",
      }}>
        {/* Drag handle */}
        <div
          title="Drag to reorder"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.45)",
            cursor: "grab",
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "#fff"
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "rgba(255,255,255,0.45)"
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
          }}
        >
          <IconDragHandle />
        </div>

        {/* Type badge */}
        <div style={{
          display: "flex",
          alignItems: "center",
          height: 28,
          padding: "0 8px",
          borderRadius: 6,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.08)",
          fontFamily: "monospace",
          fontSize: 10,
          color: "rgba(255,255,255,0.3)",
          userSelect: "none",
        }}>
          {section.type}
        </div>

        {/* Delete */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(section.id) }}
          title="Remove section"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,80,80,0.65)",
            cursor: "pointer",
            transition: "color 0.15s, background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "#ff5050"
            e.currentTarget.style.background = "rgba(255,40,40,0.18)"
            e.currentTarget.style.borderColor = "rgba(255,50,50,0.35)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "rgba(255,80,80,0.65)"
            e.currentTarget.style.background = "rgba(0,0,0,0.65)"
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
          }}
        >
          <IconTrash />
        </button>
      </div>

      {/* Render */}
      {Component && <Component {...section.content} />}
    </div>
  )
}

// ─── Preview ──────────────────────────────────────────────────────────────────

export default function Preview() {
  const sections = useEditorStore((s) => s.sections)
  const removeSection = useEditorStore((s) => s.removeSection)
  const reorderSections = useEditorStore((s) => s.reorderSections)
  const selectSection = useEditorStore((s) => s.selectSection)
  const selectedSectionId = useEditorStore((s) => s.selectedSectionId)
  const fullscreen = useEditorStore((s) => s.fullscreen)
  const setFullscreen = useEditorStore((s) => s.setFullscreen)
  const saveStatus = useEditorStore((s) => s.saveStatus)
  const projectName = useEditorStore((s) => s.projectName)

  const hydrated = useMemo(() => hydrateSections(sections), [sections])

  const [exportOpen, setExportOpen] = useState(false)

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const dragFrom = useRef<number | null>(null)

  const handleDragStart = useCallback((index: number) => {
    dragFrom.current = index
    setDraggingIndex(index)
  }, [])

  const handleDragOver = useCallback((index: number) => {
    setOverIndex(index)
  }, [])

  const handleDragEnd = useCallback(() => {
    if (
      dragFrom.current !== null &&
      overIndex !== null &&
      dragFrom.current !== overIndex
    ) {
      reorderSections(dragFrom.current, overIndex)
    }
    dragFrom.current = null
    setDraggingIndex(null)
    setOverIndex(null)
  }, [overIndex, reorderSections])

  const containerStyle: React.CSSProperties = fullscreen
    ? { position: "fixed", inset: 0, zIndex: 100, overflowY: "auto", background: "#000", display: "flex", flexDirection: "column" }
    : { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", minWidth: 0 }

  return (
    <div style={containerStyle}>

      {/* Top bar */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "6px 12px",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginRight: "auto",
        }}>
          {sections.length > 0 && (
            <span style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: "rgba(255,255,255,0.2)",
            }}>
              {sections.length} section{sections.length !== 1 ? "s" : ""}
            </span>
          )}

          <SaveIndicator status={saveStatus} />
        </div>

        <button
          onClick={() => setExportOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,

            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,

            color: "rgba(255,255,255,0.35)",
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)",

            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
            padding: "6px 12px",

            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(255,211,0,0.3)"
            e.currentTarget.style.color = "#ffe033"
            e.currentTarget.style.background = "rgba(255,211,0,0.08)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
            e.currentTarget.style.color = "rgba(255,255,255,0.35)"
            e.currentTarget.style.background = "rgba(0,0,0,0.65)"
          }}
        >
          <IconDownload />
          <span>Export</span>
        </button>

        <button
          onClick={() => setFullscreen(!fullscreen)}
          title={fullscreen ? "Exit fullscreen" : "Fullscreen preview"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
            padding: "5px 10px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "#FFD300"
            e.currentTarget.style.borderColor = "rgba(255,211,0,0.3)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "rgba(255,255,255,0.35)"
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
          }}
        >
          {fullscreen ? <IconExitFullscreen /> : <IconFullscreen />}
          <span>{fullscreen ? "Exit" : "Fullscreen"}</span>
        </button>
      </div>

      {/* Sections */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.08) transparent",
      }}>
        {hydrated.length === 0 ? (
          <EmptyState />
        ) : (
          hydrated.map((section: HydratedSection, index: number) => (
            <SectionWrapper
              key={section.id}
              section={section}
              index={index}
              isSelected={selectedSectionId === section.id}
              onRemove={removeSection}
              onSelect={() => selectSection(section.id)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              isDragging={draggingIndex === index}
              isOver={overIndex === index && draggingIndex !== index}
            />
          ))
        )}
      </div>

      {exportOpen && (
        <ExportModal
          projectName={projectName}
          onClose={() => setExportOpen(false)}
        />
      )}

    </div>
  )
}