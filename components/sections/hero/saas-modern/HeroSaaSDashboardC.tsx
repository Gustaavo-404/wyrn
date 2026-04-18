export default function HeroSaaSDashboardC({ title, subtitle }: any) {
  return (
    <section className="py-24 grid grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-5xl font-bold">{title}</h1>
        <p className="mt-5 opacity-70">{subtitle}</p>

        <button className="mt-8 px-6 py-2 bg-white text-black rounded">
          Try Now
        </button>
      </div>

      <div className="h-[300px] bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10" />
    </section>
  )
}