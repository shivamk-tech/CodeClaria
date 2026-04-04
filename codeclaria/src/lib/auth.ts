import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import connectDb from "./db"
import User from "@/model/user.model"

const authOption: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "github") {
        await connectDb()

        const githubId = profile?.id?.toString()
        const email = profile?.email
        const name = profile?.name || profile?.login
        const image = profile?.avatar_url

        let existUser = await User.findOne({ githubId })

        // create user if not exists
        if (!existUser) {
          existUser = await User.create({
            githubId,
            name,
            email,
            image,
          })
        }

        return true
      }

      return false
    },

    async jwt({ token, account, profile }) {
      // first login
      if (account && profile) {
        token.id = profile.id
        token.name = profile.name || profile.login
        token.email = profile.email
        token.image = profile.avatar_url
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id?.toString() ?? ""
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.image as string
      }

      return session
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
}

export default authOption