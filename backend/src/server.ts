import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => {
  res.json({
    status: "OK",
    message: "Backend is running 🚀",
  });
});

app.get("/api/hello", (_, res) => {
    res.json({
        message: "Hello from backend!"
    });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});