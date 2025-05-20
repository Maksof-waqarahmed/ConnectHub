import { z } from "zod";

export const Login_Schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-])/,
            "Password must contain at least 1 uppercase letter, 1 number, and 1 special character"
        ),
})

export const Register_Schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email address"),

    number: z
        .string({ required_error: "Number is required" })
        .regex(/^\d{11}$/, "Number must be exactly 11 digits"),

    dob: z.string().date("Date in Required"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-])/,
            "Password must contain at least 1 uppercase letter, 1 number, and 1 special character"
        ),

    confirmPassword: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});