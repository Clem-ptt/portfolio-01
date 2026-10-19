import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Authentication integration", () => {
    it("should reject login with missing credentials", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({});

        expect(response.status).toBe(400);
    });

    it("should reject invalid email formats", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "not-an-email",
                password: "test-password",
            });

        expect(response.status).toBe(400);
    });

    it("should reject validly formatted but incorrect credentials", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "nonexistent-test@example.com",
                password: "incorrect-test-password",
            });

        expect(response.status).toBe(401);
    });

    it("should reject unauthenticated current-user requests", async () => {
        const response = await request(app)
            .get("/api/auth/me");

        expect(response.status).toBe(401);
    });

    it("should allow logout without an active login", async () => {
        const response = await request(app)
            .post("/api/auth/logout");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});
