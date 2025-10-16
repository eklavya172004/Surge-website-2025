import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv"
dotenv.config({path:"../.env.development"})

const db = new PrismaClient();

async function deleteTeam(teamId: string) {
  if (!teamId || teamId === "") {
    console.error("Team ID is required.");
    return;
  }

  console.log(`Attempting to delete team with ID ${teamId}...`);
  try {
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: { TeamMembers: true }, // optional: adjust relation name if needed
    });

    if (!team) {
      console.log(`❌ No team found with ID ${teamId}`);
      return;
    }

    const result = await db.team.delete({
      where: { id: teamId },
    });

    console.log(`✅ Team with ID ${teamId} deleted successfully.`);
    console.log("Delete result:", result);
  } catch (error) {
    console.error(`❌ Error deleting team ${teamId}:`, error);
  }
}

async function main() {
  const teamIds = ["cmgl15r9s0002jl096r0ra4jp"]; // your target team ID(s)

  for (const teamId of teamIds) {
    await deleteTeam(teamId);
  }

  await db.$disconnect();
  console.log("✅ All teams processed and DB disconnected.");
}

main();
