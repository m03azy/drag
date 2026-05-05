import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if (!user || user.password !== credentials.password) {
                    // In a real app, use bcrypt to compare hashed passwords
                    return null
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            },
        }),
    ],
    pages: {
        signIn: "/wp-admin/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnAdmin = nextUrl.pathname.startsWith("/wp-admin")
            const isOnLogin = nextUrl.pathname.startsWith("/wp-admin/login")

            if (isOnAdmin && !isOnLogin) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            }
            return true
        },
    },
})
