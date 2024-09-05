// api/auth/[...nextauth]/route.ts
import { authConfig } from "@/lib/authConfig";
import NextAuth from "next-auth/next";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
