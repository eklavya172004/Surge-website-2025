// src/server/api/trpc.ts

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { type Session, getServerSession } from "next-auth";

import { authOptions } from "../auth"; // adjust path if needed
import { db } from "../db";

/**
 * 1. CONTEXT
 */
interface CreateContextOptions {
  session: Session | null;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

// App Router version – uses the native Request object
export const createTRPCContext = async (opts: { req: Request }) => {
  const session = await getServerSession(authOptions);

  return createInnerTRPCContext({
    session,
  });
};

/**
 * 2. INITIALIZATION
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE
 */
export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Try LogIn / SignUp",
    });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
