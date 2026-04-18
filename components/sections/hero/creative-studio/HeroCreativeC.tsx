export default function HeroCreativeC({ title, subtitle }: any) {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-white/5 blur-3xl opacity-30" />

      <div className="relative text-center">
        <h1 className="text-6xl font-bold">{title}</h1>
        <p className="mt-6 opacity-70">{subtitle}</p>

        <button className="mt-10 px-6 py-2 bg-white text-black rounded">
          Contact Us
        </button>
      </div>
    </section>
  )
}