import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const paymentRouter = createTRPCRouter({
  calculateTotalAmount: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const teams = await ctx.db.team.findMany({
      where: { registeredById: userId, paymentDetailsId: null },
      include: { Event: true, TeamMembers: true },
    });
    const totalAmount = teams.reduce((total, team) => {
      return total + team.Event.pricePerPlayer * team.TeamMembers.length;
    }, 0);
    return totalAmount;
  }),

  finalizePayment: protectedProcedure
    .input(
      z.object({ transactionId: z.string(), teamIds: z.array(z.string()) }),
    )
    .mutation(async ({ ctx, input }) => {
      const { transactionId, teamIds } = input;
      const userId = ctx.session.user.id;
      const teams = await ctx.db.team.findMany({
        where: {
          id: { in: teamIds },
          registeredById: userId,
          paymentDetailsId: null,
        },
        include: { Event: true, TeamMembers: true },
      });
      const totalAmount = teams.reduce((total, team) => {
        return total + team.Event.pricePerPlayer * team.TeamMembers.length;
      }, 0);
      const payment = await ctx.db.paymentDetails.create({
        data: {
          paymentProofUrl: transactionId,
          amount: totalAmount,
          paymentStatus: "PENDING",
        },
      });
      await ctx.db.team.updateMany({
        where: { id: { in: teamIds } },
        data: { paymentDetailsId: payment.id },
      });
      return payment;
    }),
});
