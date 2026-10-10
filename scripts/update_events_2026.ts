import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });
dotenv.config();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SURGE_START_DATE = new Date("2026-10-30T12:00:00.000Z").toISOString();
const SURGE_END_DATE = new Date("2026-11-01T12:00:00.000Z").toISOString();

// Clean, properly capitalized event titles mapped by slug
const eventTitlesBySlug: Record<string, string> = {
  "badminton-men": "Badminton Men",
  "badminton-women": "Badminton Women",
  "basketball-men": "Basketball Men",
  "basketball-women": "Basketball Women",
  "chess": "Chess",
  "cricket-men": "Cricket Men",
  "cricket-women": "Cricket Women",
  "football": "Football",
  "futsal": "Futsal",
  "powerlifting-men-u66": "Powerlifting Men U66",
  "powerlifting-men-u74": "Powerlifting Men U74",
  "powerlifting-men-u83": "Powerlifting Men U83",
  "powerlifting-men-83-plus": "Powerlifting Men 83+",
  "powerlifting-women": "Powerlifting Women",
  "squash-men": "Squash Men",
  "squash-women": "Squash Women",
  "tt-men": "TT Men",
  "tt-women": "TT Women",
  "tennis-men": "Tennis Men",
  "tennis-women": "Tennis Women",
  "vollyball-men": "Volleyball Men",
  "vollyball-women": "Volleyball Women",
  "pool": "Pool",
  "yoga-men": "Yoga Men",
  "yoga-women": "Yoga Women",
  "100m-men": "100m Men",
  "200m-men": "200m Men",
  "400m-men": "400m Men",
  "800m-men": "800m Men",
  "1500m-men": "1500m Men",
  "5000m-men": "5000m Men",
  "4x100m-men": "4x100m Men",
  "4x400m-men": "4x400m Men",
  "shot-put-men": "Shot Put Men",
  "discus-throw-men": "Discus Throw Men",
  "long-jump-men": "Long Jump Men",
  "100m-women": "100m Women",
  "200m-women": "200m Women",
  "400m-women": "400m Women",
  "800m-women": "800m Women",
  "1500m-women": "1500m Women",
  "4x100m-women": "4x100m Women",
  "4x400m-women": "4x400m Women",
  "shot-put-women": "Shot Put Women",
  "discus-throw-women": "Discus Throw Women",
  "long-jump-women": "Long Jump Women",
  "4x100m-mixed": "4x100m Mixed",
  "4x400m-mixed": "4x400m Mixed",
};

async function main() {
  console.log("Updating events with capitalized names and Surge 2026 dates (30 Oct - 1 Nov 2026)...");

  let updatedCount = 0;
  for (const [slug, title] of Object.entries(eventTitlesBySlug)) {
    const updated = await prisma.event.updateMany({
      where: { slug },
      data: {
        name: title,
        dateFrom: SURGE_START_DATE,
        dateTo: SURGE_END_DATE,
      },
    });

    if (updated.count > 0) {
      updatedCount += updated.count;
      console.log(`✓ ${slug} -> "${title}" (${SURGE_START_DATE} to ${SURGE_END_DATE})`);
    } else {
      console.warn(`⚠️ Slug not found: ${slug}`);
    }
  }

  console.log(`\nSuccessfully updated ${updatedCount} events in the database.`);
}

main()
  .catch((err) => {
    console.error("Failed to update events:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
