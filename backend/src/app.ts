import express from "express";
import cors from "cors";
import projectRoutes from "./routes/project.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import technologyRoutes from "./routes/technology.routes.js";
import { errorHandler } from "./middleware/error-handler.js";
import { sessionMiddleware } from "./config/session.js";

const app = express();

app.set("trust proxy", 1);

app.disable("etag");

const frontendOrigin =
    process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
    cors({
        origin: frontendOrigin,
        credentials: true,
    })
);

app.use(express.json({ limit: "1mb" }));
app.use(sessionMiddleware);

// Validate origins for state-changing requests.
app.use((req, res, next) => {
    const stateChangingMethods = ["POST", "PUT", "PATCH", "DELETE"];

    if (!stateChangingMethods.includes(req.method)) {
        next();
        return;
    }

    if (process.env.NODE_ENV === "test") {
        next();
        return;
    }

    const origin = req.get("origin");

    if (origin !== frontendOrigin) {
        res.status(403).json({
            success: false,
            message: "Invalid request origin",
        });
        return;
    }

    next();
});

app.get("/", (_req, res) => {
    res.send("Hello from Express!");
});

app.get("/api/health", (_req, res) => {
    res.json({
        success: true,
        message: "Backend is running.",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/technologies", technologyRoutes);
app.use(errorHandler);

export default app;