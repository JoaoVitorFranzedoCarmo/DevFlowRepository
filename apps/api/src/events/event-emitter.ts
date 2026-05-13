import { EventEmitter } from "events";

// Singleton — um único barramento de eventos para toda a aplicação.
// Se cada módulo criasse seu próprio EventEmitter, os listeners registrados em um
// não receberiam eventos emitidos em outro. globalThis garante a mesma instância
// mesmo após hot reload do ts-node-dev (que recarrega módulos sem reiniciar o processo).
const globalForEmitter = globalThis as unknown as { appEmitter: EventEmitter };

const appEmitter = globalForEmitter.appEmitter || new EventEmitter();

if (process.env.NODE_ENV !== "production") {
  globalForEmitter.appEmitter = appEmitter;
}

export default appEmitter;
