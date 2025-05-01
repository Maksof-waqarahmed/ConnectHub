import prisma from "@/lib/db";
import { Register_Schema } from "@/schemas";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findFirst({ where: { email } });
        return user;
    } catch {
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findFirst({ where: { id } });
        return user;
    } catch {
        return null;
    }
};

export const createUser = async (payload: z.infer<typeof Register_Schema>) => {
    try {
        return await prisma.user.create({
            data: payload,
        });
    } catch {
        return null;
    }
};

type UpdateUserType = Prisma.Args<typeof prisma.user, "update">["data"];
export const updateUserById = async (id: string, payload: UpdateUserType) => {
  try {
    return await prisma.user.update({
      where: { id },
      data: payload,
    });
  } catch {
    return null;
  }
};