import session from "express-session";
import connectPgSimple from "connect-pg-simple";

if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be configured.");
}

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be configured.");
}

const PgSession = connectPgSimple(session);

export const sessionMiddleware = session({
    name: "portfolio.sid",

    store: new PgSession({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
    }),

    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24,
    },
});