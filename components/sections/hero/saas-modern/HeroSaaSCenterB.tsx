export default function HeroSaaSCenterB({ title, subtitle }: any) {
  return (
    <section className="text-center py-28">
      <h1 className="text-6xl font-bold">{title}</h1>
      <p className="mt-6 text-lg opacity-70 max-w-2xl mx-auto">
        {subtitle}
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <button className="px-6 py-2 bg-white text-black rounded">
          Start Free
        </button>
        <button className="px-6 py-2 border border-white/20 rounded">
          Docs
        </button>
      </div>

      <div className="mt-16 w-full max-w-4xl mx-auto h-56 bg-white/5 rounded-xl" />
    </section>
  )
}