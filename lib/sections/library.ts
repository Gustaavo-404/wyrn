import { Theme } from "@/types/section"

import HeroSplitA from "@/components/sections/hero/minimal-dark/HeroSplitA"
import HeroCenterB from "@/components/sections/hero/minimal-dark/HeroCenterB"
import HeroGlowC from "@/components/sections/hero/minimal-dark/HeroGlowC"

import HeroSaaSSplitA from "@/components/sections/hero/saas-modern/HeroSaaSSplitA"
import HeroSaaSCenterB from "@/components/sections/hero/saas-modern/HeroSaaSCenterB"
import HeroSaaSDashboardC from "@/components/sections/hero/saas-modern/HeroSaaSDashboardC"

import HeroCreativeA from "@/components/sections/hero/creative-studio/HeroCreativeA"
import HeroCreativeB from "@/components/sections/hero/creative-studio/HeroCreativeB"
import HeroCreativeC from "@/components/sections/hero/creative-studio/HeroCreativeC"

import { SectionTemplate } from "@/types/template"

export const sectionLibrary: Record<
    Theme,
    SectionTemplate[]
> = {
    "minimal-dark": [
        {
            id: "hero-1",
            name: "Hero Split Layout",
            type: "hero",
            theme: "minimal-dark",
            variant: "default",
            component: HeroSplitA,
            defaultContent: {
                title: "Build faster",
                subtitle: "Modern SaaS builder",
            },
        },
        {
            id: "hero-2",
            name: "Hero Center Minimal",
            type: "hero",
            theme: "minimal-dark",
            variant: "default",
            component: HeroCenterB,
            defaultContent: {
                title: "Launch your idea",
                subtitle: "Ship faster than ever",
            },
        },
        {
            id: "hero-3",
            name: "Hero Glow CTA",
            type: "hero",
            theme: "minimal-dark",
            variant: "default",
            component: HeroGlowC,
            defaultContent: {
                title: "Create something amazing",
                subtitle: "Build modern web apps",
            },
        },
    ],
    "saas-modern": [
        {
            id: "hero-saas-1",
            name: "SaaS Split Hero",
            type: "hero",
            theme: "saas-modern",
            variant: "default",
            component: HeroSaaSSplitA,
            defaultContent: {
                title: "Build better products",
                subtitle: "Modern SaaS platform",
            },
        },
        {
            id: "hero-saas-2",
            name: "SaaS Center Hero",
            type: "hero",
            theme: "saas-modern",
            variant: "default",
            component: HeroSaaSCenterB,
            defaultContent: {
                title: "Launch faster",
                subtitle: "Ship in days, not months",
            },
        },
        {
            id: "hero-saas-3",
            name: "SaaS Dashboard Hero",
            type: "hero",
            theme: "saas-modern",
            variant: "default",
            component: HeroSaaSDashboardC,
            defaultContent: {
                title: "Your product, visualized",
                subtitle: "Real-time analytics & control",
            },
        },
    ],
    "creative-studio": [
        {
            id: "hero-creative-1",
            name: "Bold Typography Hero",
            type: "hero",
            theme: "creative-studio",
            variant: "default",
            component: HeroCreativeA,
            defaultContent: {
                title: "Design without limits",
                subtitle: "Creative studio experience",
            },
        },
        {
            id: "hero-creative-2",
            name: "Split Editorial Hero",
            type: "hero",
            theme: "creative-studio",
            variant: "default",
            component: HeroCreativeB,
            defaultContent: {
                title: "Ideas that stand out",
                subtitle: "Minimal but expressive layouts",
            },
        },
        {
            id: "hero-creative-3",
            name: "Layered Glow Hero",
            type: "hero",
            theme: "creative-studio",
            variant: "default",
            component: HeroCreativeC,
            defaultContent: {
                title: "Build visually stunning sites",
                subtitle: "Motion, depth and glow effects",
            },
        },
    ],
}