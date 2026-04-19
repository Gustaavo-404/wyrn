"use client"

import { useState, useEffect, useRef } from "react"
import { useEditorStore } from "@/store/useEditorStore"
import { generateHTML, generateReact, generateReactZip, downloadFile, slugify } from "@/lib/export"
import hljs from "highlight.js/lib/core"
import typescript from "highlight.js/lib/languages/typescript"
import xml from "highlight.js/lib/languages/xml"
import "highlight.js/styles/github-dark.css"

hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("xml", xml)

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconClose() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    )
}

function IconReact() {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <ellipse cx="14" cy="14" rx="3" ry="3" fill="#61DAFB" />
            <ellipse cx="14" cy="14" rx="11" ry="4.5" stroke="#61DAFB" strokeWidth="1.3" fill="none" />
            <ellipse cx="14" cy="14" rx="11" ry="4.5" stroke="#61DAFB" strokeWidth="1.3" fill="none" transform="rotate(60 14 14)" />
            <ellipse cx="14" cy="14" rx="11" ry="4.5" stroke="#61DAFB" strokeWidth="1.3" fill="none" transform="rotate(120 14 14)" />
        </svg>
    )
}

function IconHTML() {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M5 4L7.5 22.5L14 24.5L20.5 22.5L23 4H5Z" stroke="#E44D26" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
            <path d="M9 9H19M9.5 13.5H18.5M10.5 18H14H17.5" stroke="#E44D26" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    )
}

function IconDownload() {
    return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1.5V9M3.5 6.5L6.5 9.5L9.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1.5 11.5H11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    )
}

function IconCopy() {
    return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="4.5" y="4.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M4.5 8.5H3A1.5 1.5 0 0 1 1.5 7V3A1.5 1.5 0 0 1 3 1.5H7A1.5 1.5 0 0 1 8.5 3V4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    )
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ExportFormat = "react" | "html"

// ─── Preview de código ────────────────────────────────────────────────────────

function CodePreview({ code, language = "typescript" }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false)
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        if (ref.current) {
            ref.current.removeAttribute("data-highlighted")
            hljs.highlightElement(ref.current)
        }
    }, [code, language])

    function handleCopy() {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
    }

    return (
        <div style={{
            position: "relative",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
            overflow: "hidden",
        }}>
            {/* Copy button */}
            <button
                onClick={handleCopy}
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    fontFamily: "'DM Sans', sans-serif",
                    color: copied ? "rgba(100,220,100,0.8)" : "rgba(255,255,255,0.35)",
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 6,
                    padding: "4px 10px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    zIndex: 2,
                }}
                onMouseEnter={e => {
                    if (!copied) e.currentTarget.style.color = "#fff"
                }}
                onMouseLeave={e => {
                    if (!copied) e.currentTarget.style.color = "rgba(255,255,255,0.35)"
                }}
            >
                <IconCopy />
                {copied ? "Copied!" : "Copy"}
            </button>

            {/* Code */}
            <pre style={{
                margin: 0,
                padding: 0,
                overflowX: "auto",
                overflowY: "auto",
                maxHeight: 320,
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.08) transparent",
            }}>
                <code
                    ref={ref}
                    className={`language-${language}`}
                    style={{
                        display: "block",
                        padding: "16px 20px",
                        fontSize: 11.5,
                        lineHeight: 1.65,
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                        whiteSpace: "pre",
                    }}
                >
                    {code}
                </code>
            </pre>
        </div>
    )
}

// ─── Format card ──────────────────────────────────────────────────────────────

function FormatCard({
    format,
    selected,
    onClick,
}: {
    format: ExportFormat
    selected: boolean
    onClick: () => void
}) {
    const meta = {
        react: {
            icon: <IconReact />,
            label: "React Component",
            description: "Exporta como .tsx, pronto para usar no seu projeto Next.js ou React.",
            tag: ".tsx",
            tagColor: "#61DAFB",
        },
        html: {
            icon: <IconHTML />,
            label: "HTML + CSS",
            description: "Página estática completa com estilos inline. Abre em qualquer browser.",
            tag: ".html",
            tagColor: "#E44D26",
        },
    }[format]

    return (
        <button
            onClick={onClick}
            style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 10,
                padding: "16px 18px",
                borderRadius: 10,
                border: `1.5px solid ${selected ? "rgba(255,211,0,0.45)" : "rgba(255,255,255,0.08)"}`,
                background: selected ? "rgba(255,211,0,0.04)" : "rgba(255,255,255,0.02)",
                cursor: "pointer",
                transition: "all 0.18s",
                textAlign: "left",
                fontFamily: "'DM Sans', sans-serif",
                position: "relative",
                overflow: "hidden",
            }}
            onMouseEnter={e => {
                if (!selected) {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)"
                }
            }}
            onMouseLeave={e => {
                if (!selected) {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)"
                }
            }}
        >
            {/* Selected indicator */}
            {selected && (
                <div style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#FFD300",
                }} />
            )}

            {meta.icon}

            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: selected ? "#fff" : "rgba(255,255,255,0.7)" }}>
                        {meta.label}
                    </span>
                    <span style={{
                        fontFamily: "monospace",
                        fontSize: 9.5,
                        color: meta.tagColor,
                        background: `${meta.tagColor}18`,
                        border: `1px solid ${meta.tagColor}30`,
                        padding: "1px 6px",
                        borderRadius: 4,
                    }}>
                        {meta.tag}
                    </span>
                </div>
                <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: 1.5 }}>
                    {meta.description}
                </p>
            </div>
        </button>
    )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ExportModalProps {
    projectName: string
    onClose: () => void
}

export default function ExportModal({ projectName, onClose }: ExportModalProps) {
    const sections = useEditorStore((s) => s.sections)
    const [format, setFormat] = useState<ExportFormat>("react")
    const [exporting, setExporting] = useState(false)

    const code =
        format === "react"
            ? generateReact(sections, projectName)
            : generateHTML(sections, projectName)

    async function handleDownload() {
        if (format === "html") {
            const code = generateHTML(sections, projectName)
            downloadFile(`${slugify(projectName)}.html`, code, "text/html")
            return
        }

        setExporting(true)
        try {
            const blob = await generateReactZip(sections, projectName)
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${slugify(projectName)}.zip`
            a.click()
            URL.revokeObjectURL(url)
        } finally {
            setExporting(false)
        }
    }

    function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) onClose()
    }

    const downloadLabel = exporting
        ? "Generating..."
        : format === "react"
            ? `Download ${slugify(projectName)}.zip`
            : `Download ${slugify(projectName)}.html`

    return (
        <div
            onClick={handleBackdropClick}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 200,
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                animation: "fadeIn 0.15s ease",
            }}
        >
            <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
      `}</style>

            {/* Card container */}
            <div style={{
                width: "100%",
                maxWidth: 580,
                height: "calc(100vh - 48px)",
                display: "flex",
                flexDirection: "column",
                background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14,
                overflow: "hidden",
                fontFamily: "'DM Sans', sans-serif",
            }}>
                {/* Header - fixed */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 24px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    flexShrink: 0,
                }}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
                            Export project
                        </div>
                        <div style={{
                            fontFamily: "monospace",
                            fontSize: 10,
                            color: "rgba(255,255,255,0.25)",
                            marginTop: 2,
                        }}>
                            {sections.length} section{sections.length !== 1 ? "s" : ""} · {projectName}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 30,
                            height: 30,
                            borderRadius: 7,
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.4)",
                            cursor: "pointer",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = "#fff"
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = "rgba(255,255,255,0.4)"
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
                        }}
                    >
                        <IconClose />
                    </button>
                </div>

                {/* Scroll area - content */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "20px 24px",
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(255,255,255,0.08) transparent",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {/* Format selector */}
                        <div>
                            <div style={{
                                fontSize: 10,
                                fontWeight: 500,
                                letterSpacing: "0.13em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.25)",
                                marginBottom: 10,
                            }}>
                                Format
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <FormatCard format="react" selected={format === "react"} onClick={() => setFormat("react")} />
                                <FormatCard format="html" selected={format === "html"} onClick={() => setFormat("html")} />
                            </div>
                        </div>

                        {/* Code preview */}
                        <div>
                            <div style={{
                                fontSize: 10,
                                fontWeight: 500,
                                letterSpacing: "0.13em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.25)",
                                marginBottom: 10,
                            }}>
                                Preview
                            </div>
                            {sections.length === 0 ? (
                                <div style={{
                                    padding: "32px 20px",
                                    textAlign: "center",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: 10,
                                    color: "rgba(255,255,255,0.2)",
                                    fontSize: 13,
                                }}>
                                    No sections to export yet
                                </div>
                            ) : (
                                <CodePreview code={code} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer - fixed */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 10,
                    padding: "14px 24px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.01)",
                    flexShrink: 0,
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            fontSize: 12,
                            fontFamily: "inherit",
                            color: "rgba(255,255,255,0.35)",
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 7,
                            padding: "8px 16px",
                            cursor: "pointer",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = "#fff"
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = "rgba(255,255,255,0.35)"
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDownload}
                        disabled={sections.length === 0 || exporting}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            fontSize: 12,
                            fontFamily: "inherit",
                            fontWeight: 500,
                            color: (sections.length === 0 || exporting) ? "rgba(255,255,255,0.2)" : "#000",
                            background: (sections.length === 0 || exporting) ? "rgba(255,255,255,0.05)" : "#FFD300",
                            border: "1px solid transparent",
                            borderRadius: 7,
                            padding: "8px 18px",
                            cursor: (sections.length === 0 || exporting) ? "not-allowed" : "pointer",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={e => {
                            if (sections.length > 0 && !exporting) {
                                e.currentTarget.style.background = "#ffe033"
                            }
                        }}
                        onMouseLeave={e => {
                            if (sections.length > 0 && !exporting) {
                                e.currentTarget.style.background = "#FFD300"
                            }
                        }}
                    >
                        <IconDownload />
                        {downloadLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}