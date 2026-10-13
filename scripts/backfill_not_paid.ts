import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function backfillNotPaid() {
  console.log("=== Backfill NOT_PAID PaymentDetails for Unpaid Teams ===");

  // Find only teams that have NO paymentDetailsId yet
  const unpaidTeams = await prisma.team.findMany({
    where: { paymentDetailsId: null },
    include: {
      Event: true,
      TeamMembers: true,
      registeredBy: { select: { name: true, email: true, phone: true } },
    },
  });

  console.log(`Found ${unpaidTeams.length} teams with paymentDetailsId: null.`);

  if (unpaidTeams.length === 0) {
    console.log("No teams need backfilling. All teams already have PaymentDetails.");
    await prisma.$disconnect();
    return;
  }

  let successCount = 0;

  for (const team of unpaidTeams) {
    const pricePerPlayer = team.Event?.pricePerPlayer || 0;
    const playerCount = team.TeamMembers.length;
    const amount = pricePerPlayer * playerCount;

    // Create a new PaymentDetails record in NOT_PAID state
    const payment = await prisma.paymentDetails.create({
      data: {
        amount,
        paymentStatus: "NOT_PAID",
        paymentMethod: "ONLINE",
      },
    });

    // Link the team to this payment record
    await prisma.team.update({
      where: { id: team.id },
      data: { paymentDetailsId: payment.id },
    });

    successCount++;
    console.log(
      `[${successCount}/${unpaidTeams.length}] Backfilled Team ${team.id} (${team.Event.name}) by ${team.registeredBy.name} -> PaymentDetails ${payment.id} (₹${amount})`
    );
  }

  console.log(`\nSuccessfully backfilled ${successCount} teams with NOT_PAID PaymentDetails!`);
  await prisma.$disconnect();
}

backfillNotPaid().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
