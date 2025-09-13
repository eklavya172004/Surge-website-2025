import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { MatchData, SinglePlayerEvent, MultiPlayerEvent } from "@/types/types";

// These types are inferred from your Prisma schema.
// You should have similar types available, or you can generate them.
// Replace `Prisma...` with the actual names from your project.
type PrismaMultiPlayerEventData = {
  eventName: string;
  team1: string;
  team2: string;
  score1: string | null;
  score2: string | null;
  win: number | null;
  location: string | null;
  time: string | null;
};

type PrismaSinglePlayerEventData = {
  eventName: string;
  time: string | null;
  gold: string | null;
  silver: string | null;
  bronze: string | null;
  name: string | null;
};

export const eventRouter = createTRPCRouter({
  getMyEvents: protectedProcedure.query(async ({ ctx }) => {
    // ... (rest of your code)
  }),

  getSportFixtures: publicProcedure.query(async ({ ctx }) => {
    // 1. Get data from the database. We know the transaction returns a tuple.
    const events = await ctx.db.$transaction([
      ctx.db.multiPlayerEventData.findMany(),
      ctx.db.singlePlayerEventData.findMany(),
    ]);

    // 2. Add a type assertion to tell TypeScript what is in the `events` array.
    const [multiPlayerEvents, singlePlayerEvents] = events as [
      PrismaMultiPlayerEventData[],
      PrismaSinglePlayerEventData[],
    ];

    const matchData: MatchData = {};

    // 3. Use the correct type in the `forEach` loop and handle nullable properties.
    multiPlayerEvents.forEach((event) => {
      const eventName = event.eventName;
      if (eventName.toLowerCase().includes("final")) {
        if (!matchData[eventName]) {
          matchData[eventName] = [];
        }
        (matchData[eventName] as MultiPlayerEvent[]).push({
          team1: event.team1,
          team2: event.team2,
          score1: event.score1 ?? "-", // Use nullish coalescing to provide a default value
          score2: event.score2 ?? "-",
          win: event.win ?? 0, // Default to 0 if null
          location: event.location ?? "TBA",
          time: event.time ?? "TBA",
        });
      }
    });

    singlePlayerEvents.forEach((event) => {
      const eventName = event.eventName;
      if (!matchData[eventName]) {
        matchData[eventName] = [];
      }
      (matchData[eventName] as SinglePlayerEvent[]).push({
        time: event.time ?? "TBA",
        gold: event.gold ?? "N/A",
        silver: event.silver ?? "N/A",
        bronze: event.bronze ?? "N/A",
        name: event.name ?? "N/A",
      });
    });

    return matchData;
  }),
});
