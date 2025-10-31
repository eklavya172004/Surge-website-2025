import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv"
dotenv.config({path:"../.env.development"})

const prisma = new PrismaClient();


async function main() {
  const oldPlayer = {
    // name: "Rachit Tomar",
    email: "tomarrachit71@gmail.com"
    // rollNumber: "231068",
    // phone: "8076553030", 
    // teamId:"cmh51b8sm0009js0918if2vks"
  };

  // New player details
  const newPlayer = {
    name: "rudrajit chaliha",
    email: "rudrajitcha@gmail.com",
    rollNumber: "25510155",
    phone: "6003048025",
  };

  const existingPlayer = await prisma.teamMember.findFirst({
                         where:{
                            name:oldPlayer.name,
                            email:oldPlayer.email,
                            phone:oldPlayer.phone,
                            teamId:oldPlayer.teamId
                         }
  })

    if (!existingPlayer) {
    console.log(" Player not found:", oldPlayer.name);
    return;
  }


  console.log("Found player:", existingPlayer.name);

    await prisma.teamMember.delete({
    where: { id: existingPlayer.id },
    });

      console.log(`Removed ${oldPlayer.name} from Team ID: ${existingPlayer.teamId}`);

        await prisma.teamMember.create({
        data: {
        name: newPlayer.name,
        email: newPlayer.email,
        rollNumber: newPlayer.rollNumber,
        phone: newPlayer.phone,
        eventId: existingPlayer.eventId,
        teamId: existingPlayer.teamId,
        playerType: existingPlayer.playerType, 
        },
    });

     console.log(`Added new player ${newPlayer.name} to the same team.`);

    }

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });