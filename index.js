import http from "http";
import app from "./app.js";

const server = http.createServer(app);

const PORT = process.env.SERVER_PORT || 7242;

const start = async () => {
  try {
    // Connect & Share Prisma Session
    server.listen(PORT, () => {
      console.log(
        `Server is running in ${process.env.NODE_ENV} mode on Port ${PORT} (^_^)`
      );
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

start();
