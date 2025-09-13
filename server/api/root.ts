import { createTRPCRouter } from "./trpc";
import { regRouter } from "./routers/reg";
import { paymentRouter } from "./routers/payments";
import { eventRouter } from "./routers/events";
import { userRouter } from "./routers/user";
import { accommodationRouter } from "./routers/accommodation";

export const appRouter = createTRPCRouter({
  reg: regRouter,
  payment: paymentRouter,
  event: eventRouter,
  user: userRouter,
  accommodation: accommodationRouter,
});

export type AppRouter = typeof appRouter;
