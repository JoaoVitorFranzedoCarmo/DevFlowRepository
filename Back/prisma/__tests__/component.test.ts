import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/database";
import {
  ownerToken,
  otherToken,
  gerenteToken,
  OWNER_ID,
} from "./helpers/auth";

const db = prisma as jest.Mocked<typeof prisma>;

const COMPONENT_ID = "eeeeeeee-0000-0000-0000-000000000005";

const fakeAuthor = { id: OWNER_ID, name: "Dono", avatar: null };

const fakeComponent = {
  id: COMPONENT_ID,
  name: "Botão Primário",
  desc: "Componente de botão",
  category: "UI",
  lang: "React",
  tags: ["button", "ui"],
  uses: 0,
  rating: 0,
  authorId: OWNER_ID,
  author: fakeAuthor,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// GET /api/components
// ---------------------------------------------------------------------------
describe("GET /api/components", () => {
  it("200 – lista componentes", async () => {
    db.component.findMany.mockResolvedValue([fakeComponent]);

    const res = await request(app)
      .get("/api/components")
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("401 – sem token", async () => {
    const res = await request(app).get("/api/components");
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /api/components/:id
// ---------------------------------------------------------------------------
describe("GET /api/components/:id", () => {
  it("200 – retorna componente por id", async () => {
    db.component.findUnique.mockResolvedValue(fakeComponent);

    const res = await request(app)
      .get(`/api/components/${COMPONENT_ID}`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(COMPONENT_ID);
  });

  it("404 – componente inexistente", async () => {
    db.component.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .get(`/api/components/nao-existe`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// POST /api/components
// ---------------------------------------------------------------------------
describe("POST /api/components", () => {
  it("201 – cria componente com dados válidos", async () => {
    db.component.create.mockResolvedValue({ ...fakeComponent, id: "new-id" });

    const res = await request(app)
      .post("/api/components")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        name: "Botão Primário",
        desc: "Componente de botão",
        category: "UI",
        lang: "React",
        tags: ["button"],
      });

    expect(res.status).toBe(201);
  });

  it("400 – payload inválido (name ausente)", async () => {
    const res = await request(app)
      .post("/api/components")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ desc: "Sem nome", category: "UI", lang: "React" });

    expect(res.status).toBe(400);
  });

  it("401 – sem autenticação", async () => {
    const res = await request(app)
      .post("/api/components")
      .send({ name: "X", desc: "Y", category: "UI", lang: "React" });

    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/components/:id
// ---------------------------------------------------------------------------
describe("PUT /api/components/:id", () => {
  it("200 – dono atualiza seu componente", async () => {
    db.component.findUnique.mockResolvedValue(fakeComponent);
    db.component.update.mockResolvedValue({ ...fakeComponent, desc: "Atualizado" });

    const res = await request(app)
      .put(`/api/components/${COMPONENT_ID}`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ desc: "Atualizado" });

    expect(res.status).toBe(200);
  });

  it("403 – não-dono não pode atualizar componente alheio", async () => {
    db.component.findUnique.mockResolvedValue(fakeComponent);

    const res = await request(app)
      .put(`/api/components/${COMPONENT_ID}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ desc: "Tentativa" });

    expect(res.status).toBe(403);
  });

  it("200 – GERENTE pode atualizar componente alheio", async () => {
    db.component.findUnique.mockResolvedValue(fakeComponent);
    db.component.update.mockResolvedValue({ ...fakeComponent, desc: "Pelo gerente" });

    const res = await request(app)
      .put(`/api/components/${COMPONENT_ID}`)
      .set("Authorization", `Bearer ${gerenteToken}`)
      .send({ desc: "Pelo gerente" });

    expect(res.status).toBe(200);
  });

  it("404 – componente inexistente", async () => {
    db.component.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .put(`/api/components/nao-existe`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ desc: "X" });

    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/components/:id
// ---------------------------------------------------------------------------
describe("DELETE /api/components/:id", () => {
  it("204 – dono remove componente", async () => {
    db.component.findUnique.mockResolvedValue(fakeComponent);
    db.component.delete.mockResolvedValue(fakeComponent);

    const res = await request(app)
      .delete(`/api/components/${COMPONENT_ID}`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(204);
  });

  it("403 – não-dono não pode remover componente alheio", async () => {
    db.component.findUnique.mockResolvedValue(fakeComponent);

    const res = await request(app)
      .delete(`/api/components/${COMPONENT_ID}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });

  it("404 – componente inexistente", async () => {
    db.component.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .delete(`/api/components/nao-existe`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(404);
  });
});
