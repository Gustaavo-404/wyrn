export default function HeroCreativeB({ title, subtitle }: any) {
  return (
    <section className="grid grid-cols-2 gap-16 py-24 items-center">
      <div>
        <h1 className="text-6xl font-bold leading-tight">
          {title}
        </h1>
      </div>

      <div>
        <p className="text-lg opacity-70">{subtitle}</p>

        <div className="mt-8 h-40 border border-white/10 rounded-xl bg-white/5" />
      </div>
    </section>
  )
}