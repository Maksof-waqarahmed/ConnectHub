import NextAuth from "next-auth";
import { authConfig } from "@/auth/config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db";
import { getUserById, updateUserById } from "@/services/user";
import { getAccountByUserId } from "@/services/account";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24, // 1 Day
    },
    events: {
        async linkAccount({ user }) {
            await updateUserById(user.id as string, { emailVerified: new Date() });
        },
    },
    callbacks: {
        async jwt({ token }) {
            if (!token.sub) return token;
            const existingUser = await getUserById(token.sub);
            if (!existingUser) return token;
            const existingAccount = await getAccountByUserId(existingUser.id);
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.picture = existingUser.image || null;
            token.dateOfBirth = existingUser.dateOfBirth || null;
            token.number = existingUser.phoneNumber || null;
            token.emailVerified = existingUser.emailVerified || null;
            token.isOAuth = !!existingAccount;
            return token;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email as string;
                session.user.image = token.picture || null;
                session.user.emailVerified = token.emailVerified as Date || null;
                session.user.dateOfBirth = token.dateOfBirth as Date || null;
                session.user.number = token.number as string || null;
                session.user.isOAuth = token.isOAuth as boolean;
            }
            return session;
        },
        async signIn({ user, account }) {
            if (account?.provider === "credentials") {
                const existingUser = await getUserById(user.id as string);
                if (!existingUser?.emailVerified) {
                    throw new Error("Please verify your email before logging in");
                }
            }
            return true;
        },
    },
    ...authConfig,
});