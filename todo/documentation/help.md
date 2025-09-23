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

# How to Call tRPC Procedures on the Frontend

This guide shows how to call your tRPC procedures from the frontend using the
[@trpc/client](https://trpc.io/docs/client/nextjs) library (or similar).\
Replace `reg` and `getAvailableSports` with your desired router and procedure.

---

## 1. **Setup tRPC Client**

First, set up your tRPC client (usually in a `utils/trpc.ts` file):

```typescript
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/api/root";

export const trpc = createTRPCReact<AppRouter>();
```

---

## 2. **Calling a Query Procedure**

**Example:** Call `reg.getAvailableSports` to fetch all sports.

```typescript
import { trpc } from "@/utils/trpc";

function SportsList() {
  const { data, isLoading, error } = trpc.reg.getAvailableSports.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map((sport) => <li key={sport.id}>{sport.name}</li>)}
    </ul>
  );
}
```

---

## 3. **Calling a Query with Input**

**Example:** Call `reg.getEventDetails` with a `sportSlug`:

```typescript
const { data, isLoading } = trpc.reg.getEventDetails.useQuery({
  sportSlug: "badminton-men",
});
```

---

## 4. **Calling a Mutation**

**Example:** Call `reg.createTeamWithMembers`:

```typescript
const mutation = trpc.reg.createTeamWithMembers.useMutation();

function handleCreateTeam() {
  mutation.mutate({
    eventId: "event-id",
    players: [
      {
        name: "Alice",
        email: "alice@example.com",
        rollNumber: "123",
        phone: "555-1234",
      },
      // ...more players
    ],
  });
}
```

---

## 5. **General Format**

```typescript
// For queries (fetching data)
const { data, isLoading, error } = trpc.routerName.procedureName.useQuery(input?);

// For mutations (changing data)
const mutation = trpc.routerName.procedureName.useMutation();
mutation.mutate(input);
```

- `routerName`: The router (e.g., `reg`, `user`, `events`)
- `procedureName`: The procedure (e.g., `getAvailableSports`,
  `createTeamWithMembers`)
- `input`: The input object required by the procedure (if any)

---

## 6. **Authentication**

- Procedures marked as `protectedProcedure` require the user to be
  authenticated.
- Make sure your frontend handles authentication (e.g., using NextAuth.js).

---

**For more details,
