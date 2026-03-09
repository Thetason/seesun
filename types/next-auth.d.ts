import type { DefaultSession } from "next-auth";

// Enhance the default session type to include 'role' and 'id'
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
        } & DefaultSession["user"];
    }

    interface User {
        role: string;
    }
}
