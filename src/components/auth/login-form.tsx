"use client";
import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Login_Schema } from "@/schemas";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const form = useForm<z.infer<typeof Login_Schema>>({
        resolver: zodResolver(Login_Schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof Login_Schema>) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            });

            console.log("signIn response:", response);

            if (response?.error) {
                setError(response.error);
                return;
            }

            if (response?.ok) {
                router.push('/dashboard');
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
            if (error) {
                form.reset();
            }
        }
    }

    async function handleOAuth(provider: string): Promise<void> {
        setIsLoading(true);
        setError(null);
        try {
            await signIn(provider, { callbackUrl: "/dashboard" });
        } catch (err) {
            setError(`Failed to sign in with ${provider}. Please try again.`);
            console.error(`OAuth error (${provider}):`, err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            {error && (
                <div className="text-red-500 text-sm text-center">
                    {error}
                </div>
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="xyz@gmail.com" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex justify-between items-center">
                                            <FormLabel>Password</FormLabel>
                                            <Link
                                                href="/auth/forgot-password"
                                                className="text-sm text-primary hover:text-primary/90 transition-colors"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" disabled={isLoading} />
                            <label
                                htmlFor="remember"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Remember me for 30 days
                            </label>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </div>
                </form>
            </Form>

            <div className="space-y-4">
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        onClick={() => handleOAuth("github")}
                        disabled={isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                            <path
                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                fill="currentColor"
                            />
                        </svg>
                        {isLoading ? "Loading..." : "GitHub"}
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        onClick={() => handleOAuth("google")}
                        disabled={isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" className="h-5 w-5">
                            <path
                                fill="#4285f4"
                                d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.3h146.9c-6.4 34.5-25.2 63.6-53.8 83.2v68h86.9c50.8-46.8 81.5-115.8 ajs81.5-196.1z"
                            />
                            <path
                                fill="#34a853"
                                d="M272 544.3c72.6 0 133.6-24.1 178.2-65.6l-86.9-68c-24.1 16.2-55 25.9-91.3 25.9-70 0-129.2-47.2-150.4-110.6H32.7v69.4C76.3 482.1 168.2 544.3 272 544.3z"
                            />
                            <path
                                fill="#fbbc04"
                                d="M121.6 325.9c-10.3-30.2-10.3-62.7 0-92.9V163.6H32.7c-35.3 70.7-35.3 153.1 0 223.8l88.9-61.5z"
                            />
                            <path
                                fill="#ea4335"
                                d="M272 107.7c39.5 0 75 13.6 103 40.4l77.1-77.1C405.6 24.2 344.6 0 272 0 168.2 0 76.3 62.2 32.7 163.6l88.9 69.4C142.8 154.9 202 107.7 272 107.7z"
                            />
                        </svg>
                        {isLoading ? "Loading..." : "Google"}
                    </Button>
                </div>
            </div>
        </div>
    );
}