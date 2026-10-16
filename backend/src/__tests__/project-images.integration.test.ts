import "dotenv/config";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../app.js";
import { prisma } from "../lib/prisma.js";

vi.mock("../services/upload.service.js", async (importOriginal) => {
    const actual =
        await importOriginal<typeof import("../services/upload.service.js")>();

    return {
        ...actual,
        deleteUploadedImage: vi.fn().mockResolvedValue(undefined),
    };
});

describe("Project image management integration", () => {
    it("should list, select, replace, and clear the main project image", async () => {
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

        const slug = `image-test-${Date.now()}`;
        let projectId: number | undefined;

        try {
            const createResponse = await agent
                .post("/api/projects")
                .send({
                    title: "Image Integration Test",
                    slug,
                    description: "Temporary project for image tests",
                });

            expect(createResponse.status).toBe(201);

            projectId = createResponse.body.data.id;
            expect(projectId).toBeTypeOf("number");

            const firstImage = await prisma.projectImage.create({
                data: {
                    projectId: projectId!,
                    url: "https://example.com/test-image-1.webp",
                    publicId: `test-image-1-${Date.now()}`,
                },
            });

            const secondImage = await prisma.projectImage.create({
                data: {
                    projectId: projectId!,
                    url: "https://example.com/test-image-2.webp",
                    publicId: `test-image-2-${Date.now()}`,
                },
            });

            const listResponse = await agent
                .get(`/api/projects/${projectId}/images`);

            expect(listResponse.status).toBe(200);
            expect(listResponse.body.data).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: firstImage.id,
                        url: firstImage.url,
                    }),
                    expect.objectContaining({
                        id: secondImage.id,
                        url: secondImage.url,
                    }),
                ])
            );

            const mainImageResponse = await agent.patch(
                `/api/projects/${projectId}/images/${firstImage.id}/main`
            );

            expect(mainImageResponse.status).toBe(200);
            expect(mainImageResponse.body.data.imageUrl).toBe(firstImage.url);

            const deleteFirstResponse = await agent.delete(
                `/api/projects/${projectId}/images/${firstImage.id}`
            );

            expect(deleteFirstResponse.status).toBe(200);

            let project = await prisma.project.findUnique({
                where: { id: projectId! },
            });

            expect(project?.imageUrl).toBe(secondImage.url);

            const deleteSecondResponse = await agent.delete(
                `/api/projects/${projectId}/images/${secondImage.id}`
            );

            expect(deleteSecondResponse.status).toBe(200);

            project = await prisma.project.findUnique({
                where: { id: projectId! },
            });

            expect(project?.imageUrl).toBeNull();

            const remainingImages = await prisma.projectImage.findMany({
                where: { projectId: projectId! },
            });

            expect(remainingImages).toHaveLength(0);
        } finally {
            if (projectId !== undefined) {
                await prisma.project.deleteMany({
                    where: { id: projectId },
                });
            }
        }
    }, 15000);

    it("should return 404 when selecting an image that does not belong to the project", async () => {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        expect(adminEmail).toBeTruthy();
        expect(adminPassword).toBeTruthy();

        const agent = request.agent(app);

        const loginResponse = await agent.post("/api/auth/login").send({
            email: adminEmail,
            password: adminPassword,
        });

        expect(loginResponse.status).toBe(200);

        const slug = `invalid-main-image-${Date.now()}`;
        let projectId: number | undefined;

        try {
            const createResponse = await agent.post("/api/projects").send({
                title: "Invalid Main Image Test",
                slug,
                description: "Temporary project for image ownership tests",
            });

            expect(createResponse.status).toBe(201);

            projectId = createResponse.body.data.id;

            const response = await agent.patch(
                `/api/projects/${projectId}/images/999999/main`
            );

            expect(response.status).toBe(404);
        } finally {
            if (projectId !== undefined) {
                await prisma.project.deleteMany({
                    where: { id: projectId },
                });
            }
        }
    }, 15000);
});
