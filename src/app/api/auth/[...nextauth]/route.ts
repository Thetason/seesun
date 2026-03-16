import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

console.log("[Auth] NEXTAUTH_SECRET presence:", !!process.env.NEXTAUTH_SECRET);
console.log("[Auth] NEXTAUTH_URL presence:", !!process.env.NEXTAUTH_URL);
console.log("[Auth] NODE_ENV:", process.env.NODE_ENV);

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
