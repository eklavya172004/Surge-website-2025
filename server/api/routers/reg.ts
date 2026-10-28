import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const regRouter = createTRPCRouter({
  getAvailableSports: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.event.findMany({
      orderBy: { name: "asc" },
    });
  }),
  getEventDetails: publicProcedure
    .input(z.object({ sportSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { slug: input.sportSlug },
      });
      if (!event) {
        throw new Error("Event not found");
      }
      return event;
    }),
  createTeamWithMembers: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        players: z.array(
          z.object({
            name: z.string(),
            email: z.string(),
            rollNumber: z.string().nullable(),
            phone: z.string(),
          }),
        ),
      }),
    )
    .mutation(async () => {
      throw new Error(
        "Registration is officially closed for all sports and athletics events (Closed due to excess participants, hope to see you in Surge’27!!)"
      );
    }),
  getCart: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await ctx.db.team.findMany({
      where: {
        registeredById: userId,
        OR: [
          { paymentDetailsId: null },
          { PaymentDetails: { paymentStatus: "NOT_PAID" } },
        ],
      },
      include: { Event: true, TeamMembers: true, PaymentDetails: true },
    });
  }),
  deleteTeamFromCart: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { teamId } = input;
      const userId = ctx.session.user.id;
      const team = await ctx.db.team.findFirst({
        where: {
          id: teamId,
          registeredById: userId,
          OR: [
            { paymentDetailsId: null },
            { PaymentDetails: { paymentStatus: "NOT_PAID" } },
          ],
        },
      });
      if (!team) {
        throw new Error("Team not found or already paid for.");
      }
      const paymentId = team.paymentDetailsId;
      await ctx.db.teamMember.deleteMany({ where: { teamId: team.id } });
      await ctx.db.team.delete({ where: { id: team.id } });
      if (paymentId) {
        await ctx.db.paymentDetails.delete({ where: { id: paymentId } }).catch(() => null);
      }
      return { success: true };
    }),
  migrateLocalCartToDb: protectedProcedure
    .input(
      z.object({
        localCart: z.array(
          z.object({
            eventId: z.string(),
            players: z.array(
              z.object({
                name: z.string(),
                email: z.string(),
                rollNumber: z.string().nullable(),
                phone: z.string(),
              }),
            ),
          }),
        ),
      }),
    )
    .mutation(async (): Promise<{ results: any[] }> => {
      throw new Error(
        "Registration is officially closed for all sports and athletics events (Closed due to excess participants, hope to see you in Surge’27!!)"
      );
    }),
});
