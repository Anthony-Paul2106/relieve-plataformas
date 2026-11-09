"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  normalizeContactValues,
  validateContact,
  validateContactField,
  type ContactField,
  type ContactFieldErrors,
} from "../lib/contact-validation";
import { trackContactLead } from "../lib/analytics";

type Feedback = { kind: "success" | "error"; message: string };
type ContactResponse = {
  status?: string;
  message?: string;
  fieldErrors?: ContactFieldErrors;
};

type FieldIconName = "user" | "phone" | "email" | "project";

function FieldIcon({ name }: { name: FieldIconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "user" && <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>}
      {name === "phone" && <path d="M7 3h3l2 5-2.2 1.8a15 15 0 0 0 4.4 4.4L16 12l5 2v3c0 1.1-.9 2-2 2C10.7 19 5 13.3 5 5c0-1.1.9-2 2-2Z"/>}
      {name === "email" && <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>}
      {name === "project" && <><path d="m4 8 8-4 8 4-8 4-8-4Z"/><path d="m4 12 8 4 8-4m-16 4 8 4 8-4"/></>}
    </svg>
  );
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event: ChangeEvent<HTMLFormElement>) {
    setFeedback(null);

    if (!hasAttemptedSubmit) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) {
      return;
    }

    const fieldName = target.name;
    if (
      fieldName !== "nombre" &&
      fieldName !== "telefono" &&
      fieldName !== "correo"
    ) {
      return;
    }

    const normalizedValue = normalizeContactValues({
      nombre: fieldName === "nombre" ? target.value : "",
      telefono: fieldName === "telefono" ? target.value : "",
      correo: fieldName === "correo" ? target.value : "",
      proyecto: "",
    })[fieldName as ContactField];
    const error = validateContactField(fieldName as ContactField, normalizedValue);
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      if (error) {
        nextErrors[fieldName] = error;
      } else {
        delete nextErrors[fieldName];
      }

      return nextErrors;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    const formData = new FormData(event.currentTarget);
    const values = normalizeContactValues({
      nombre: String(formData.get("nombre") ?? ""),
      telefono: String(formData.get("telefono") ?? ""),
      correo: String(formData.get("correo") ?? ""),
      proyecto: String(formData.get("proyecto") ?? ""),
    });
    const nextErrors = validateContact(values);

    setErrors(nextErrors);

    const firstInvalidField = Object.keys(nextErrors)[0];
    if (firstInvalidField) {
      setFeedback(null);
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)
        ?.focus();
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Contact-Request": "same-origin",
        },
        body: JSON.stringify({
          ...values,
          website: String(formData.get("contact_reference") ?? ""),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as ContactResponse;

      if (!response.ok || result.status !== "sent") {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
          const firstServerError = Object.keys(result.fieldErrors)[0];
          if (firstServerError) {
            formRef.current
              ?.querySelector<HTMLElement>(`[name="${firstServerError}"]`)
              ?.focus();
          }
        }

        setFeedback({
          kind: "error",
          message:
            result.message ??
            "No se pudo enviar la solicitud. Inténtalo nuevamente más tarde.",
        });
        return;
      }

      setFeedback({
        kind: "success",
        message:
          result.message ??
          "El servidor de correo aceptó tu solicitud para envío.",
      });
      trackContactLead();
    } catch {
      setFeedback({
        kind: "error",
        message:
          "No se pudo confirmar el resultado del envío. Revisa tu conexión e inténtalo más tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    formRef.current?.reset();
    setErrors({});
    setHasAttemptedSubmit(false);
    setFeedback(null);
    formRef.current
      ?.querySelector<HTMLInputElement>('[name="nombre"]')
      ?.focus();
  }

  return (
    <>
      <div className="contact-form-column">
        <form
          className="request-form"
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          onChange={handleChange}
          aria-describedby="form-disclaimer"
        >
          <div className="form-trap" aria-hidden="true">
            <label htmlFor="contact-website">Deja este campo vacío</label>
            <input
              id="contact-website"
              name="contact_reference"
              type="text"
              tabIndex={-1}
              autoComplete="new-password"
              readOnly
            />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label" htmlFor="contact-name"><FieldIcon name="user"/><span>Nombre completo</span></label>
              <input
                id="contact-name"
                name="nombre"
                maxLength={120}
                autoComplete="name"
                placeholder="Tu nombre"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.nombre)}
                aria-describedby={errors.nombre ? "contact-name-error" : undefined}
              />
              {errors.nombre && (
                <span className="field-error" id="contact-name-error" role="alert">
                  {errors.nombre}
                </span>
              )}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="contact-phone"><FieldIcon name="phone"/><span>{"Tel\u00e9fono"}</span></label>
              <input
                id="contact-phone"
                name="telefono"
                type="tel"
                inputMode="tel"
                maxLength={32}
                autoComplete="tel"
                placeholder="Tu número de contacto"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.telefono)}
                aria-describedby={errors.telefono ? "contact-phone-error" : undefined}
              />
              {errors.telefono && (
                <span className="field-error" id="contact-phone-error" role="alert">
                  {errors.telefono}
                </span>
              )}
            </div>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="contact-email"><FieldIcon name="email"/><span>{"Correo electr\u00f3nico"} <span className="optional-label">(opcional)</span></span></label>
            <input
              id="contact-email"
              name="correo"
              type="email"
              maxLength={254}
              autoComplete="email"
              placeholder="nombre@empresa.com"
              aria-invalid={Boolean(errors.correo)}
              aria-describedby={errors.correo ? "contact-email-error" : undefined}
            />
            {errors.correo && (
              <span className="field-error" id="contact-email-error" role="alert">
                {errors.correo}
              </span>
            )}
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="contact-project"><FieldIcon name="project"/><span>{"Cu\u00e9ntanos sobre tu proyecto"} <span className="optional-label">(opcional)</span></span></label>
            <textarea
              id="contact-project"
              name="proyecto"
              rows={4}
              maxLength={2000}
              placeholder="Tipo de trabajo, ubicación y altura aproximada"
            />
          </div>
          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando…" : "Enviar solicitud"}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
          <div className="form-disclaimer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2"/></svg>
            <small id="form-disclaimer">
              {"Tus datos se enviar\u00e1n por correo para atender esta solicitud."}
            </small>
          </div>
        </form>

        {feedback && (
          <div
            className={`form-feedback form-feedback--${feedback.kind}`}
            role={feedback.kind === "error" ? "alert" : "status"}
            aria-live={feedback.kind === "error" ? "assertive" : "polite"}
          >
            <p>{feedback.message}</p>
            {feedback.kind === "success" && (
              <button className="text-button" type="button" onClick={handleReset}>
                Volver a completar el formulario
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
