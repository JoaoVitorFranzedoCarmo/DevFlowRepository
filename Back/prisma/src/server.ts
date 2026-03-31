import express from "express";
import cors from "cors";
import { env } from "./config/env";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api", routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Error handler
app.use(errorMiddleware);

// Start server
app.listen(env.PORT, () => {
  console.log(`🚀 DevFlow API rodando em http://localhost:${env.PORT}`);
  console.log(`📖 Health check: http://localhost:${env.PORT}/api/health`);
});

export default app;
