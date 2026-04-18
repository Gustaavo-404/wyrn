"use client"

import { useEditorStore } from "@/store/useEditorStore"
import { sectionLibrary } from "@/lib/sections/library"
import { SectionTemplate } from "@/types/template"

export default function Sidebar() {
    const addSection = useEditorStore((s: any) => s.addSection)

    function handleAdd(template: SectionTemplate) {
        addSection({
            id: crypto.randomUUID(),
            type: template.type,
            theme: template.theme,
            variant: template.variant,

            component: template.component,

            content: template.defaultContent,
        })
    }

    return (
        <div className="w-80 border-r border-white/10 p-4 overflow-y-auto">

            <h2 className="mb-4 font-semibold">
                Section Marketplace
            </h2>

            {Object.entries(sectionLibrary).map(([theme, sections]) => (
                <div key={theme} className="mb-6">

                    <h3 className="text-xs uppercase text-white/40 mb-3">
                        {theme}
                    </h3>

                    <div className="space-y-3">

                        {sections.map((template) => (
                            <div
                                key={template.id}
                                onClick={() => handleAdd(template)}
                                className="
                                    cursor-pointer
                                    border border-white/10 rounded-lg
                                    overflow-hidden hover:border-white/30
                                    transition bg-white/5
                                "
                            >

                                {/* PREVIEW (REAL SECTION) */}
                                <div className="h-44 overflow-hidden bg-white text-black">
                                    <div className="scale-[0.25] origin-top-left w-[400%] pointer-events-none">
                                        {(() => {
                                            const Preview = template.component
                                            return <Preview {...template.defaultContent} />
                                        })()}
                                    </div>
                                </div>

                                {/* INFO */}
                                <div className="p-2">
                                    <div className="text-sm font-medium">
                                        {template.name}
                                    </div>
                                    <div className="text-xs text-white/40">
                                        {template.type}
                                    </div>
                                </div>

                            </div>
                        ))}

                    </div>
                </div>
            ))}
        </div>
    )
}