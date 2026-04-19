"use client"

import { useEditorStore } from "@/store/useEditorStore"
import { templateMap } from "@/lib/sections/library"
import { EditableField } from "@/types/template"
import { get as _get } from "lodash"

export default function PropertiesPanel() {
  const selectedId = useEditorStore((s) => s.selectedSectionId)
  const sections = useEditorStore((s) => s.sections)
  const updateSectionField = useEditorStore((s) => s.updateSectionField)
  const selectSection = useEditorStore((s) => s.selectSection)

  const section = sections.find((s) => s.id === selectedId)
  const template = section ? templateMap.get(section.templateId) : null

  if (!section || !template) {
    return (
      <div style={{
        width: 260, flexShrink: 0,
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.15)", fontFamily: "'DM Sans', sans-serif" }}>
          Select a section to edit
        </span>
      </div>
    )
  }

  return (
    <div style={{
      width: 260, flexShrink: 0,
      borderLeft: "1px solid rgba(255,255,255,0.06)",
      background: "#000",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'DM Sans', sans-serif",
      overflowY: "auto",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
            {template.name}
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 9.5, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>
            {template.theme} · {template.type}
          </div>
        </div>
        <button
          onClick={() => selectSection(null)}
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.25)", fontSize: 16, lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Fields */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", fontWeight: 500 }}>
          Content
        </div>

        {template.fields.map((field: EditableField) => {
          const value = _get(section.content, field.key) ?? ""

          return (
            <FieldEditor
              key={field.key}
              field={field}
              value={value}
              onChange={(val) => updateSectionField(section.id, field.key, val)}
            />
          )
        })}
      </div>
    </div>
  )
}

// ─── Field editor ─────────────────────────────────────────────────────────────

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: EditableField
  value: any
  onChange: (val: any) => void
}) {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 7,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "inherit",
    fontSize: 12.5,
    padding: "8px 10px",
    outline: "none",
    resize: "none",
    boxSizing: "border-box",
  }

  return (
    <div>
      <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
        {field.label}
      </label>

      {field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={field.placeholder}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = "#FFD300"
            e.target.style.boxShadow = "0 0 0 3px rgba(255,211,0,0.07)"
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.08)"
            e.target.style.boxShadow = "none"
          }}
        />
      ) : (
        <input
          type={field.type === "color" ? "color" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = "#FFD300"
            e.target.style.boxShadow = "0 0 0 3px rgba(255,211,0,0.07)"
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.08)"
            e.target.style.boxShadow = "none"
          }}
        />
      )}
    </div>
  )
}