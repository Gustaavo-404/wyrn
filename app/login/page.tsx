"use client"

import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>

      <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
        Entrar com Google
      </button>

      <button onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
        Entrar com GitHub
      </button>
    </div>
  )
}