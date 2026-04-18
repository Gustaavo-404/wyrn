import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

import type { Session, User } from "next-auth"

import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const authOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        Google({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],

    callbacks: {
        async session({ session, user }: { session: Session; user: User }) {
            if (session.user) {
                (session.user as any).id = user.id
            }
            return session
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
}