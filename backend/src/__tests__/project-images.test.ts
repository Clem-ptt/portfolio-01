
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Project image endpoints", () => {
    it("should reject unauthenticated image uploads", async () => {
        const response = await request(app)
            .post("/api/uploads");

        expect(response.status).toBe(401);
    });

    it("should reject unauthenticated image deletion", async () => {
        const response = await request(app)
            .delete("/api/projects/1/images/1");

        expect(response.status).toBe(401);
    });

    it("should reject unauthenticated main image changes", async () => {
        const response = await request(app)
            .patch("/api/projects/1/images/1/main");

        expect(response.status).toBe(401);
    });

    it("should reject invalid project IDs when listing images", async () => {
        const response = await request(app)
            .get("/api/projects/invalid-id/images");

        expect(response.status).toBe(400);
    });
});
