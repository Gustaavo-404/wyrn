export default function HeroSplitA({ title, subtitle }: any) {
  return (
    <section className="flex items-center justify-between py-20">
      <div>
        <h1 className="text-5xl font-bold">{title}</h1>
        <p className="mt-4 opacity-70">{subtitle}</p>
      </div>

      <div className="w-64 h-64 bg-white/10 rounded-xl" />
    </section>
  )
}