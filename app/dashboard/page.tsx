import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Image from "next/image"
import { signOut } from "next-auth/react"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

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
          <button className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:opacity-90">
            + Novo Projeto
          </button>
        </div>

        {/* PROJECTS */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Seus projetos
          </h3>

          <div className="border border-white/10 rounded-lg p-10 text-center opacity-60">
            Nenhum projeto ainda.
          </div>
        </div>
      </main>
    </div>
  )
}