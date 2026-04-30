import { SystemConfigRepository, systemConfigRepository } from "../repositories/system-config.repository";

const DEFAULTS: Record<string, string> = {
  HOURLY_RATE: "50",
  THEME_DEFAULT: "light",
};

export class SystemConfigService {
  constructor(private repo: SystemConfigRepository = systemConfigRepository) {}

  async get(key: string) {
    const v = await this.repo.get(key);
    if (v !== null) return v;
    return DEFAULTS[key] ?? null;
  }

  async getAll() {
    const existing = await this.repo.getAll();
    const map: Record<string, string> = { ...DEFAULTS };
    for (const entry of existing) map[entry.key] = entry.value;
    return Object.entries(map).map(([key, value]) => ({ key, value }));
  }

  async set(key: string, value: string) {
    return this.repo.set(key, value);
  }
}

export const systemConfigService = new SystemConfigService();
