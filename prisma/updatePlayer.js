import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv"
dotenv.config({path:"../.env.development"})

const prisma = new PrismaClient();

async function main() {
  // 🔹 The team where the player belongs
  const teamId = "cmh0c86uw0002jm0930ygqsfi";

  // 🔹 Identify the player you want to update
  //    (you can match by email, roll number, or phone)
  const identifier = {
    email: "aayanfaruqi@gmail.com", // 👈 replace with existing player's email
    rollNumber: "",
    phone: "9818026107"
  };

  // 🔹 New details for the player
  const updatedData = {
    name: "Omar adil",
    email: "omaaradil2007@gmail.com",
    rollNumber: "",
    phone: "9520350293",
  };

  // 1️⃣ Find the player in that team
  const existingPlayer = await prisma.teamMember.findFirst({
    where: {
      teamId,
      OR: [
        { email: identifier.email },
        { rollNumber: identifier.rollNumber },
        { phone: identifier.phone },
      ],
    },
  });

  if (!existingPlayer) {
    console.log("❌ Player not found in team:", teamId);
    return;
  }

  console.log("✅ Found player:", existingPlayer.name);

  // 2️⃣ Update the player's information
  const updatedPlayer = await prisma.teamMember.update({
    where: { id: existingPlayer.id },
    data: {
      ...updatedData,
    },
  });

  console.log("✅ Player updated successfully:");
  console.log(updatedPlayer);
}

main()
  .catch((err) => {
    console.error("❌ Error updating player:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });