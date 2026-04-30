// Template Method — envio de notificações por canal
// Algoritmo fixo: validar destinatário → construir mensagem → enviar → registrar
// Construção e envio variam por canal (in-app, e-mail, push)

export interface NotificationPayload {
  userId: number;
  type: string;
  message: string;
  link?: string;
}

export interface SendResult {
  channel: string;
  success: boolean;
  sentAt: Date;
  details?: string;
}

export abstract class NotificationSender {
  // Template method
  async send(payload: NotificationPayload): Promise<SendResult> {
    this.validatePayload(payload);
    const message = this.buildMessage(payload);
    const success = await this.deliver(payload.userId, message, payload.link ?? "");
    await this.log(payload, success);
    return { channel: this.channelName(), success, sentAt: new Date(), details: message };
  }

  protected validatePayload(payload: NotificationPayload): void {
    if (!payload.userId || !payload.message) {
      throw new Error("userId e message são obrigatórios");
    }
  }

  protected abstract channelName(): string;
  protected abstract buildMessage(payload: NotificationPayload): string;
  protected abstract deliver(userId: number, message: string, link: string): Promise<boolean>;

  // Hook — subclasses podem sobrescrever para persistência/audit
  protected async log(_payload: NotificationPayload, _success: boolean): Promise<void> {}
}

// Concreto 1 — notificação in-app (persiste no banco)
export class InAppNotificationSender extends NotificationSender {
  constructor(
    private repo: {
      create(data: { userId: number; type: string; message: string; link: string }): Promise<unknown>;
    }
  ) {
    super();
  }

  protected channelName(): string {
    return "in-app";
  }

  protected buildMessage(payload: NotificationPayload): string {
    return `[${payload.type.toUpperCase()}] ${payload.message}`;
  }

  protected async deliver(userId: number, message: string, link: string): Promise<boolean> {
    await this.repo.create({ userId, type: "system", message, link });
    return true;
  }

  protected override async log(payload: NotificationPayload, success: boolean): Promise<void> {
    console.log(`[InApp] user=${payload.userId} success=${success}`);
  }
}

// Concreto 2 — notificação por e-mail (simulada; integrar com SMTP/SES)
export class EmailNotificationSender extends NotificationSender {
  constructor(private fromAddress: string = "noreply@devflow.com") {
    super();
  }

  protected channelName(): string {
    return "email";
  }

  protected buildMessage(payload: NotificationPayload): string {
    return [
      `De: ${this.fromAddress}`,
      `Assunto: DevFlow — ${payload.type}`,
      ``,
      payload.message,
      payload.link ? `\nAcesse: ${payload.link}` : "",
    ].join("\n");
  }

  protected async deliver(_userId: number, message: string, _link: string): Promise<boolean> {
    // Ponto de extensão: integrar nodemailer / AWS SES aqui
    console.log(`[Email] Enviando:\n${message}`);
    return true;
  }
}

// Concreto 3 — notificação push (simulada; integrar com FCM/APNs)
export class PushNotificationSender extends NotificationSender {
  constructor(private appId: string = "devflow-app") {
    super();
  }

  protected channelName(): string {
    return "push";
  }

  protected buildMessage(payload: NotificationPayload): string {
    const title = payload.type.replace(/_/g, " ").toUpperCase();
    const body = payload.message.length > 100 ? payload.message.slice(0, 97) + "..." : payload.message;
    return JSON.stringify({ title, body, appId: this.appId, link: payload.link });
  }

  protected async deliver(userId: number, message: string, _link: string): Promise<boolean> {
    // Ponto de extensão: chamar FCM/APNs SDK aqui
    console.log(`[Push] user=${userId} payload=${message}`);
    return true;
  }

  protected override async log(payload: NotificationPayload, success: boolean): Promise<void> {
    console.log(`[Push] Audit: user=${payload.userId} type=${payload.type} ok=${success}`);
  }
}
