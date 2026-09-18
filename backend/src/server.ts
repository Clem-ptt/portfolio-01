import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./routes/project.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello from Express!");
});

app.get("/api/health", (_, res) => {
  res.json({
    success: true,
    message: "Backend is running 🚀",
  });
});

app.use("/api/projects", projectRoutes);

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});