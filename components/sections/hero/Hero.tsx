export default function Hero({ title, subtitle }: any) {
  return (
    <section className="mb-20">
      <h1 className="text-5xl font-bold">{title}</h1>
      <p className="mt-4 text-xl opacity-70">{subtitle}</p>
    </section>
  )
}