import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import connectDb from "./config/db.js";
import { auth } from "./config/auth.js";
import resultRoute from "./routes/result.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/v1/results", resultRoute);

app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on PORT ${PORT}`);
});
