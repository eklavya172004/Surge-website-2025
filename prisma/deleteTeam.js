import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config({ path: "../.env.development" });

const db = new PrismaClient();

async function deleteTeam(teamId) {
  if (!teamId) {
    console.error("Team ID is required.");
    return;
  }

  console.log(`Attempting to delete team with ID ${teamId}...`);
  try {
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: { TeamMembers: true },
    });

    if (!team) {
      console.log(`❌ No team found with ID ${teamId}`);
      return;
    }

    const result = await db.team.delete({ where: { id: teamId } });
    console.log(`✅ Team with ID ${teamId} deleted successfully.`);
    console.log("Delete result:", result);
  } catch (error) {
    console.error(`❌ Error deleting team ${teamId}:`, error);
  }
}

async function main() {
  const teamIds = ["cmh2clogi0002ky09pvkqooem"];
  for (const id of teamIds) await deleteTeam(id);
  await db.$disconnect();
  console.log("✅ All teams processed and DB disconnected.");
}

main();
