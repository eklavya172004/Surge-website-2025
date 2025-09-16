# for pushing seed events

```bash
node --loader ts-node/esm prisma/seed-events.ts
```

# tRPC Procedures and Their Routes

Below is a summary of all available tRPC procedures, grouped by router and
suffixed with their route.\
The route for each procedure is `/api/trpc/{router}.{procedure}`.

---

## reg router (`/api/trpc/reg.*`)

- **getAvailableSports**: `/api/trpc/reg.getAvailableSports`
- **getEventDetails**: `/api/trpc/reg.getEventDetails`
- **createTeamWithMembers**: `/api/trpc/reg.createTeamWithMembers`
- **getCart**: `/api/trpc/reg.getCart`
- **deleteTeamFromCart**: `/api/trpc/reg.deleteTeamFromCart`

---

## payment router (`/api/trpc/payment.*`)

_(Procedures not listed—check `server/api/routers/payments.ts` for details.)_

---

## events router (`/api/trpc/events.*`)

_(Procedures not listed—check `server/api/routers/events.ts` for details.)_

---

## user router (`/api/trpc/user.*`)

_(Procedures not listed—check `server/api/routers/user.ts` for details.)_

---

## accommodation router (`/api/trpc/accommodation.*`)

_(Procedures not listed—check `server/api/routers/accommodation.ts` for
details.)_

---

> **Note:**\
> For a complete list of procedures in each router, see the corresponding file
