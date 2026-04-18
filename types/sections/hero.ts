export type HeroContent = {
  title: string
  subtitle?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  secondaryButtonText?: string
  image?: string
  video?: string
  alignment?: "left" | "center" | "right"
  animatedText?: boolean
  backgroundEffect?: "none" | "gradient" | "particles" | "grid"
}