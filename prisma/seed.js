const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

// Instantiate Prisma with the SQLite driver adapter required under Prisma v7
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing events to keep the timeline clean
  await prisma.event.deleteMany({});
  console.log("Cleared old events from database.");

  // 1. Event 1: Sunday Celebration & Worship Service (3 pictures, 1 video)
  const e1 = await prisma.event.create({
    data: {
      title: "Sunday Celebration & Worship Service",
      description: "A beautiful Sunday worship service glorifying God's name together in Frankfurt. Pastor led a deep scripture reading on justification by faith in the Triune God. It was wonderful to see many new families and guests join us for this special service! This event is configured with exactly 3 pictures and 1 video to test the media slider layout.",
      date: new Date("2026-05-24T10:00:00Z"),
      media: {
        create: [
          {
            url: "/uploads/1779697020546-WhatsApp_Image_2026-05-24_at_17.24.15.jpeg",
            type: "IMAGE",
          },
          {
            url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
            type: "IMAGE",
          },
          {
            url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
            type: "IMAGE",
          },
          {
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
            type: "VIDEO",
          }
        ]
      }
    }
  });
  console.log("Created Event 1:", e1.title);

  // 2. Event 2: Youth Fellowship & Bible Study Group (2 pictures, 2 videos)
  const e2 = await prisma.event.create({
    data: {
      title: "Youth Fellowship & Bible Study Group",
      description: "Our young adults gathered for a blessing-filled evening of scripture study and prayer. We discussed the Book of Romans, exploring how we are called to be salt and light in our community. We ended with a time of focused prayer followed by Nepalese snacks in the fellowship hall. This event is configured with exactly 2 pictures and 2 videos to test for overlap.",
      date: new Date("2026-05-20T18:30:00Z"),
      media: {
        create: [
          {
            url: "/uploads/1779697020546-WhatsApp_Image_2026-05-24_at_17.24.15.jpeg",
            type: "IMAGE",
          },
          {
            url: "https://images.unsplash.com/photo-1544427928-142065993de8?auto=format&fit=crop&w=1200&q=80",
            type: "IMAGE",
          },
          {
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
            type: "VIDEO",
          },
          {
            url: "https://www.w3schools.com/html/movie.mp4",
            type: "VIDEO",
          }
        ]
      }
    }
  });
  console.log("Created Event 2:", e2.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
