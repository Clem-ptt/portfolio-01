import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Project API validation", () => {
    it("should reject an invalid project ID", async () => {
        const response = await request(app)
            .get("/api/projects/invalid-id");

        expect(response.status).toBe(400);
    });

    it("should reject an invalid project slug", async () => {
        const response = await request(app)
            .get("/api/projects/slug/Invalid%20Slug!");

        expect(response.status).toBe(400);
    });

    it("should reject an invalid project ID when retrieving images", async () => {
        const response = await request(app)
            .get("/api/projects/invalid-id/images");

        expect(response.status).toBe(400);
    });
});

describe("Project authentication and authorization", () => {
    it.each([
        {
            method: "post",
            path: "/api/projects",
            description: "create a project",
        },
        {
            method: "patch",
            path: "/api/projects/1",
            description: "update a project",
        },
        {
            method: "delete",
            path: "/api/projects/1",
            description: "delete a project",
        },
        {
            method: "post",
            path: "/api/uploads",
            description: "upload an image",
        },
        {
            method: "delete",
            path: "/api/projects/1/images/1",
            description: "delete a project image",
        },
        {
            method: "patch",
            path: "/api/projects/1/images/1/main",
            description: "set a project's main image",
        },
    ])(
        "should reject unauthenticated requests to $description",
        async ({ method, path }) => {
            const response = await request(app)[
                method as "post" | "patch" | "delete"
            ](path);

            expect(response.status).toBe(401);
        }
    );
});


describe("Public project endpoints", () => {
    it("should allow visitors to retrieve all projects", async () => {
        const response = await request(app)
            .get("/api/projects");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should allow visitors to retrieve featured projects", async () => {
        const response = await request(app)
            .get("/api/projects/featured");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
});

