// --- Imports ---
import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { getenv } from "./helpers/helpers.js";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg"; // ONLY for session store
import router from "./routes/routes.js";

// --- Prisma Import ---
import { prisma } from "./db/prismaClient.js";

// --- Env Setup ---
getenv();

// --- Express Init ---
const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// --- CORS ---
app.use(cors());

// --- Session Store Setup ---
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const PgSession = connectPgSimple(session);

const appsession = session({
  store: new PgSession({
    pool: pgPool,
    tableName: "user_sessions",
    createTableIfMissing: true,
  }),
  secret: process.env.COOKIE_SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  name: process.env.COOKIE_SESSION_NAME,
  cookie: {
    secure: false, // set to true with HTTPS
    httpOnly: true,
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    sameSite: "lax",
  },
});

app.use(appsession);

// --- Middleware ---
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

// --- Logging ---
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "./db/access.log"),
//   { flags: "a" }
// );

// app.use(morgan("combined", { stream: accessLogStream }));

// morgan.token("sessionid", (req) => req.sessionID || "------");
// morgan.token("user", (req) =>
//   req.session?.authUserId ? req.session.authUserId : "-----"
// );
// app.use(
//   morgan(
//     ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :user :sessionid'
//   )
// );

// --- Routes ---
app.use(router);

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ msg: "Unable to find the requested resource!" });
});

// --- Graceful Shutdown (Optional) ---
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
