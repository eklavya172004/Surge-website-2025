import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function deleteUser(userId: string) {
  if (!userId || userId === "") {
    console.error("User ID is required.");
    return;
  }
  console.log(`Attempting to delete user with ID ${userId}...`);
  try {
    const user = await getUser(userId);
    if (user?.Team) {
      const teamIds = user.Team.map((team) => team.id);
      await deleteTeams(teamIds);
    }
    const result = await db.user.delete({
      where: {
        id: userId,
      },
    });
    console.log(
      `User with ID ${userId} and all related fields have been deleted.`,
    );
    console.log("Delete result:", result);
  } catch (error) {
    console.error("Error deleting user:", error);
  } finally {
    await db.$disconnect();
    console.log("Database connection closed.");
  }
}

async function deleteTeams(teamIds: string[]) {
  console.log(`Attempting to delete teams with IDs ${teamIds.join(", ")}...`);
  try {
    const result = await db.team.deleteMany({
      where: {
        id: { in: teamIds },
      },
    });
    console.log(
      `Teams with IDs ${teamIds.join(", ")} and all related fields have been deleted.`,
    );
    console.log("Delete result:", result);
  } catch (error) {
    console.error("Error deleting teams:", error);
  }
}

async function getUser(userId: string) {
  console.log(`Attempting to get user with ID ${userId}...`);
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Team: true,
      },
    });
    console.log("User found:", user);
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
  }
}

const deleteUserIds = ["558f2e65-84f6-48d2-9fda-4e787dff2d70","53754466-b037-4439-8e96-dff41be408f8","5283cb36-c4a2-45b3-920f-d3afd02c8553","4e26bbaf-9e48-420c-b83d-89a2008133f0","3ad2b96a-333c-4fad-b8bf-7f1bd503189c","37426ff7-6f9c-4837-9222-a0db6f23483c","2f64e0e5-2e19-4061-b176-104edf9448f8","2506519c-c309-4534-a8ac-75b20b2e75dc","0da8c3d6-ef0d-4805-b27c-9387366e0773","013945ea-9138-4034-9b4f-d503675968a3"];

deleteUserIds.forEach((userId) => {
  deleteUser(userId)
    .then(() => {
      console.log("User deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
    });
});
