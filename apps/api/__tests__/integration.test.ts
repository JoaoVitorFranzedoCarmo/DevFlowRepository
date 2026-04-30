import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/database";
import {
  ownerToken,
  otherToken,
  gerenteToken,
  OWNER_ID,
  OTHER_ID,
} from "./helpers/auth";

const db = prisma as jest.Mocked<typeof prisma>;

const INTEGRATION_ID = "dddddddd-0000-0000-0000-000000000004";

const fakeIntegration = {
  id: INTEGRATION_ID,
  name: "GitHub",
  desc: "Repositório de código",
  status: "conectado",
  icon: "github",
  userId: OWNER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// GET /api/integrations
// ---------------------------------------------------------------------------
describe("GET /api/integrations", () => {
  it("200 – retorna lista do usuário autenticado", async () => {
    db.integration.findMany.mockResolvedValue([fakeIntegration]);

    const res = await request(app)
      .get("/api/integrations")
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("401 – sem token", async () => {
    const res = await request(app).get("/api/integrations");
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /api/integrations/:id
// ---------------------------------------------------------------------------
describe("GET /api/integrations/:id", () => {
  it("200 – dono obtém a integração", async () => {
    db.integration.findUnique.mockResolvedValue(fakeIntegration);

    const res = await request(app)
      .get(`/api/integrations/${INTEGRATION_ID}`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(INTEGRATION_ID);
  });

  it("403 – outro usuário não pode visualizar integração alheia", async () => {
    db.integration.findUnique.mockResolvedValue(fakeIntegration);

    const res = await request(app)
      .get(`/api/integrations/${INTEGRATION_ID}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });

  it("200 – GERENTE pode visualizar qualquer integração", async () => {
    db.integration.findUnique.mockResolvedValue(fakeIntegration);

    const res = await request(app)
      .get(`/api/integrations/${INTEGRATION_ID}`)
      .set("Authorization", `Bearer ${gerenteToken}`);

    expect(res.status).toBe(200);
  });

  it("404 – integração inexistente", async () => {
    db.integration.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .get(`/api/integrations/nao-existe`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// POST /api/integrations
// ---------------------------------------------------------------------------
describe("POST /api/integrations", () => {
  it("201 – cria integração com dados válidos", async () => {
    db.integration.create.mockResolvedValue({ ...fakeIntegration, id: "new-id" });

    const res = await request(app)
      .post("/api/integrations")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "GitHub", desc: "Repositório", status: "desconectado", icon: "github" });

    expect(res.status).toBe(201);
  });

  it("400 – payload inválido (name ausente)", async () => {
    const res = await request(app)
      .post("/api/integrations")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ desc: "Sem nome" });

    expect(res.status).toBe(400);
  });

  it("401 – sem autenticação", async () => {
    const res = await request(app)
      .post("/api/integrations")
      .send({ name: "GitHub", desc: "Repo" });

    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/integrations/:id
// ---------------------------------------------------------------------------
describe("PUT /api/integrations/:id", () => {
  it("200 – dono atualiza sua integração", async () => {
    db.integration.findUnique.mockResolvedValue(fakeIntegration);
    db.integration.update.mockResolvedValue({ ...fakeIntegration, desc: "Atualizado" });

    const res = await request(app)
      .put(`/api/integrations/${INTEGRATION_ID}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ desc: "Atualizado" });

    expect(res.status).toBe(200);
  });

  it("403 – não-dono não pode atualizar", async () => {
    db.integration.findUnique.mockResolvedValue(fakeIntegration);

    const res = await request(app)
      .put(`/api/integrations/${INTEGRATION_ID}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ desc: "Tentativa" });

    expect(res.status).toBe(403);
  });

  it("200 – GERENTE pode atualizar integração alheia", async () => {
    db.integration.findUnique.mockResolvedValue(fakeIntegration);
    db.integration.update.mockResolvedValue({ ...fakeIntegration, desc: "Pelo gerente" });

    const res = await request(app)
      .put(`/api/integrations/${INTEGRATION_ID}`)
      .set("Authorization", `Bearer ${gerenteToken}`)
      .send({ desc: "Pelo gerente" });

    expect(res.status).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/integrations/:id/toggle
// ---------------------------------------------------------------------------
describe("PATCH /api/integrations/:id/toggle", () => {
  it("200 – dono alterna status", async () => {
    db.integration.findUnique.mockResolvedValue(fakeIntegration);
    db.integration.update.mockResolvedValue({ ...fakeIntegration, status: "desconectado" });

    const res = await request(app)
      .patch(`/api/integrations/${INTEGRATION_ID}/toggle`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
  });

  it("403 – não-dono não pode alternar", async () => {
    db.integration.findUnique.mockResolvedValue(fakeIntegration);

    const res = await request(app)
      .patch(`/api/integrations/${INTEGRATION_ID}/toggle`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/integrations/:id
// ---------------------------------------------------------------------------
describe("DELETE /api/integrations/:id", () => {
  it("204 – dono remove a integração", async () => {
    db.integration.findUnique.mockResolvedValue(fakeIntegration);
    db.integration.delete.mockResolvedValue(fakeIntegration);

    const res = await request(app)
      .delete(`/api/integrations/${INTEGRATION_ID}`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(204);
  });

  it("403 – não-dono não pode remover", async () => {
    db.integration.findUnique.mockResolvedValue(fakeIntegration);

    const res = await request(app)
      .delete(`/api/integrations/${INTEGRATION_ID}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });
});
