import jwt from "jsonwebtoken";

// Deve coincidir com o padrão de src/config/env.ts
const JWT_SECRET = process.env.JWT_SECRET || "devflow-secret-change-me";

export function makeToken(payload: { userId: string; role: string; name?: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export const OWNER_ID = "aaaaaaaa-0000-0000-0000-000000000001";
export const OTHER_ID = "bbbbbbbb-0000-0000-0000-000000000002";
export const GERENTE_ID = "cccccccc-0000-0000-0000-000000000003";

export const ownerToken = makeToken({ userId: OWNER_ID, role: "DESENVOLVEDOR", name: "Dono" });
export const otherToken = makeToken({ userId: OTHER_ID, role: "DESENVOLVEDOR", name: "Outro" });
export const gerenteToken = makeToken({ userId: GERENTE_ID, role: "GERENTE", name: "Gerente" });
