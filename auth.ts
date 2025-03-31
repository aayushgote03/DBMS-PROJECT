import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { supabase } from "@/providers/db";


export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "identifier", type: "text", placeholder: "Enter email or phone" },
        loginMethod: { label: "loginMethod", type: "text", placeholder: "Enter login method" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password || !credentials?.loginMethod) {
          throw new Error("All fields are required!");
        }

        const { identifier, password, loginMethod } = credentials;

        // Define condition based on login method
        let query;
        if (loginMethod === "email") {
          query = supabase.from("patients").select("*").eq("email_id", identifier).maybeSingle();
        } else if (loginMethod === "phone") {
          query = supabase.from("patients").select("*").eq("mobile_no", identifier).maybeSingle();
        } else {
          throw new Error("Invalid login method. Use 'email' or 'mobile'.");
        }

        // Fetch user based on condition
        const { data: user, error } = await query;

        if (error || !user) {
          return null; // This will trigger a redirect to the signIn page
        }

        // Validate password
        if (user.password !== password) {
          return null; // This will trigger a redirect to the signIn page
        }

        // Return the full user object
        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Store full user object in JWT
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;
      return session;
    },
  },

  pages: {
    signIn: "/auth/patientlogin",
    error: "/auth/error",
  },
});
