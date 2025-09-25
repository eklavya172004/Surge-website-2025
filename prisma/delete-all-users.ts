import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function deleteAllUsers() {
  console.log("Starting deletion of all users and related data...");
  
  try {
    // First, we need to handle the foreign key relationships properly
    // Delete all TeamMembers first (they reference Teams)
    await db.teamMember.deleteMany({});
    console.log("Deleted all team members");
    
    // Delete all Teams (they reference Users and Events)
    await db.team.deleteMany({});
    console.log("Deleted all teams");
    
    // Delete all VerificationTokens (they reference Users)
    await db.verificationToken.deleteMany({});
    console.log("Deleted all verification tokens");
    
    // Delete other related data that might reference users
    await db.accommodationDetails.deleteMany({});
    console.log("Deleted all accommodation details");
    
    await db.accommodationPayment.deleteMany({});
    console.log("Deleted all accommodation payments");
    
    await db.paymentDetails.deleteMany({});
    console.log("Deleted all payment details");
    
    // Finally, delete all Users
    const result = await db.user.deleteMany({});
    console.log(`Deleted ${result.count} users`);
    
    console.log("All users and related data have been deleted successfully.");
  } catch (error) {
    console.error("Error deleting all users:", error);
  } finally {
    await db.$disconnect();
    console.log("Database connection closed.");
  }
}

// Check if the script is being run directly
async function runIfMain() {
  // For this environment, run directly
  await deleteAllUsers();
}

// Execute the function
runIfMain().catch(console.error);