import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()

  if (!body.name || !body.slug) {
    return new Response("Invalid data", { status: 400 })
  }

  try {
    const project = await prisma.project.create({
      data: {
        name: body.name,
        slug: body.slug,
        data: body.data || {},
        userId: session.user.id,
      },
    })

    return Response.json(project)
  } catch (err) {
    return new Response("Error creating project", { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return Response.json(projects)
}