import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Technology CRUD", () => {
    it("should return 404 for a technology that does not exist", async () => {
        const response = await request(app)
            .get("/api/technologies/2147483647");

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    it("should reject unauthenticated technology creation", async () => {
        const response = await request(app)
            .post("/api/technologies")
            .send({
                name: "Integration Test Technology",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
                category: "FRONTEND",
            });

        expect(response.status).toBe(401);
    });

    it("should reject unauthenticated technology updates", async () => {
        const response = await request(app)
            .patch("/api/technologies/2147483647")
            .send({
                name: "Updated Technology",
            });

        expect(response.status).toBe(401);
    });

    it("should reject unauthenticated technology deletion", async () => {
        const response = await request(app)
            .delete("/api/technologies/2147483647");

        expect(response.status).toBe(401);
    });
});