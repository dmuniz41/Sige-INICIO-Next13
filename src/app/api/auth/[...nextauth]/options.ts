// Temporary simplified authOptions with pages option
import { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      // Add the accessToken here
      accessToken?: string;
      // Add any other custom properties your backend user object has and you need
      // role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Usually derived from user.id and set as 'sub'
    name?: string | null;
    email?: string | null;
    // Add the accessToken here
    accessToken?: string;
    // Add any other custom properties you put in the token
    // role?: string;
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "User", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user: credentials?.username,
            password: credentials?.password
          })
        });

        if (!res.ok) {
          console.error("API Login failed: Status", res.status, res.statusText);
          return null;
        }

        const user = await res.json();

        if (user && user.id && user.accessToken) {
          return user;
        } else {
          console.error("API Login failed: User object not received or invalid structure", user);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as SessionStrategy
  },

  pages: {
    signIn: "/auth/login"
  },

  callbacks: {
    async session({ session, token }: any) {
      if (!session.user) {
        session.user = {} as any; // Basic initialization if somehow missing
      }

      // Transfer the accessToken from the token to the session.user
      if (token.accessToken) {
        session.user.accessToken = token.accessToken;
      }

      if (token.sub) {
        // 'sub' is the user ID claim in the JWT by default
        session.user.id = token.sub; // Assign id from the token's sub claim
      }

      // console.log("🚀 ~ session callback END ~ returning session:", session);
      return session; // Return the modified or default session object
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = (user as any).accessToken; // Add accessToken to the token
        token.id = user.id;
      }

      // console.log("🚀 ~ jwt callback END ~ returning token:", token);
      return token; // Return the modified or default token
    }
  }
};
