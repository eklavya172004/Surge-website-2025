import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config({ path: "../.env.development" });

const prisma = new PrismaClient();

async function main() {
  // ✅ Team ID from which the player must be removed
  const teamId = "cmgr06uzf0002jr09n0wapthw";

  // ✅ Player ID to remove
  const playerId = "cmgr06v10000cjr09spprmdxn";

  // 1️⃣ Check if the player exists in that team
  const existingPlayer = await prisma.teamMember.findFirst({
    where: {
      id: playerId,
      teamId: teamId
    }
  });

  if (!existingPlayer) {
    console.log("❌ Player not found in this team. Nothing to delete.");
    return;
  }

  console.log("✅ Player found:", existingPlayer.name);

  // 2️⃣ Delete the player
  const deletedPlayer = await prisma.teamMember.delete({
    where: { id: playerId }
  });

  console.log("✅ Player removed successfully:");
  console.log(deletedPlayer);
}

main()
  .catch((err) => {
    console.error("❌ Error deleting player:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
