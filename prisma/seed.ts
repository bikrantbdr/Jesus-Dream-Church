import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Create client using the same SQLite adapter under Prisma v7
const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing events to keep the timeline clean (cascade deletes associated media)
  await prisma.event.deleteMany({});
  console.log("Cleared old events from database.");

  // 1. Sunday Worship & Fellowship Cafe
  const e1 = await prisma.event.create({
    data: {
      title: "Sunday Worship & Fellowship Cafe",
      description: "We gathered this past Sunday to glorify God's name together in worship. Pastor Aadarsh led us in a powerful message about the grace of the Triune God. After the service, we gathered for hot tea, snacks, and deep conversations in the fellowship cafe. It was wonderful to see new families join us in Frankfurt.",
      date: new Date("2026-05-24T12:00:00Z"),
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
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
            type: "VIDEO",
          }
        ]
      }
    }
  });
  console.log("Created Event 1:", e1.title);

  // 2. Youth Bible Study & Prayer Group
  const e2 = await prisma.event.create({
    data: {
      title: "Youth Bible Study & Prayer Group",
      description: "A blessing-filled evening of studying the scriptures in our mother tongue. Our youth and young adults gathered to dive deeper into the Book of Romans, exploring how we are justified by faith through grace. We ended the evening in a focused time of prayer for our church, city, and Nepalese community worldwide.",
      date: new Date("2026-05-20T18:30:00Z"),
      media: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
            type: "IMAGE",
          },
          {
            url: "https://images.unsplash.com/photo-1544427928-142065993de8?auto=format&fit=crop&w=1200&q=80",
            type: "IMAGE",
          }
        ]
      }
    }
  });
  console.log("Created Event 2:", e2.title);

  // 3. Special Outdoor Baptism Service
  const e3 = await prisma.event.create({
    data: {
      title: "Special Outdoor Baptism Service",
      description: "Praising God for two brothers and sisters who took the step of water baptism, publicly declaring their faith in Jesus Christ! We gathered by the outdoor waters, sang songs of praise in Nepali, and rejoiced with heaven as these lives were dedicated to the service of the Lord. Truly a historic day for Jesus Dream fellowship!",
      date: new Date("2026-05-17T13:00:00Z"),
      media: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1504052434569-70ad58565b90?auto=format&fit=crop&w=1200&q=80",
            type: "IMAGE",
          },
          {
            url: "https://www.w3schools.com/html/movie.mp4",
            type: "VIDEO",
          }
        ]
      }
    }
  });
  console.log("Created Event 3:", e3.title);

  // 4. Outreach & Community Cleanup Day (Seeded with 6 items, WhatsApp image repeated to test overlays)
  const e4 = await prisma.event.create({
    data: {
      title: "Outreach & Community Cleanup Day",
      description: "Glorifying God by serving our neighbors in Frankfurt! A beautiful Saturday spent cleaning local streets and parks, distributing food packets, and sharing the love of Christ. Praise the Lord for a wonderful turn out from our fellowship! This event showcases a rich media gallery of 6 files to highlight the dynamic timeline overlays and touch-friendly Carousel slides.",
      date: new Date("2026-05-10T10:00:00Z"),
      media: {
        create: [
          {
            url: "/uploads/1779697020546-WhatsApp_Image_2026-05-24_at_17.24.15.jpeg",
            type: "IMAGE",
          },
          {
            url: "/uploads/1779697020546-WhatsApp_Image_2026-05-24_at_17.24.15.jpeg",
            type: "IMAGE",
          },
          {
            url: "/uploads/1779697020546-WhatsApp_Image_2026-05-24_at_17.24.15.jpeg",
            type: "IMAGE",
          },
          {
            url: "/uploads/1779697020546-WhatsApp_Image_2026-05-24_at_17.24.15.jpeg",
            type: "IMAGE",
          },
          {
            url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
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
  console.log("Created Event 4 (Timeline Seeding with 6 elements):", e4.title);

  // 5. Pentecost Sunday & Joint Fellowship Service (Seeded with 5 images to showcase multiple gallery files)
  const e5 = await prisma.event.create({
    data: {
      title: "Pentecost Sunday & Joint Fellowship Service",
      description: "A glorious Sunday celebrating the outpouring of the Holy Spirit! We gathered with brothers and sisters from diverse backgrounds across Frankfurt, united in worship, scripture reading, and communion. The sermon focused on the power and guidance of the Holy Spirit in our daily walk. Following the service, we enjoyed a wonderful joint Nepalese-international fellowship feast. This event showcases 5 images from our upload folder and community database.",
      date: new Date("2026-05-03T11:00:00Z"),
      media: {
        create: [
          {
            url: "/uploads/1779697020546-WhatsApp_Image_2026-05-24_at_17.24.15.jpeg",
            type: "IMAGE",
          },
          {
            url: "/uploads/1779697020546-WhatsApp_Image_2026-05-24_at_17.24.15.jpeg",
            type: "IMAGE",
          },
          {
            url: "/uploads/1779697020546-WhatsApp_Image_2026-05-24_at_17.24.15.jpeg",
            type: "IMAGE",
          },
          {
            url: "/uploads/1779697020546-WhatsApp_Image_2026-05-24_at_17.24.15.jpeg",
            type: "IMAGE",
          },
          {
            url: "/uploads/1779697020546-WhatsApp_Image_2026-05-24_at_17.24.15.jpeg",
            type: "IMAGE",
          }
        ]
      }
    }
  });
  console.log("Created Event 5 (Pentecost joint service with 5 images):", e5.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
