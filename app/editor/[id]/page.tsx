import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import EditorClient from "./EditorClient"
import { SectionInstance } from "@/types/section"

type ProjectData = {
  version: number
  sections: SectionInstance[]
}

function parseProjectData(raw: unknown): ProjectData {
  if (
    raw !== null &&
    typeof raw === "object" &&
    !Array.isArray(raw) &&
    "sections" in raw &&
    Array.isArray((raw as any).sections)
  ) {
    return {
      version: (raw as any).version ?? 1,
      sections: (raw as any).sections as SectionInstance[],
    }
  }

  return { version: 1, sections: [] }
}

export default async function EditorPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const raw = await prisma.project.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!raw) {
    return <div>Projeto não encontrado</div>
  }

  const project = {
    id: raw.id,
    name: raw.name,
    data: parseProjectData(raw.data),
  }

  return <EditorClient project={project} />
}