import { env } from "./config/env";
import app from "./app";

app.listen(env.PORT, () => {
  console.log(`🚀 DevFlow API rodando em http://localhost:${env.PORT}`);
  console.log(`📖 Health check: http://localhost:${env.PORT}/api/health`);
});

export default app;
