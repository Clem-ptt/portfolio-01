
import "dotenv/config";
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Authenticated project CRUD integration", () => {
    it("should create, retrieve, update, and delete a project", async () => {
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

        const uniqueSlug = `integration-test-${Date.now()}`;

        const createResponse = await agent
            .post("/api/projects")
            .send({
                title: "Integration Test Project",
                slug: uniqueSlug,
                description: "Created by the integration test",
            });

        expect(createResponse.status).toBe(201);
        expect(createResponse.body.success).toBe(true);

        const projectId = createResponse.body.data.id;

        expect(projectId).toBeTypeOf("number");

        try {
            const getResponse = await agent
                .get(`/api/projects/${projectId}`);

            expect(getResponse.status).toBe(200);
            expect(getResponse.body.data.slug).toBe(uniqueSlug);

            const updateResponse = await agent
                .patch(`/api/projects/${projectId}`)
                .send({
                    title: "Updated Integration Test Project",
                });

            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.data.title).toBe(
                "Updated Integration Test Project"
            );
        } finally {
            const deleteResponse = await agent
                .delete(`/api/projects/${projectId}`);

            expect(deleteResponse.status).toBe(200);
        }
    });
});
