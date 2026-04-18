import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const project = await prisma.project.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!project) {
    return new Response("Not found", { status: 404 })
  }

  return Response.json(project)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()

  const updated = await prisma.project.updateMany({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    data: {
      name: body.name,
      data: body.data,
    },
  })

  if (updated.count === 0) {
    return new Response("Not found", { status: 404 })
  }

  const project = await prisma.project.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  return Response.json(project)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const deleted = await prisma.project.deleteMany({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (deleted.count === 0) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(null, { status: 204 })
}