export type ContactField = "nombre" | "telefono" | "correo";

export type ContactValues = {
  nombre: string;
  telefono: string;
  correo: string;
  proyecto: string;
};

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F-\u009F]/g;

function normalizeSingleLine(value: string): string {
  return value
    .replace(CONTROL_CHARACTERS, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeProject(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, " ")
    .replace(/[^\S\n]+/g, " ")
    .trim();
}

export function normalizeContactValues(values: ContactValues): ContactValues {
  return {
    nombre: normalizeSingleLine(values.nombre),
    telefono: normalizeSingleLine(values.telefono),
    correo: values.correo.trim(),
    proyecto: normalizeProject(values.proyecto),
  };
}

export function validateContactField(
  name: ContactField,
  rawValue: string,
): string | undefined {
  const value = rawValue.trim();

  if (name === "nombre") {
    return value ? undefined : "Escribe tu nombre completo.";
  }

  if (name === "telefono") {
    const digitCount = value.replace(/\D/g, "").length;
    const hasValidCharacters = /^\+?[\d\s().-]+$/.test(value);

    if (!value) {
      return "El teléfono es obligatorio.";
    }

    if (!hasValidCharacters || digitCount < 9 || digitCount > 12) {
      return "Ingresa un teléfono válido con entre 9 y 12 dígitos.";
    }

    return undefined;
  }

  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
    return "Ingresa un correo válido o deja este campo vacío.";
  }

  return undefined;
}

export function validateContact(values: ContactValues): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  for (const field of ["nombre", "telefono", "correo"] as const) {
    const error = validateContactField(field, values[field]);
    if (error) {
      errors[field] = error;
    }
  }

  if (values.nombre.length > 120) {
    errors.nombre = "El nombre no puede superar los 120 caracteres.";
  }

  if (values.telefono.length > 32) {
    errors.telefono = "El teléfono no puede superar los 32 caracteres.";
  }

  if (values.correo.length > 254) {
    errors.correo = "El correo no puede superar los 254 caracteres.";
  }

  return errors;
}
