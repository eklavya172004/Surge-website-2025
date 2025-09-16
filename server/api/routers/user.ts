import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        name: true,
        email: true,
        collegeName: true,
        rollNumber: true,
        phone: true,
        accomActive: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }),
});
