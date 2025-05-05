"use server";

import { signIn } from "@/auth";
import { Login_Schema } from "@/schemas";
import { z } from "zod";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/services/user";
import bcrypt from "bcryptjs";
import { response } from "@/lib/utils";

export const login = async (payload: z.infer<typeof Login_Schema>) => {
    const validatedFields = Login_Schema.safeParse(payload);
    if (!validatedFields.success) {
        return response({
            success: false,
            error: {
                code: 422,
                message: "Invalid fields.",
            },
        });
    }

    const { email, password } = validatedFields.data;
    console.log(`Login attempt for email: ${email}`);

    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return response({
            success: false,
            error: {
                code: 401,
                message: "Invalid credentials.",
            },
        });
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatch) {
        return response({
            success: false,
            error: {
                code: 401,
                message: "Invalid credentials.",
            },
        });
    }

    if (!existingUser.emailVerified) {
        return response({
            success: false,
            error: {
                code: 401,
                message: "Your email address is not verified yet. Please check your email.",
            },
        });
    }

    return await signInCredentials(email, password);
};

export const signInCredentials = async (email: string, password: string) => {
    console.log(`Signing in with credentials for email: ${email}`);
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });
        return response({
            success: true,
            code: 200,
            message: "Login successful.",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return response({
                        success: false,
                        error: {
                            code: 401,
                            message: "Invalid credentials.",
                        },
                    });

                case "OAuthAccountNotLinked":
                    return response({
                        success: false,
                        error: {
                            code: 403,
                            message:
                                "Another account already registered with the same Email Address. Please login the different one.",
                        },
                    });

                case "Verification":
                    return response({
                        success: false,
                        error: {
                            code: 422,
                            message: "Verification failed. Please try again.",
                        },
                    });

                case "AuthorizedCallbackError":
                    return response({
                        success: false,
                        error: {
                            code: 422,
                            message: "Authorization failed. Please try again.",
                        },
                    });

                default:
                    return response({
                        success: false,
                        error: {
                            code: 500,
                            message: "Something went wrong.",
                        },
                    });
            }
        }
        console.error("Unexpected error during sign-in:", error);
        throw error;
    }
};