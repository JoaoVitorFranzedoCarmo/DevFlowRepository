import { EventEmitter } from "events";

// Singleton: globalThis preserva a instância durante hot reload (ts-node-dev)
const globalForEmitter = globalThis as unknown as { appEmitter: EventEmitter };

const appEmitter = globalForEmitter.appEmitter || new EventEmitter();

if (process.env.NODE_ENV !== "production") {
  globalForEmitter.appEmitter = appEmitter;
}

export default appEmitter;
