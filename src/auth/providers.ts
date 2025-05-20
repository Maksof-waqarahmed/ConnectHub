import { Login_Schema, Register_Schema } from "@/schemas";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { createUserByEmail, getUserByEmail } from "@/services/user";

export const CredentialsProvider = Credentials({
    async authorize(credentials) {
        const validLogin = await Login_Schema.safeParseAsync(credentials);

        if (!validLogin.success) {
            throw new Error("Invalid input data");
        }

        const { email, password } = validLogin.data;
        let user = await getUserByEmail(email);

        if (!user) {

            const { password, ...restData } = credentials as any;

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await createUserByEmail({
                data: {
                    ...restData,
                    password: hashedPassword,
                },
            });

            console.log("New User", newUser)

            user = newUser;
        }

        if (!user!.password || typeof user!.password !== 'string') {
            throw new Error("User has no valid password");
        }

        const isPasswordMatch = await bcrypt.compare(password, user!.password);

        if (!isPasswordMatch) {
            throw new Error("Invalid password");
        }

        return {
            id: user!.id,
            name: user!.name,
            email: user!.email,
            image: user!.image || null,
            number: user!.phoneNumber || null,
            dateOfBirth: user!.dateOfBirth || null,
            emailVerified: user!.emailVerified || null,
            isOAuth: false,
        };
    },
});
export const GithubProvider = Github({
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
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