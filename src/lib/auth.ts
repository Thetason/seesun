import { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "a_very_secure_secret_key_for_sisun",
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const normalizedEmail = credentials.email.trim().toLowerCase();

                // TEMPORARY BYPASS FOR DEBUGGING
                if (normalizedEmail === "vocal202065@gmail.com" && credentials.password === "seesun_debug_unlock") {
                    console.log("[Auth] BYPASS AUTHORIZATION SUCCESS for vocal202065@gmail.com");
                    return {
                        id: "cmmtc9u830001pumofajne7q6", // Real ID found in DB
                        email: normalizedEmail,
                        name: "서영빈 (Bypass)",
                        role: "COACH",
                    };
                }

                console.log("[Auth] Authorizing email:", normalizedEmail);
                const user = await prisma.user.findUnique({
                    where: {
                        email: normalizedEmail
                    }
                });

                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    console.log("[Auth] Password mismatch for:", credentials.email);
                    return null;
                }

                console.log("[Auth] Authorization successful for:", credentials.email);

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        }
    }
};
