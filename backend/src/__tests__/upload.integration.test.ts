
import "dotenv/config";
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Project image upload validation", () => {
    it("should reject unauthenticated upload requests", async () => {
        const response = await request(app)
            .post("/api/uploads");

        expect(response.status).toBe(401);
    });

    it("should reject uploads without an image file", async () => {
        const agent = request.agent(app);

        const loginResponse = await agent
            .post("/api/auth/login")
            .send({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            });

        expect(loginResponse.status).toBe(200);

        const response = await agent
            .post("/api/uploads")
            .field("projectId", "1");

        expect(response.status).toBe(400);
    });

    it("should reject an invalid project ID before uploading", async () => {
        const agent = request.agent(app);

        const loginResponse = await agent
            .post("/api/auth/login")
            .send({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            });

        expect(loginResponse.status).toBe(200);

        const response = await agent
            .post("/api/uploads")
            .field("projectId", "invalid-id")
            .attach("image", Buffer.from("test image"), {
                filename: "test.png",
                contentType: "image/png",
            });

        expect(response.status).toBe(400);
    });
});
