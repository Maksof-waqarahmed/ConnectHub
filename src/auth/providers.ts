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
            throw new Error("Invalid input data");
        }

        const { email, password } = validFields.data;

        const user = await getUserByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        // if (!user.password) {
        //     throw new Error("Password not set for this account");
        // }

        // const isPasswordMatch = await bcrypt.compare(password, user.password);
        // if (!isPasswordMatch) {
        //     throw new Error("Invalid password");
        // }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image || null,
            number: user.phoneNumber || null,
            dateOfBirth: user.dateOfBirth || null,
            emailVerified: user.emailVerified || null,
            isOAuth: false,
        };
    },
});

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