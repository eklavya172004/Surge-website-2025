import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const accommodationRouter = createTRPCRouter({
  getAccomodationTeams: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const teams = await ctx.db.team.findMany({
      where: {
        registeredById: userId,
        PaymentDetails: { paymentStatus: "PAID" },
        accommodationPaymentId: null,
      },
      include: {
        Event: { select: { category: true, name: true } },
        AccommodationDetails: true,
        _count: { select: { TeamMembers: true } },
      },
    });
    return teams;
  }),

  saveAccommodationDetails: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        maleCount: z.number(),
        femaleCount: z.number(),
        isUpdate: z.boolean().optional(),
        accomId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { teamId, startDate, endDate, maleCount, femaleCount, isUpdate } =
        input;
      if (isUpdate) {
        return await ctx.db.accommodationDetails.update({
          where: { id: input.accomId },
          data: { startDate, endDate, maleCount, femaleCount },
        });
      }
      const accom = await ctx.db.accommodationDetails.create({
        data: { teamId, startDate, endDate, maleCount, femaleCount },
      });
      return await ctx.db.team.update({
        where: { id: teamId },
        data: { AccommodationDetails: { connect: { id: accom.id } } },
      });
    }),

  accommodationCheckout: protectedProcedure
    .input(
      z.object({
        teamIds: z.array(z.string()),
        accomDetailsIds: z.array(z.string()),
        amount: z.number(),
        transactionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { teamIds, accomDetailsIds, amount, transactionId } = input;
      const accomPayment = await ctx.db.accommodationPayment.create({
        data: { amount, paymentProofUrl: transactionId },
      });
      await ctx.db.team.updateMany({
        where: { id: { in: teamIds } },
        data: { accommodationPaymentId: accomPayment.id },
      });
      await ctx.db.accommodationDetails.updateMany({
        where: { id: { in: accomDetailsIds } },
        data: { accommodationPaymentId: accomPayment.id },
      });
      return accomPayment;
    }),
});
