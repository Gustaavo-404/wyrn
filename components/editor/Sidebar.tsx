"use client"

import { useEditorStore } from "@/store/useEditorStore"
import { SectionType } from "@/types/section"
import { renderSection } from "@/lib/renderer"
import { renderSectionPreview } from "@/lib/sectionPreviewRenderer"

const sectionCatalog: {
    type: SectionType
    label: string
}[] = [
        { type: "hero", label: "Hero" },
        { type: "pricing", label: "Pricing" },
        { type: "steps", label: "Steps" },
        { type: "features", label: "Features" },
        { type: "testimonials", label: "Testimonials" },
        { type: "faq", label: "FAQ" },
        { type: "cta", label: "CTA" },
    ]

const defaultSections: Partial<Record<SectionType, any>> = {
    hero: { title: "Título", subtitle: "Sub" },
    pricing: { title: "Planos", plans: [] },
    steps: { title: "Como funciona", steps: [] },
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
        <div className="w-72 border-r border-white/10 p-4 overflow-y-auto">
            <h2 className="mb-4 font-semibold">Blocos</h2>

            <div className="space-y-4">
                {sectionCatalog.map((section) => (
                    <div
                        key={section.type}
                        onClick={() => handleAdd(section.type)}
                        className="w-full text-left border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition cursor-pointer"
                    >
                        {/* PREVIEW */}
                        <div className="h-44 overflow-hidden border border-white/10 rounded bg-white text-black">
                            <div className="scale-[0.25] origin-top-left w-[400%] pointer-events-none">
                                {renderSection({
                                    id: "preview",
                                    type: section.type,
                                    variant: "default",
                                    theme: "minimal-light",
                                    content: defaultSections[section.type],
                                })}
                            </div>
                        </div>

                        {/* LABEL */}
                        <div className="p-2 text-sm text-white">
                            + {section.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}