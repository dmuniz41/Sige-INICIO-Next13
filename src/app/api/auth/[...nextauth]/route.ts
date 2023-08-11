import axios from "axios";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        user: { label: "User", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: credentials?.user,
            password: credentials?.password,
          }),
        });

        const DBUser = await res.json();
        if (DBUser) return DBUser;
        else return null;
      },
    }),
  ],
  pages:{
    signIn: "/auth/login"
  }
});

export { handler as GET, handler as POST };
