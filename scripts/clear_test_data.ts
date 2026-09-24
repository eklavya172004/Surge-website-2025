import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });
dotenv.config();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearTestData() {
  console.log("Starting test data clearance (teams, players, payments)...");
  console.log("Note: users, accounts, verification tokens, and events will NOT be touched.\n");

  const [beforeUsers, beforeEvents, beforeTeams, beforeMembers, beforePayments] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.team.count(),
    prisma.teamMember.count(),
    prisma.paymentDetails.count(),
  ]);

  console.log("Counts BEFORE clearing:", {
    users: beforeUsers,
    events: beforeEvents,
    teams: beforeTeams,
    players: beforeMembers,
    payments: beforePayments,
  });

  // Execute deletion in order of foreign key dependencies
  const deletedPlayerLogs = await prisma.playerLog.deleteMany();
  const deletedGateLogs = await prisma.gateLog.deleteMany();
  const deletedTeamMembers = await prisma.teamMember.deleteMany();
  const deletedAccomDetails = await prisma.accommodationDetails.deleteMany();
  const deletedTeams = await prisma.team.deleteMany();
  const deletedPayments = await prisma.paymentDetails.deleteMany();
  const deletedAccomPayments = await prisma.accommodationPayment.deleteMany();

  const [afterUsers, afterEvents, afterTeams, afterMembers, afterPayments] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.team.count(),
    prisma.teamMember.count(),
    prisma.paymentDetails.count(),
  ]);

  console.log("\nDeletion Summary:", {
    deletedTeamMembers: deletedTeamMembers.count,
    deletedTeams: deletedTeams.count,
    deletedPayments: deletedPayments.count,
    deletedAccomDetails: deletedAccomDetails.count,
    deletedAccomPayments: deletedAccomPayments.count,
    deletedPlayerLogs: deletedPlayerLogs.count,
    deletedGateLogs: deletedGateLogs.count,
  });

  console.log("\nCounts AFTER clearing:", {
    users: afterUsers,
    events: afterEvents,
    teams: afterTeams,
    players: afterMembers,
    payments: afterPayments,
  });

  if (afterUsers !== beforeUsers) {
    console.error("ERROR: User count changed! Expected:", beforeUsers, "Found:", afterUsers);
  } else {
    console.log("✓ User accounts preserved safely:", afterUsers);
  }

  if (afterEvents !== beforeEvents) {
    console.error("ERROR: Event count changed! Expected:", beforeEvents, "Found:", afterEvents);
  } else {
    console.log("✓ Sports events preserved safely:", afterEvents);
  }

  await prisma.$disconnect();
}

clearTestData().catch((err) => {
  console.error("Failed to clear test data:", err);
  process.exit(1);
});
