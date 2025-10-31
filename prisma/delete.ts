import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv"
dotenv.config({path:"../.env.development"})


const db = new PrismaClient();

async function deleteUser(userId: string) {
  if (!userId || userId === "") {
    console.error("User ID is required.");
    return;
  }

  console.log(`Attempting to delete user with ID ${userId}...`);
  try {
    const user = await getUser(userId);

    if (user?.Team?.length) {
      const teamIds = user.Team.map((team) => team.id);
      await deleteTeams(teamIds);
    }

    const result = await db.user.delete({
      where: { id: userId },
    });

    console.log(`✅ User with ID ${userId} deleted successfully.`);
    console.log("Delete result:", result);
  } catch (error) {
    console.error(`❌ Error deleting user ${userId}:`, error);
  }
}

async function deleteTeams(teamIds: string[]) {
  console.log(`Deleting teams: ${teamIds.join(", ")}...`);
  try {
    const result = await db.team.deleteMany({
      where: { id: { in: teamIds } },
    });
    console.log(`✅ Deleted ${result.count} team(s).`);
  } catch (error) {
    console.error("Error deleting teams:", error);
  }
}

async function getUser(userId: string) {
  try {
    return await db.user.findUnique({
      where: { id: userId },
      include: { Team: true },
    });
  } catch (error) {
    console.error("Error getting user:", error);
  }
}

const deleteUserIds = ["cmgr06v10000cjr09spprmdxn"];

async function main() {
  for (const userId of deleteUserIds) {
    await deleteUser(userId);
  }
  await db.$disconnect();
  console.log("✅ All users processed and DB disconnected.");
}

main();
