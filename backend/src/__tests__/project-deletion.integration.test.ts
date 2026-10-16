import "dotenv/config";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../app.js";
import { prisma } from "../lib/prisma.js";
import { deleteUploadedImage } from "../services/upload.service.js";

vi.mock("../services/upload.service.js", async (importOriginal) => {
    const actual =
        await importOriginal<typeof import("../services/upload.service.js")>();

    return {
        ...actual,
        deleteUploadedImage: vi.fn().mockResolvedValue(undefined),
    };
});

describe("Project deletion integration", () => {
    it("should delete a project and clean up its associated images", async () => {
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

        const slug = `deletion-test-${Date.now()}`;
        let projectId: number | undefined;

        try {
            const createResponse = await agent.post("/api/projects").send({
                title: "Deletion Integration Test",
                slug,
                description: "Temporary project for deletion tests",
            });

            expect(createResponse.status).toBe(201);

            projectId = createResponse.body.data.id;
            expect(projectId).toBeTypeOf("number");

            const imageOne = await prisma.projectImage.create({
                data: {
                    projectId: projectId!,
                    url: "https://example.com/deletion-test-1.webp",
                    publicId: `deletion-test-1-${Date.now()}`,
                },
            });

            const imageTwo = await prisma.projectImage.create({
                data: {
                    projectId: projectId!,
                    url: "https://example.com/deletion-test-2.webp",
                    publicId: `deletion-test-2-${Date.now()}`,
                },
            });

            const deleteResponse = await agent.delete(
                `/api/projects/${projectId}`
            );

            expect(deleteResponse.status).toBe(200);

            expect(deleteUploadedImage).toHaveBeenCalledWith(
                imageOne.publicId
            );
            expect(deleteUploadedImage).toHaveBeenCalledWith(
                imageTwo.publicId
            );

            const deletedProject = await prisma.project.findUnique({
                where: { id: projectId! },
            });

            expect(deletedProject).toBeNull();

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

    it("should preserve the project when Cloudinary image deletion fails", async () => {
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

        const slug = `deletion-failure-test-${Date.now()}`;
        let projectId: number | undefined;

        try {
            const createResponse = await agent.post("/api/projects").send({
                title: "Deletion Failure Test",
                slug,
                description: "Temporary project for deletion failure tests",
            });

            expect(createResponse.status).toBe(201);

            projectId = createResponse.body.data.id;

            const image = await prisma.projectImage.create({
                data: {
                    projectId: projectId!,
                    url: "https://example.com/deletion-failure-test.webp",
                    publicId: `deletion-failure-test-${Date.now()}`,
                },
            });

            vi.mocked(deleteUploadedImage).mockRejectedValueOnce(
                new Error("Cloudinary deletion failed")
            );

            const deleteResponse = await agent.delete(
                `/api/projects/${projectId}`
            );

            expect(deleteResponse.status).toBe(500);

            const project = await prisma.project.findUnique({
                where: { id: projectId! },
            });

            expect(project).not.toBeNull();

            const remainingImage = await prisma.projectImage.findUnique({
                where: { id: image.id },
            });

            expect(remainingImage).not.toBeNull();
        } finally {
            vi.mocked(deleteUploadedImage).mockReset();
            vi.mocked(deleteUploadedImage).mockResolvedValue(undefined);

            if (projectId !== undefined) {
                await prisma.project.deleteMany({
                    where: { id: projectId },
                });
            }
        }
    }, 15000);
});