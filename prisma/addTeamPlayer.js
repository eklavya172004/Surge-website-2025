import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv"
dotenv.config({path:"../.env.development"})

const prisma = new PrismaClient();

async function main(){
    const teamId = "cmh8nnk690002lb09o24gmv2c";

    const newPlayers = [
    {
      name: "Sabiha khan",
      phone: "9105589550",
      rollNumber:"2024406014",
      email: "sabihakhan89329@gmail.com",
    },
    ]

      const team = await prisma.team.findUnique({
        where: { id: teamId },
    });

      if (!team) {
    console.log(" Team not found with ID:", teamId);
    return;
    }

     console.log(`Found Team: ${teamId}, Event ID: ${team.eventId}`);
  console.log(`🧩 Adding ${newPlayers.length} players...`);

      for (const player of newPlayers) {
        const existingPlayer = await prisma.teamMember.findFirst({
            where:{
                OR:[
                    {email:player.email},
                    {rollNumber:player.rollNumber},
                    {phone:player.phone},
                ],
                teamId:teamId
            }
        });
       
        
      if (existingPlayer) {
      console.log(`Player already exists: ${player.name} (${player.email})`);
      continue;
    }


        const newPlayer = await prisma.teamMember.create({
        data: {
            name: player.name,
            email: player.email,
            rollNumber: player.rollNumber? player.rollNumber : "",
            phone: player.phone,
            teamId: teamId,
            eventId: team.eventId,
        },
        });


        console.log(`Added player: ${newPlayer.name}`);
    }

    console.log("All players processed successfully!");
}

main()
  .catch((err) => {
    console.error("Error adding players:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });