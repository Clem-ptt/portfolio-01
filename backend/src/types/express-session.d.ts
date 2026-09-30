import "express-session";
import type { Role } from "../generated/prisma/client.js";

declare module "express-session" {
    interface SessionData {
        userId: number;
        role: Role;
    }
}