import { env } from "./config/env";
import app from "./app";
import { rbacService } from "./services/rbac.service";
import "./services/notification.service";

async function bootstrap() {
  try {
    await rbacService.seedDefaults();
    console.log("✅ Permissões RBAC padrão carregadas");
  } catch (err) {
    console.error("⚠️  Falha ao carregar RBAC defaults:", err);
  }

  app.listen(env.PORT, () => {
    console.log(`🚀 DevFlow API rodando em http://localhost:${env.PORT}`);
    console.log(`📖 Health check: http://localhost:${env.PORT}/api/health`);
  });
}

bootstrap();

export default app;
