export type PricingContent = {
  title: string
  subtitle?: string
  plans: {
    name: string
    price: string
    description?: string
    features: string[]
    highlighted?: boolean
    buttonText?: string
  }[]
}