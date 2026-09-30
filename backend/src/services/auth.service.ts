import { prisma } from "../lib/prisma.js";
import { comparePassword } from "../utils/password.js";

export const authenticateUser = async (
    email: string,
    password: string
) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        return null;
    }

    const passwordMatches = await comparePassword(
        password,
        user.passwordHash
    );

    if (!passwordMatches) {
        return null;
    }

    return user;
};