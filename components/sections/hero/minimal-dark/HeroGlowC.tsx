export default function HeroGlowC({ title, subtitle }: any) {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-3xl" />

      <div className="relative text-center">
        <h1 className="text-5xl font-bold">{title}</h1>
        <p className="mt-4 opacity-70">{subtitle}</p>

        <button className="mt-8 px-6 py-2 bg-white text-black rounded">
          Get Started
        </button>
      </div>
    </section>
  )
}