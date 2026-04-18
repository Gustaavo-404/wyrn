"use client"

type Step = {
  title: string
  description: string
  icon?: string
}

type StepsProps = {
  title: string
  subtitle?: string
  steps: Step[]
}

export default function Steps({
  title,
  subtitle,
  steps,
}: StepsProps) {
  return (
    <section className="py-20 w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-white/60 mt-2">{subtitle}</p>
        )}
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className="p-6 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="text-2xl font-bold mb-3">
              {String(i + 1).padStart(2, "0")}
            </div>

            <h3 className="text-xl font-semibold">
              {step.title}
            </h3>

            <p className="text-white/60 mt-2 text-sm">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}