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
      
      // Block registration if event is Cricket Men, Football Men, Powerlifting, or Basketball Women
      if (event.slug === "cricket-men" || event.name.toLowerCase() === "cricket men") {
        throw new Error("Registration is closed for Cricket Men (Closed due to excess participants, hope to see you in Surge’27!!)");
      }
      if (
        event.slug === "football" ||
        event.name.toLowerCase() === "football" ||
        event.name.toLowerCase() === "football men"
      ) {
        throw new Error("Registration is closed for Football Men (Closed due to excess participants, hope to see you in Surge’27!!)");
      }
      if (
        event.slug.startsWith("powerlifting-") ||
        event.name.toLowerCase().includes("powerlifting")
      ) {
        throw new Error(`Registration is closed for ${event.name} (Closed due to excess participants, hope to see you in Surge’27!!)`);
      }
      if (
        event.slug === "basketball-women" ||
        event.name.toLowerCase() === "basketball women"
      ) {
        throw new Error("Registration is closed for Basketball Women (Closed due to excess participants, hope to see you in Surge’27!!)");
      }

      // Block registration for closed athletics events
      const CLOSED_ATHLETICS_SLUGS = new Set([
        "100m-men",
        "100m-women",
        "400m-men",
        "800m-men",
        "800m-women",
        "1500m-men",
        "1500m-women",
        "5000m-men",
        "5000m-women",
        "4x100m-men",
        "4x100m-women",
        "4x100m-mixed",
        "4x400m-men",
        "4x400m-women",
        "4x400m-mixed",
        "long-jump-men",
        "long-jump-women",
        "shot-put-men",
        "shot-put-women",
        "discus-throw-men",
        "discus-throw-women",
      ]);
      if (CLOSED_ATHLETICS_SLUGS.has(event.slug)) {
        throw new Error(`Registration is closed for ${event.name} (Closed due to excess participants, hope to see you in Surge’27!!)`);
      }
      
      // Validate player count
      const playerCount = players.length;
      if (event.minPlayers && playerCount < event.minPlayers) {
        throw new Error(`Minimum ${event.minPlayers} players required for this event.`);
      }
      if (event.maxPlayers && playerCount > event.maxPlayers) {
        throw new Error(`Maximum ${event.maxPlayers} players allowed for this event.`);
      }
      
      // Calculate registration fee
      const pricePerPlayer = event.pricePerPlayer || 0;
      const totalAmount = pricePerPlayer * players.length;

      // Create PaymentDetails in NOT_PAID state immediately
      const payment = await ctx.db.paymentDetails.create({
        data: {
          amount: totalAmount,
          paymentStatus: "NOT_PAID",
          paymentMethod: "ONLINE",
        },
      });

      const team = await ctx.db.team.create({
        data: {
          registeredById: userId,
          eventId: eventId,
          paymentDetailsId: payment.id,
        },
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
            OR: [
              { paymentDetailsId: null },
              { PaymentDetails: { paymentStatus: "NOT_PAID" } },
            ],
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

        const pricePerPlayer = event.pricePerPlayer || 0;
        const totalAmount = pricePerPlayer * players.length;

        const payment = await ctx.db.paymentDetails.create({
          data: {
            amount: totalAmount,
            paymentStatus: "NOT_PAID",
            paymentMethod: "ONLINE",
          },
        });

        // Create a new team in the database
        const team = await ctx.db.team.create({
          data: { 
            registeredById: userId, 
            eventId: eventId,
            paymentDetailsId: payment.id,
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
