import "dotenv/config";
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Authenticated technology CRUD integration", () => {
    it("should create, retrieve, update, and delete a technology", async () => {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        expect(adminEmail).toBeTruthy();
        expect(adminPassword).toBeTruthy();

        const agent = request.agent(app);

        const loginResponse = await agent
            .post("/api/auth/login")
            .send({
                email: adminEmail,
                password: adminPassword,
            });

        expect(loginResponse.status).toBe(200);

        const uniqueName = `Integration Test Technology ${Date.now()}`;

        const createResponse = await agent
            .post("/api/technologies")
            .send({
                name: uniqueName,
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
                category: "FRONTEND",
            });

        expect(createResponse.status).toBe(201);
        expect(createResponse.body.success).toBe(true);

        const technologyId = createResponse.body.data.id;

        expect(technologyId).toBeTypeOf("number");

        try {
            const getResponse = await agent
                .get(`/api/technologies/${technologyId}`);

            expect(getResponse.status).toBe(200);
            expect(getResponse.body.data.name).toBe(uniqueName);
            expect(getResponse.body.data.category).toBe("FRONTEND");

            const updateResponse = await agent
                .patch(`/api/technologies/${technologyId}`)
                .send({
                    name: `Updated ${uniqueName}`,
                    category: "BACKEND",
                });

            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.data.name).toBe(
                `Updated ${uniqueName}`
            );
            expect(updateResponse.body.data.category).toBe("BACKEND");
        } finally {
            const deleteResponse = await agent
                .delete(`/api/technologies/${technologyId}`);

            expect(deleteResponse.status).toBe(200);
        }
    });
});