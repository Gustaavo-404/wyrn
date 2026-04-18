export default function Hero({ title, subtitle }: any) {
  return (
    <section className="mb-20 py-16">
      <div className="max-w-4xl mx-auto text-center">
        
        <div className="inline-flex items-center px-3 py-1 mb-6 text-xs rounded-full border border-white/10 bg-white/5 text-white/70">
          New • Builder Preview
        </div>

        <h1 className="text-6xl font-bold tracking-tight leading-tight">
          {title}
        </h1>

        <p className="mt-6 text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition">
            Get started
          </button>

          <button className="px-6 py-3 rounded-lg border border-white/20 text-white/80 hover:bg-white/5 transition">
            Learn more
          </button>
        </div>

        <div className="mt-16 mx-auto w-72 h-32 bg-white/10 blur-3xl rounded-full opacity-30" />
      </div>
    </section>
  )
}