export default function HeroCenterB({ title, subtitle }: any) {
  return (
    <section className="text-center py-24">
      <h1 className="text-6xl font-bold">{title}</h1>
      <p className="mt-4 text-lg opacity-70">{subtitle}</p>
    </section>
  )
}