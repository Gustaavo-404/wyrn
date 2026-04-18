"use client"

type Plan = {
  name: string
  price: string
  description?: string
  features: string[]
  highlighted?: boolean
  buttonText?: string
}

type PricingProps = {
  title: string
  subtitle?: string
  plans: Plan[]
}

export default function Pricing({
  title,
  subtitle,
  plans,
}: PricingProps) {
  return (
    <section className="py-20 w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-white/60 mt-2">{subtitle}</p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`p-6 rounded-xl border ${
              plan.highlighted
                ? "border-white bg-white text-black"
                : "border-white/10 bg-white/5"
            }`}
          >
            <h3 className="text-xl font-semibold">{plan.name}</h3>

            <p className="text-3xl font-bold mt-4">
              {plan.price}
            </p>

            {plan.description && (
              <p className="text-sm mt-2 opacity-70">
                {plan.description}
              </p>
            )}

            <ul className="mt-6 space-y-2 text-sm">
              {plan.features.map((f, idx) => (
                <li key={idx}>• {f}</li>
              ))}
            </ul>

            <button
              className={`mt-6 w-full py-2 rounded-lg ${
                plan.highlighted
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {plan.buttonText || "Escolher plano"}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}