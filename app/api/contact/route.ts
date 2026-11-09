import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  normalizeContactValues,
  validateContact,
} from "../../lib/contact-validation";

const MAX_BODY_BYTES = 12_000;
const MAX_PROJECT_LENGTH = 2_000;

function logContactDiagnostic(
  event: string,
  details?: Record<string, string | string[] | number>,
) {
  // Deliberately log only fixed event names and non-sensitive categories.
  console.warn("[contact-api]", event, details ?? "");
}

function classifySmtpError(error: unknown): {
  event: string;
  stage: string;
  code: string;
  responseCode?: number;
  command: string;
} {
  if (!error || typeof error !== "object") {
    return {
      event: "smtp_other_error",
      stage: "smtp_exchange",
      code: "UNKNOWN",
      command: "UNKNOWN",
    };
  }

  const candidate = error as { code?: unknown; responseCode?: unknown; command?: unknown };
  const rawCode = typeof candidate.code === "string" ? candidate.code.toUpperCase() : "";
  const code = /^[A-Z0-9_]{1,32}$/.test(rawCode) ? rawCode : "UNKNOWN";
  const parsedResponseCode = Number(candidate.responseCode);
  const responseCode = Number.isInteger(parsedResponseCode) && parsedResponseCode >= 100 && parsedResponseCode <= 599
    ? parsedResponseCode
    : undefined;
  const rawCommand = typeof candidate.command === "string" ? candidate.command.toUpperCase() : "";
  const commandToken = rawCommand.split(/\s+/, 1)[0];
  const allowedCommands = ["CONNECT", "CONN", "EHLO", "HELO", "STARTTLS", "AUTH", "MAIL", "RCPT", "DATA", "QUIT"];
  const command = allowedCommands.includes(commandToken) ? commandToken : "UNKNOWN";

  if (
    code === "EAUTH" ||
    responseCode === 534 ||
    responseCode === 535 ||
    command === "AUTH"
  ) {
    return {
      event: "smtp_authentication_error",
      stage: "authentication",
      code,
      ...(responseCode ? { responseCode } : {}),
      command,
    };
  }

  if (
    ["ECONNECTION", "ETIMEDOUT", "ESOCKET", "EDNS", "ECONNREFUSED", "ECONNRESET"].includes(code)
  ) {
    return {
      event: "smtp_connection_error",
      stage: "connection",
      code,
      ...(responseCode ? { responseCode } : {}),
      command,
    };
  }

  if (command === "RCPT" || (responseCode !== undefined && responseCode >= 550 && responseCode <= 559)) {
    return {
      event: "smtp_recipient_error",
      stage: "recipient",
      code,
      ...(responseCode ? { responseCode } : {}),
      command,
    };
  }

  return {
    event: "smtp_other_error",
    stage: "smtp_exchange",
    code,
    ...(responseCode ? { responseCode } : {}),
    command,
  };
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

async function readLimitedBody(request: Request): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) {
    return "";
  }

  const decoder = new TextDecoder();
  let body = "";
  let bytesRead = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    bytesRead += value.byteLength;
    if (bytesRead > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new RangeError("Request body too large");
    }

    body += decoder.decode(value, { stream: true });
  }

  return body + decoder.decode();
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) {
    logContactDiagnostic("origin_missing");
    return jsonResponse(
      { status: "error", message: "No se pudo procesar la solicitud." },
      403,
    );
  }

  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);
    // In LAN development, Next may expose an internal request URL even though
    // the browser's same-origin Host header correctly contains the LAN host.
    const requestHost = request.headers.get("host");
    const expectedOrigin = requestHost
      ? `${requestUrl.protocol}//${requestHost}`
      : requestUrl.origin;

    if (originUrl.origin !== expectedOrigin) {
      logContactDiagnostic("origin_rejected");
      return jsonResponse(
        { status: "error", message: "No se pudo procesar la solicitud." },
        403,
      );
    }
  } catch {
    logContactDiagnostic("origin_invalid");
    return jsonResponse(
      { status: "error", message: "No se pudo procesar la solicitud." },
      403,
    );
  }

  if (request.headers.get("x-contact-request") !== "same-origin") {
    logContactDiagnostic("request_marker_rejected");
    return jsonResponse(
      { status: "error", message: "No se pudo procesar la solicitud." },
      403,
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    logContactDiagnostic("content_type_rejected");
    return jsonResponse(
      { status: "error", message: "El formato de la solicitud no es válido." },
      415,
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    logContactDiagnostic("body_too_large");
    return jsonResponse(
      { status: "error", message: "La solicitud excede el tamaño permitido." },
      413,
    );
  }

  let rawBody: string;
  try {
    rawBody = await readLimitedBody(request);
  } catch (error) {
    if (error instanceof RangeError) {
      logContactDiagnostic("body_too_large");
      return jsonResponse(
        { status: "error", message: "La solicitud excede el tamaño permitido." },
        413,
      );
    }

    logContactDiagnostic("request_body_read_error");
    return jsonResponse(
      { status: "error", message: "El formato de la solicitud no es vÃ¡lido." },
      400,
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    logContactDiagnostic("invalid_json");
    return jsonResponse(
      { status: "error", message: "El formato de la solicitud no es válido." },
      400,
    );
  }

  if (!isRecord(payload)) {
    logContactDiagnostic("invalid_payload_shape");
    return jsonResponse(
      { status: "error", message: "El formato de la solicitud no es válido." },
      400,
    );
  }

  // Honeypot field: ordinary visitors never see or fill this input.
  if (getString(payload.website).trim()) {
    logContactDiagnostic("honeypot_triggered");
    return jsonResponse(
      { status: "error", message: "No se pudo procesar la solicitud." },
      400,
    );
  }

  const values = normalizeContactValues({
    nombre: getString(payload.nombre),
    telefono: getString(payload.telefono),
    correo: getString(payload.correo),
    proyecto: getString(payload.proyecto),
  });

  if (values.proyecto.length > MAX_PROJECT_LENGTH) {
    logContactDiagnostic("invalid_project_length");
    return jsonResponse(
      {
        status: "error",
        message: "La descripción no puede superar los 2,000 caracteres.",
      },
      400,
    );
  }

  const fieldErrors = validateContact(values);
  if (Object.keys(fieldErrors).length > 0) {
    logContactDiagnostic("invalid_contact_fields", {
      fields: Object.keys(fieldErrors),
    });
    return jsonResponse(
      {
        status: "invalid",
        message: "Revisa los campos indicados e inténtalo de nuevo.",
        fieldErrors,
      },
      400,
    );
  }

  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpPort = Number(process.env.SMTP_PORT);
  const smtpUser = process.env.SMTP_USER?.trim();
  // Google displays app passwords in groups separated by spaces. SMTP auth
  // expects the password characters without that visual formatting.
  const smtpPassword = process.env.SMTP_PASSWORD?.replace(/\s/g, "");
  const recipient = process.env.CONTACT_EMAIL?.trim();

  const missingEnvironment: string[] = [];
  const invalidEnvironment: string[] = [];
  if (!smtpHost) {
    missingEnvironment.push("SMTP_HOST");
  } else if (smtpHost.toLowerCase() !== "smtp.gmail.com") {
    invalidEnvironment.push("SMTP_HOST");
  }
  if (!process.env.SMTP_PORT?.trim()) {
    missingEnvironment.push("SMTP_PORT");
  } else if (smtpPort !== 465) {
    invalidEnvironment.push("SMTP_PORT");
  }
  if (!smtpUser) {
    missingEnvironment.push("SMTP_USER");
  } else if (!isValidEmail(smtpUser)) {
    invalidEnvironment.push("SMTP_USER");
  }
  if (!process.env.SMTP_PASSWORD?.trim()) {
    missingEnvironment.push("SMTP_PASSWORD");
  } else if (!smtpPassword) {
    invalidEnvironment.push("SMTP_PASSWORD");
  }
  if (!recipient) {
    missingEnvironment.push("CONTACT_EMAIL");
  } else if (
    !isValidEmail(recipient) ||
    recipient.toLowerCase().endsWith("@example.com")
  ) {
    invalidEnvironment.push("CONTACT_EMAIL");
  }

  if (missingEnvironment.length > 0 || invalidEnvironment.length > 0) {
    if (missingEnvironment.length > 0) {
      logContactDiagnostic("environment_missing", {
        variables: missingEnvironment,
      });
    }
    if (invalidEnvironment.length > 0) {
      logContactDiagnostic("environment_invalid", {
        variables: invalidEnvironment,
      });
    }
    return jsonResponse(
      {
        status: "error",
        message:
          "El envío por correo no está disponible en este momento. Inténtalo nuevamente más tarde.",
      },
      503,
    );
  }

  const validRecipient = recipient as string;

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });

    const result = await transporter.sendMail({
      from: {
        name: "ELEVA",
        address: smtpUser,
      },
      to: validRecipient,
      ...(values.correo ? { replyTo: values.correo.trim() } : {}),
      subject: "Nueva solicitud de cotización | ELEVA",
      text: [
        "Se recibió una solicitud de cotización desde la página de ELEVA.",
        "",
        `Nombre: ${values.nombre.trim()}`,
        `Teléfono: ${values.telefono.trim()}`,
        `Correo del visitante: ${values.correo.trim() || "No proporcionado"}`,
        "",
        "Descripción del proyecto:",
        values.proyecto.trim() || "No proporcionada",
      ].join("\n"),
    });

    const recipientAccepted = result.accepted.some((address) => {
      return address.toLowerCase() === validRecipient.toLowerCase();
    });

    if (!recipientAccepted) {
      logContactDiagnostic("smtp_recipient_not_accepted", {
        stage: "recipient",
        rejected_count: result.rejected.length,
      });
      return jsonResponse(
        {
          status: "error",
          message:
            "No pudimos enviar la solicitud. Revisa los datos e inténtalo nuevamente.",
        },
        502,
      );
    }
  } catch (error) {
    const diagnostic = classifySmtpError(error);
    logContactDiagnostic(diagnostic.event, {
      stage: diagnostic.stage,
      code: diagnostic.code,
      ...(diagnostic.responseCode ? { response_code: diagnostic.responseCode } : {}),
      command: diagnostic.command,
    });
    return jsonResponse(
      {
        status: "error",
        message:
          "No pudimos enviar la solicitud. Inténtalo nuevamente en unos minutos.",
      },
      502,
    );
  }

  console.info("[contact-api] smtp_message_accepted");
  return jsonResponse({
    status: "sent",
    message:
      "El servidor de correo aceptó tu solicitud para envío. La entrega final depende del proveedor de correo.",
  });
}
