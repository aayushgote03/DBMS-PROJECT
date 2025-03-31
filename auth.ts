import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { supabase } from "@/providers/db";
import { useStyleRegistry } from "styled-jsx";
import { UserPlus } from "lucide-react";

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
          throw new Error("No user found with the entered identifier.");
        }

        // Validate password
        if (user.password !== password) {
          throw new Error("Incorrect password.");
        }

        // Return user object in the format NextAuth expects
        return {
          name: user.name,
          id: user.p_id
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/patientlogin", // Custom login page (optional)
    error: "/auth/error", // Error page (optional)
  },
});
