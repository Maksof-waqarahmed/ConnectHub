import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    isOAuth: boolean;
    dateOfBirth?: Date | null;
    emailVerified?: Date | null;
    number?: string | null;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}

declare module "@auth/core/jwt" {
    interface JWT extends ExtendedUser { }
}

// declare module "next-auth/providers/github" {
//   interface GithubProfile {
//     role: Role;
//   }
// }

// declare module "next-auth/providers/google" {
//   interface GoogleProfile {
//     role: Role;
//   }
// }