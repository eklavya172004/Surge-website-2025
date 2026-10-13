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

      const existingPaymentIds = Array.from(
        new Set(
          teams
            .map((t) => t.paymentDetailsId)
            .filter((id): id is string => Boolean(id))
        )
      );

      let finalPaymentId: string;

      if (existingPaymentIds.length === 1) {
        // Update existing NOT_PAID PaymentDetails record to PENDING
        finalPaymentId = existingPaymentIds[0];
        await ctx.db.paymentDetails.update({
          where: { id: finalPaymentId },
          data: {
            amount: totalAmount,
            paymentProofUrl: transactionId,
            paymentStatus: "PENDING",
            changedStatus: new Date(),
          },
        });
        await ctx.db.team.updateMany({
          where: { id: { in: teamIds } },
          data: { paymentDetailsId: finalPaymentId },
        });
      } else {
        // If multiple different payment IDs or legacy null teams paying together, create or consolidate
        const payment = await ctx.db.paymentDetails.create({
          data: {
            paymentProofUrl: transactionId,
            amount: totalAmount,
            paymentStatus: "PENDING",
            paymentMethod: "ONLINE",
            changedStatus: new Date(),
          },
        });
        finalPaymentId = payment.id;

        await ctx.db.team.updateMany({
          where: { id: { in: teamIds } },
          data: { paymentDetailsId: finalPaymentId },
        });

        // Clean up any old orphaned NOT_PAID records
        if (existingPaymentIds.length > 0) {
          for (const oldId of existingPaymentIds) {
            const count = await ctx.db.team.count({ where: { paymentDetailsId: oldId } });
            if (count === 0) {
              await ctx.db.paymentDetails.delete({ where: { id: oldId } }).catch(() => null);
            }
          }
        }
      }

      return { id: finalPaymentId, amount: totalAmount, paymentStatus: "PENDING" };
    }),
});
