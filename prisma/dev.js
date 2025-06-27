// server.js or index.js

import prisma from "./prisma/prisma.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log("\n🧹 Shutting down gracefully...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("🔌 Server closed");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
