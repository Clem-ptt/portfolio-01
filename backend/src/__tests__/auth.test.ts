import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Authentication API", () => {
    it("should reject login with missing credentials", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({});

        expect(response.status).toBe(400);
    });

    it("should reject login with an invalid email format", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "invalid-email",
                password: "some-password",
            });

        expect(response.status).toBe(400);
    });

    it("should return unauthenticated for the current session", async () => {
        const response = await request(app)
            .get("/api/auth/me");

        expect(response.status).toBe(401);
    });

    it("should allow an unauthenticated user to log out safely", async () => {
        const response = await request(app)
            .post("/api/auth/logout");

        expect([200, 204]).toContain(response.status);
    });
});
