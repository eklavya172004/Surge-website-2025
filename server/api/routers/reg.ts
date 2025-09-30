import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const regRouter = createTRPCRouter({
  getAvailableSports: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.event.findMany();
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
    .mutation(async ({ ctx, input }) => {
      const { eventId, players } = input;
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new Error("User is not authenticated.");
      }
      
      // Fetch event details to validate player count
      const event = await ctx.db.event.findUnique({
        where: { id: eventId },
      });
      
      if (!event) {
        throw new Error("Event not found.");
      }
      
      // Validate player count
      const playerCount = players.length;
      if (event.minPlayers && playerCount < event.minPlayers) {
        throw new Error(`Minimum ${event.minPlayers} players required for this event.`);
      }
      if (event.maxPlayers && playerCount > event.maxPlayers) {
        throw new Error(`Maximum ${event.maxPlayers} players allowed for this event.`);
      }
      
      const team = await ctx.db.team.create({
        data: { registeredById: userId, eventId: eventId },
      });
      await ctx.db.teamMember.createMany({
        data: players.map((player) => ({
          name: player.name,
          email: player.email,
          rollNumber: player.rollNumber,
          phone: player.phone,
          eventId: eventId,
          teamId: team.id,
        })),
      });
      return team;
    }),
  getCart: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await ctx.db.team.findMany({
      where: { registeredById: userId, paymentDetailsId: null },
      include: { Event: true, TeamMembers: true },
    });
  }),
  deleteTeamFromCart: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { teamId } = input;
      const userId = ctx.session.user.id;
      const team = await ctx.db.team.findFirst({
        where: { id: teamId, registeredById: userId, paymentDetailsId: null },
      });
      if (!team) {
        throw new Error("Team not found or already paid for.");
      }
      await ctx.db.teamMember.deleteMany({ where: { teamId: team.id } });
      await ctx.db.team.delete({ where: { id: team.id } });
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
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      const { localCart } = input;
      const results = [];

      for (const cartItem of localCart) {
        const { eventId, players } = cartItem;

        // Fetch event details to validate player count
        const event = await ctx.db.event.findUnique({
          where: { id: eventId },
        });

        if (!event) {
          results.push({ eventId, success: false, error: "Event not found" });
          continue;
        }

        // Validate player count
        const playerCount = players.length;
        if (event.minPlayers && playerCount < event.minPlayers) {
          results.push({ 
            eventId, 
            success: false, 
            error: `Minimum ${event.minPlayers} players required for this event.` 
          });
          continue;
        }
        if (event.maxPlayers && playerCount > event.maxPlayers) {
          results.push({ 
            eventId, 
            success: false, 
            error: `Maximum ${event.maxPlayers} players allowed for this event.` 
          });
          continue;
        }

        // Check if the user already has a team for this event in the database
        const existingTeam = await ctx.db.team.findFirst({
          where: { 
            registeredById: userId, 
            eventId: eventId,
            paymentDetailsId: null,
          },
        });

        if (existingTeam) {
          // If a team already exists in the database for this event, skip
          results.push({ 
            eventId, 
            success: false, 
            error: "Team already exists in database for this event" 
          });
          continue;
        }

        // Create a new team in the database
        const team = await ctx.db.team.create({
          data: { 
            registeredById: userId, 
            eventId: eventId,
          },
        });

        // Create team members in the database
        await ctx.db.teamMember.createMany({
          data: players.map((player) => ({
            name: player.name,
            email: player.email,
            rollNumber: player.rollNumber,
            phone: player.phone,
            eventId: eventId,
            teamId: team.id,
          })),
        });

        results.push({ eventId, success: true, teamId: team.id });
      }

      return { results };
    }),
});
