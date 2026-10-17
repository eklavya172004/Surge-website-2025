import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const paymentRouter = createTRPCRouter({
  calculateTotalAmount: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const teams = await ctx.db.team.findMany({
      where: {
        registeredById: userId,
        OR: [
          { paymentDetailsId: null },
          { PaymentDetails: { paymentStatus: "NOT_PAID" } },
        ],
      },
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
          OR: [
            { paymentDetailsId: null },
            { PaymentDetails: { paymentStatus: "NOT_PAID" } },
          ],
        },
        include: { Event: true, TeamMembers: true, PaymentDetails: true },
      });

      if (teams.length === 0) {
        throw new Error("No payable teams found.");
      }

      const totalAmount = teams.reduce((total, team) => {
        return total + team.Event.pricePerPlayer * team.TeamMembers.length;
      }, 0);

      // Keep each team on its own individual 1-to-1 PaymentDetails record with its exact sport fee
      // This ensures Retool shows accurate per-sport amounts and allows verifying each sport individually
      for (const team of teams) {
        const teamFee = (team.Event.pricePerPlayer || 0) * team.TeamMembers.length;

        if (team.paymentDetailsId) {
          await ctx.db.paymentDetails.update({
            where: { id: team.paymentDetailsId },
            data: {
              amount: teamFee,
              paymentProofUrl: transactionId,
              paymentStatus: "PENDING",
              paymentMethod: "ONLINE",
              changedStatus: new Date(),
            },
          });
        } else {
          const newPayment = await ctx.db.paymentDetails.create({
            data: {
              amount: teamFee,
              paymentProofUrl: transactionId,
              paymentStatus: "PENDING",
              paymentMethod: "ONLINE",
              changedStatus: new Date(),
            },
          });
          await ctx.db.team.update({
            where: { id: team.id },
            data: { paymentDetailsId: newPayment.id },
          });
        }
      }

      return { success: true, count: teams.length, amount: totalAmount, paymentStatus: "PENDING" };
    }),
});
