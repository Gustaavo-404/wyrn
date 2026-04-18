export default function HeroSaaSSplitA({ title, subtitle }: any) {
  return (
    <section className="flex items-center justify-between py-24 gap-12">
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold leading-tight">
          {title}
        </h1>
        <p className="mt-5 text-lg opacity-70">
          {subtitle}
        </p>

        <div className="mt-8 flex gap-3">
          <button className="px-5 py-2 bg-white text-black rounded">
            Get Started
          </button>
          <button className="px-5 py-2 border border-white/20 rounded">
            Learn More
          </button>
        </div>
      </div>

      <div className="w-[420px] h-[260px] bg-white/5 rounded-xl border border-white/10" />
    </section>
  )
}