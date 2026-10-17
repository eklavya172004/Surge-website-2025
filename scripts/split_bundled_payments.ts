import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function splitBundledPayments() {
  console.log("=== Splitting Bundled Payments into Per-Team Line Items ===");
  console.log("SAFETY GUARANTEE: Zero deletions. All teams, players, and users remain 100% intact.\n");

  // 1. Verify Before Counts
  const [teamsBefore, membersBefore, usersBefore, eventsBefore, paymentsBefore] = await Promise.all([
    prisma.team.count(),
    prisma.teamMember.count(),
    prisma.user.count(),
    prisma.event.count(),
    prisma.paymentDetails.findMany({ select: { amount: true } }),
  ]);

  const totalAmountBefore = paymentsBefore.reduce((sum, p) => sum + p.amount, 0);

  console.log("Counts BEFORE split:", {
    teams: teamsBefore,
    players: membersBefore,
    users: usersBefore,
    events: eventsBefore,
    paymentRecords: paymentsBefore.length,
    totalPaymentAmount: totalAmountBefore,
  });

  // 2. Fetch all bundled payments (linked to >1 team)
  const allPayments = await prisma.paymentDetails.findMany({
    include: {
      Teams: {
        include: {
          Event: true,
          TeamMembers: true,
          registeredBy: { select: { name: true } },
        },
      },
    },
  });

  const bundled = allPayments.filter((p) => p.Teams.length > 1);
  console.log(`\nFound ${bundled.length} bundled payments to split.`);

  let newRecordsCreated = 0;
  let teamsUpdated = 0;

  for (const p of bundled) {
    const student = p.Teams[0]?.registeredBy?.name || "Unknown";
    console.log(`\nProcessing Payment ${p.id} (Registered by: ${student}, Proof: "${p.paymentProofUrl}", Original: ₹${p.amount}, Teams: ${p.Teams.length}):`);

    // Verify bundle math before touching DB
    const calculatedTotal = p.Teams.reduce(
      (sum, t) => sum + (t.Event.pricePerPlayer || 0) * t.TeamMembers.length,
      0
    );
    if (calculatedTotal !== p.amount) {
      throw new Error(`Math mismatch for payment ${p.id}: recorded ${p.amount} vs calculated ${calculatedTotal}`);
    }

    // Execute split atomically per bundle with generous timeout for remote Supabase latency
    await prisma.$transaction(
      async (tx) => {
        // Team 0 keeps original payment record, amount updated to its fee
        const team0 = p.Teams[0];
        const team0Fee = (team0.Event.pricePerPlayer || 0) * team0.TeamMembers.length;

        await tx.paymentDetails.update({
          where: { id: p.id },
          data: { amount: team0Fee },
        });
        console.log(`  ✓ Team 1 (${team0.Event.name}): Kept Payment ${p.id} with fee ₹${team0Fee}`);

        // Teams 1..n get new PaymentDetails record
        for (let i = 1; i < p.Teams.length; i++) {
          const team = p.Teams[i];
          const teamFee = (team.Event.pricePerPlayer || 0) * team.TeamMembers.length;

          const newPayment = await tx.paymentDetails.create({
            data: {
              amount: teamFee,
              paymentStatus: p.paymentStatus,
              paymentProofUrl: p.paymentProofUrl,
              paymentMethod: p.paymentMethod,
              adminRemarks: p.adminRemarks,
              changedStatus: p.changedStatus,
              createdAt: p.createdAt,
            },
          });

          await tx.team.update({
            where: { id: team.id },
            data: { paymentDetailsId: newPayment.id },
          });

          newRecordsCreated++;
          teamsUpdated++;
          console.log(`  ✓ Team ${i + 1} (${team.Event.name}): Created Payment ${newPayment.id} with fee ₹${teamFee} (Proof: "${p.paymentProofUrl}")`);
        }
      },
      {
        maxWait: 20000,
        timeout: 60000,
      }
    );
  }

  // 3. Verify After Counts
  const [teamsAfter, membersAfter, usersAfter, eventsAfter, paymentsAfter] = await Promise.all([
    prisma.team.count(),
    prisma.teamMember.count(),
    prisma.user.count(),
    prisma.event.count(),
    prisma.paymentDetails.findMany({
      include: {
        Teams: true,
      },
    }),
  ]);

  const totalAmountAfter = paymentsAfter.reduce((sum, p) => sum + p.amount, 0);
  const remainingBundled = paymentsAfter.filter((p) => p.Teams.length > 1);

  console.log("\n============================================================");
  console.log("Counts AFTER split:", {
    teams: teamsAfter,
    players: membersAfter,
    users: usersAfter,
    events: eventsAfter,
    paymentRecords: paymentsAfter.length,
    totalPaymentAmount: totalAmountAfter,
    remainingBundledPayments: remainingBundled.length,
  });

  const integrityOk =
    teamsBefore === teamsAfter &&
    membersBefore === membersAfter &&
    usersBefore === usersAfter &&
    eventsBefore === eventsAfter &&
    totalAmountBefore === totalAmountAfter &&
    remainingBundled.length === 0;

  if (integrityOk) {
    console.log("\n✓ 100% INTEGRITY VERIFIED: Zero data lost! Total fees across DB exactly match (₹" + totalAmountAfter + ").");
    console.log(`✓ All teams now have their own independent 1-to-1 PaymentDetails record.`);
    console.log(`✓ Created ${newRecordsCreated} new per-team payment records in this run.`);
    console.log(`✓ Re-linked ${teamsUpdated} teams to their exact individual sport fees.`);
  } else {
    console.error("\n❌ WARNING: Integrity check failed!");
    process.exit(1);
  }
  console.log("============================================================\n");

  await prisma.$disconnect();
}

splitBundledPayments().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
