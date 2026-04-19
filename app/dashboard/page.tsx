import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import NewProjectButton from "@/components/NewProjectButton"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  const firstName = session.user?.name?.split(" ")[0] ?? "there"
  const totalSections = (projects as any[]).reduce((acc, p) => {
    return acc + ((p.data as any)?.sections?.length ?? 0)
  }, 0)

  return (
    <>
      {/* Font import */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen bg-black text-white flex flex-col overflow-x-hidden"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── Ambient background ── */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {/* Top-left yellow glow */}
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #FFD300 0%, transparent 70%)" }}
          />
          {/* Bottom-right subtle glow */}
          <div
            className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-[0.025]"
            style={{ background: "radial-gradient(ellipse, #FFD300 0%, transparent 60%)" }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        {/* ── Header ── */}
        <header className="relative z-10 sticky top-0 flex items-center justify-between px-10 h-14 border-b border-white/[0.06] backdrop-blur-xl"
          style={{ background: "rgba(0,0,0,0.82)" }}>
          <div className="flex items-center gap-8">
            <span className="text-[17px] font-semibold tracking-tight">
              Lynq<span style={{ color: "#FFD300" }}>.</span>
            </span>
            <nav className="hidden md:flex items-center gap-1">
              {[["Projects", true], ["Templates", false], ["Docs", false]].map(([label, active]) => (
                <span
                  key={label as string}
                  className={`text-xs px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                    active
                      ? "text-white/80 bg-white/[0.06]"
                      : "text-white/30 hover:text-white/55 hover:bg-white/[0.03]"
                  }`}
                >
                  {label as string}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <circle cx="4.5" cy="4.5" r="3.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.1" />
                <path d="M7.5 7.5L10 10" stroke="rgba(255,255,255,0.2)" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              <span className="text-[11px] text-white/20 font-mono">Search projects…</span>
              <span className="ml-2 text-[9px] font-mono text-white/15 border border-white/[0.08] rounded px-1 py-px">⌘K</span>
            </div>

            <div className="flex items-center gap-2 pl-1 pr-3 py-1 border border-white/[0.08] rounded-full bg-white/[0.02]">
              {session.user?.image && (
                <Image src={session.user.image} alt="User" width={24} height={24} className="rounded-full block" />
              )}
              <span className="text-xs text-white/50">{session.user?.name}</span>
            </div>

            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-[11px] text-white/25 border border-white/[0.07] rounded-md px-3 py-1.5 hover:text-white/60 hover:border-white/[0.15] transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-10 pt-12 pb-24">

          {/* ── Hero ── */}
          <div className="flex items-start justify-between gap-6 mb-12">
            <div>
              <p
                className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3"
                style={{ color: "#FFD300", opacity: 0.65 }}
              >
                Dashboard
              </p>
              <h2 className="text-[44px] font-semibold tracking-[-0.035em] leading-none mb-3">
                Hey, {firstName}<span className="text-white/20">.</span>
              </h2>
              <p className="text-sm text-white/35 font-light max-w-xs leading-relaxed">
                Build, manage and export your landing pages and portfolios.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 shrink-0">
              <NewProjectButton />
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {[
              { label: "Projects", value: projects.length, accent: true },
              { label: "Sections built", value: totalSections, accent: false },
              {
                label: "Last activity",
                value: projects[0]
                  ? new Date(projects[0].createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "—",
                accent: false,
                small: true,
              },
              { label: "Plan", value: "Free", accent: false, small: true },
            ].map(({ label, value, accent, small }) => (
              <div
                key={label}
                className="px-5 py-4 rounded-xl border border-white/[0.06] bg-white/[0.015] flex flex-col gap-1.5"
              >
                <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-white/20">{label}</p>
                <p
                  className={`font-semibold tracking-tight ${small ? "text-lg" : "text-3xl"} ${accent ? "" : "text-white"}`}
                  style={accent ? { color: "#FFD300" } : {}}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* ── Quick actions ── */}
          <div className="mb-12">
            <p className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/20 mb-4">Quick start</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v12M2 8h12" stroke="#FFD300" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ),
                  title: "New project",
                  sub: "Start from scratch",
                  cta: true,
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1" y="2" width="14" height="10" rx="2" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                      <path d="M4 6h8M4 9h5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.1" strokeLinecap="round" />
                    </svg>
                  ),
                  title: "Browse templates",
                  sub: "50+ ready-made sections",
                  cta: false,
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1v8M5 6l3 3 3-3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 11v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  ),
                  title: "Export design",
                  sub: "React and HTML available",
                  cta: false,
                },
              ].map(({ icon, title, sub, cta }) => (
                <button
                  key={title}
                  className="group flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200"
                  style={{
                    border: cta ? "1px solid rgba(255,211,0,0.2)" : "1px solid rgba(255,255,255,0.06)",
                    background: cta ? "rgba(255,211,0,0.04)" : "rgba(255,255,255,0.015)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: cta ? "rgba(255,211,0,0.08)" : "rgba(255,255,255,0.04)",
                      border: cta ? "1px solid rgba(255,211,0,0.15)" : "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80 mb-0.5">{title}</p>
                    <p className="text-[11px] text-white/30">{sub}</p>
                  </div>
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className="ml-auto text-white/15 group-hover:text-white/40 transition-colors shrink-0"
                  >
                    <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* ── Projects ── */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/20">
                Your projects · {projects.length}
              </p>
              {projects.length > 0 && (
                <div className="flex items-center gap-1">
                  {["Grid", "List"].map((v) => (
                    <span
                      key={v}
                      className={`text-[10px] px-2.5 py-1 rounded-md cursor-pointer font-mono transition-colors ${
                        v === "Grid" ? "bg-white/[0.06] text-white/50" : "text-white/20 hover:text-white/35"
                      }`}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/[0.07] rounded-2xl gap-4 text-center">
                <div
                  className="w-14 h-14 rounded-2xl border border-dashed border-white/10 flex items-center justify-center mb-2"
                  style={{ background: "rgba(255,211,0,0.03)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 3v14M3 10h14" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white/30 mb-1">No projects yet</p>
                  <p className="text-xs text-white/15">Create your first landing page to get started</p>
                </div>
                <NewProjectButton />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {projects.map((project, i) => {
                  const sectionCount = (project.data as any)?.sections?.length ?? 0
                  return (
                    <a
                      key={project.id}
                      href={`/editor/${project.id}`}
                      className="group relative flex flex-col justify-between p-5 border border-white/[0.07] rounded-xl bg-white/[0.015] hover:bg-white/[0.035] hover:border-white/[0.13] transition-all duration-200 hover:-translate-y-px overflow-hidden"
                    >
                      {/* Top shimmer */}
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD300]/0 to-transparent group-hover:via-[#FFD300]/25 transition-all duration-300" />

                      {/* Thumbnail preview area */}
                      <div
                        className="w-full rounded-lg mb-4 overflow-hidden flex items-center justify-center"
                        style={{
                          height: 88,
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        {/* Mini section stack preview */}
                        <div className="flex flex-col gap-1 w-3/4 opacity-40">
                          {[...Array(Math.min(sectionCount || 3, 3))].map((_, j) => (
                            <div
                              key={j}
                              className="rounded"
                              style={{
                                height: j === 0 ? 18 : 10,
                                background: j === 0
                                  ? "rgba(255,211,0,0.4)"
                                  : "rgba(255,255,255,0.12)",
                                width: j === 0 ? "100%" : j === 1 ? "75%" : "50%",
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white tracking-tight truncate mb-0.5">
                            {project.name}
                          </p>
                          <p className="font-mono text-[10px] text-white/25">
                            {new Date(project.createdAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </p>
                        </div>
                        <svg
                          width="12" height="12" viewBox="0 0 12 12" fill="none"
                          className="shrink-0 ml-3 mt-0.5 text-white/15 group-hover:text-[#FFD300] group-hover:translate-x-px group-hover:-translate-y-px transition-all duration-200"
                        >
                          <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>

                      {/* Footer meta */}
                      <div className="flex items-center gap-3 pt-3 border-t border-white/[0.05]">
                        <span className="font-mono text-[9px] text-white/20">
                          {sectionCount} section{sectionCount !== 1 ? "s" : ""}
                        </span>
                        <span className="w-px h-3 bg-white/10" />
                        <span
                          className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                          style={{
                            background: "rgba(255,211,0,0.08)",
                            color: "rgba(255,211,0,0.5)",
                            border: "1px solid rgba(255,211,0,0.12)",
                          }}
                        >
                          draft
                        </span>
                      </div>
                    </a>
                  )
                })}

                {/* New project card */}
                <div className="group flex flex-col items-center justify-center gap-3 p-5 border border-dashed border-white/[0.06] rounded-xl hover:border-white/[0.12] hover:bg-white/[0.015] transition-all duration-200 cursor-pointer min-h-[200px]">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 2v10M2 7h10" stroke="rgba(255,255,255,0.25)" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-xs text-white/25 group-hover:text-white/40 transition-colors">New project</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Tips / changelog strip ── */}
          <div className="mt-16 pt-8 border-t border-white/[0.05]">
            <div className="flex items-center justify-between mb-5">
              <p className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/20">What's new</p>
              <span className="font-mono text-[9px] text-white/15 hover:text-white/30 cursor-pointer transition-colors">View all →</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { tag: "New", title: "Export to React", body: "Download your project as a ready-to-use .tsx component." },
                { tag: "Improved", title: "Drag & drop reorder", body: "Rearrange sections in the editor with smooth drag & drop." },
                { tag: "Coming soon", title: "Custom domains", body: "Publish directly to your own domain with one click." },
              ].map(({ tag, title, body }) => (
                <div
                  key={title}
                  className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.01]"
                >
                  <span
                    className="inline-block font-mono text-[8.5px] tracking-[0.12em] uppercase px-1.5 py-0.5 rounded mb-3"
                    style={{
                      background: tag === "New"
                        ? "rgba(255,211,0,0.1)"
                        : tag === "Improved"
                          ? "rgba(100,200,100,0.08)"
                          : "rgba(255,255,255,0.05)",
                      color: tag === "New"
                        ? "rgba(255,211,0,0.6)"
                        : tag === "Improved"
                          ? "rgba(100,200,100,0.6)"
                          : "rgba(255,255,255,0.25)",
                      border: tag === "New"
                        ? "1px solid rgba(255,211,0,0.15)"
                        : tag === "Improved"
                          ? "1px solid rgba(100,200,100,0.12)"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {tag}
                  </span>
                  <p className="text-[13px] font-medium text-white/70 mb-1.5">{title}</p>
                  <p className="text-xs text-white/25 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

        </main>

        {/* ── Footer ── */}
        <footer className="relative z-10 border-t border-white/[0.05] px-10 py-5 flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/15">
            Lynq · {new Date().getFullYear()}
          </span>
          <div className="flex items-center gap-5">
            {["Help", "Privacy", "Terms"].map((l) => (
              <span key={l} className="text-[11px] text-white/20 hover:text-white/40 cursor-pointer transition-colors">
                {l}
              </span>
            ))}
          </div>
        </footer>

      </div>

      {/* ── Animations ── */}
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dashboard-root > * {
          animation: fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>
    </>
  )
}