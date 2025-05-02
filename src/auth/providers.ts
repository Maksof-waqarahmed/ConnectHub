import { Login_Schema } from "@/schemas";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "@/services/user";


export const CredentialsProvider = Credentials({
    async authorize(credentials) {
        const validFields = await Login_Schema.safeParseAsync(credentials);

        if (!validFields.success) {
            return null;
        }
        const { email, password } = validFields.data;
        const user = await getUserByEmail(email);
        if (!user) return null;
        const isPasswordMatch = await bcrypt.compare(password, user.password! || '');
        if (!isPasswordMatch) return null;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            isTwoFactorEnabled: user.isTwoFactorEnabled,
            isOAuth: false,
            avatar: user.image || null,
        }
    }
})
export const GithubProvider = Github({
    clientId: process.env.GITHUB_ID as string,
    clientSecret: process.env.GITHUB_SECRET as string,
});

export const GoogleProvider = Google({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    authorization: {
        params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
        },
    },
});
