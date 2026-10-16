
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Project CRUD", () => {
    it("should return 404 for a project that does not exist", async () => {
        const response = await request(app)
            .get("/api/projects/2147483647");

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    it("should return 404 for a project slug that does not exist", async () => {
        const response = await request(app)
            .get("/api/projects/slug/nonexistent-test-project");

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    it("should reject unauthenticated project creation", async () => {
        const response = await request(app)
            .post("/api/projects")
            .send({
                title: "Integration Test Project",
                slug: "integration-test-project",
                description: "Project created for testing",
            });

        expect(response.status).toBe(401);
    });

    it("should reject unauthenticated project updates", async () => {
        const response = await request(app)
            .patch("/api/projects/2147483647")
            .send({ title: "Updated title" });

        expect(response.status).toBe(401);
    });

    it("should reject unauthenticated project deletion", async () => {
        const response = await request(app)
            .delete("/api/projects/2147483647");

        expect(response.status).toBe(401);
    });
});
