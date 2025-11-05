import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import routes from "./routes";
import { auth } from "./lib/auth";
import { errorHandler } from "./middleware";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());
app.use("*", prettyJSON());
app.use("*", errorHandler); // エラーハンドラーを最後に追加

// better-auth routes
app.all("/api/auth/*", async (c) => {
  return await auth.handler(c.req.raw);
});

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root route
app.get("/", (c) => {
  return c.json({ message: "Hello, Hono!" });
});

// API routes
app.route("/api", routes);

// Server
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

export default {
  port,
  fetch: app.fetch,
};

console.log(`🚀 Server is running on http://localhost:${port}`);

