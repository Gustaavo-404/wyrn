import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import NewProjectButton from "@/components/NewProjectButton"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <h1 className="text-xl font-semibold">Lynq</h1>

        <div className="flex items-center gap-4">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="User"
              width={32}
              height={32}
              className="rounded-full"
            />
          )}

          <span className="text-sm opacity-80">
            {session.user?.name}
          </span>

          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm px-3 py-1 bg-white text-black rounded hover:opacity-80"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      {/* MAIN */}
      <main className="p-10">
        {/* TITLE */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold">
            Bem-vindo, {session.user?.name}
          </h2>
          <p className="opacity-60 mt-2">
            Crie e gerencie suas landing pages
          </p>
        </div>

        {/* ACTION */}
        <div className="mb-10">
          <NewProjectButton />
        </div>

        {/* PROJECTS */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Seus projetos
          </h3>

          {projects.length === 0 ? (
            <div className="border border-white/10 rounded-lg p-10 text-center opacity-60">
              Nenhum projeto ainda.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {projects.map((project) => (
                <a
                  key={project.id}
                  href={`/editor/${project.id}`}
                  className="p-6 border border-white/10 rounded-lg hover:border-white/30 transition"
                >
                  <h4 className="font-semibold">
                    {project.name}
                  </h4>
                  <p className="text-sm opacity-60 mt-2">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}