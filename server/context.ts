import { prisma } from "@/lib/prisma";

export const createTRPCContext = async () => {
  return {
    prisma,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
