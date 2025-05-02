import NextAuth from "next-auth";
import { authConfig } from "@/auth/config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db";
import { getUserById, updateUserById } from "@/services/user";
import { getTwoFactorConfirmationByUserId } from "@/services/two-factor-confirmation";
import { isExpired } from "@/lib/utils";
import { getAccountByUserId } from "@/services/account";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
    // update
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24, // 1 Day
    },
    // pages: {
    //     signIn: "/login",
    //     error: "/error",
    // },
    events: {
        async linkAccount({ user }) {
            const res = await updateUserById(user.id as string, { emailVerified: new Date() });
            console.log("Update User", res)
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
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
                session.user.isOAuth = token.isOAuth as boolean;
            }
            return session;
        },
        async signIn({ user, account }) {
            if (account?.provider !== "credentials") return true;
            const existingUser = await getUserById(user.id as string);
            console.log("existingUser", existingUser)
            if (!existingUser?.emailVerified) return false;
            if (existingUser.isTwoFactorEnabled) {
                const existingTwoFactorConfirmation = await getTwoFactorConfirmationByUserId(
                    existingUser.id
                );
                if (!existingTwoFactorConfirmation) return false;
                const hasExpired = isExpired(existingTwoFactorConfirmation.expires);
                if (hasExpired) return false;
            }
            return true;
        },
    },
    ...authConfig,
});