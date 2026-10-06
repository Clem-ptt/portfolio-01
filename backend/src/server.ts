import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./routes/project.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error-handler.js";
import { sessionMiddleware } from "./config/session.js";
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();

const app = express();

app.disable("etag");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(sessionMiddleware);

app.get("/", (_, res) => {
  res.send("Hello from Express!");
});

app.get("/api/health", (_, res) => {
  res.json({
    success: true,
    message: "Backend is running 🚀",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/uploads", uploadRoutes);

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});