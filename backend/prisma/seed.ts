import "dotenv/config";
import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/utils/password.js";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
    throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be configured."
    );
}

const passwordHash = await hashPassword(password);

const admin = await prisma.user.upsert({
    where: {
        email,
    },
    update: {
        passwordHash,
        role: "ADMIN",
    },
    create: {
        email,
        passwordHash,
        role: "ADMIN",
    },
});

console.log(`Admin account ready: ${admin.email}`);

await prisma.$disconnect();