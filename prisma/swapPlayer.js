import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv"
dotenv.config({path:"../.env.development"})

const prisma = new PrismaClient();


async function main() {
  const oldPlayer = {
    name: "aaryan bhandari",
    email: "aaryanbhandari28@gmail.com",
    rollNumber: "6584",
    // phone: "8076553030", 
    teamId:"cmgiclkwq0004kw093e4ngsch"
  };

  // New player details
  const newPlayer = {
    name: "Gagan Nath",
    email: "gagannath310@gmail.com",
    rollNumber: "245292060",
    phone: "8882860825",
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