export default function HeroCreativeA({ title, subtitle }: any) {
  return (
    <section className="py-28 text-center">
      <h1 className="text-7xl font-bold tracking-tight">
        {title}
      </h1>

      <p className="mt-6 text-xl opacity-70">
        {subtitle}
      </p>

      <div className="mt-10">
        <button className="px-8 py-3 bg-white text-black rounded-full">
          Explore
        </button>
      </div>
    </section>
  )
}