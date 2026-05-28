import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export function isAdmin(email?: string | null): boolean {
  if (!email) return false
  return adminEmails.includes(email.toLowerCase())
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session }) {
      if (session.user) {
        session.user.isAdmin = isAdmin(session.user.email)
      }
      return session
    },
  },
})

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      isAdmin?: boolean
    }
  }
}
