import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "@/lib/prisma";

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  return {
    prisma,
    req: opts.req,
    res: opts.res,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
