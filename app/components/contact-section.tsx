import Image from "next/image";
import { ContactForm } from "./contact-form";
import { getExistingPublicImage } from "../lib/public-images";

const contactBenefits = [
  { icon: "shield", label: "Atenci\u00f3n personalizada" },
  { icon: "calendar", label: "Respuesta r\u00e1pida" },
  { icon: "helmet", label: "Coordinaci\u00f3n seg\u00fan tu proyecto" },
] as const;

function ContactIcon({ name }: { name: (typeof contactBenefits)[number]["icon"] | "location" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "location" && <><path d="M26 13c0 7-10 16-10 16S6 20 6 13a10 10 0 1 1 20 0Z"/><circle cx="16" cy="13" r="3"/></>}
      {name === "shield" && <><path d="M16 3 27 7v8c0 7-5 11-11 14C10 26 5 22 5 15V7l11-4Z"/><path d="m11 16 3 3 7-8"/></>}
      {name === "calendar" && <><rect x="4" y="6" width="24" height="22" rx="3"/><path d="M10 3v6m12-6v6M4 12h24M10 18h4m4 0h4m-12 5h4"/></>}
      {name === "helmet" && <><path d="M5 19a11 11 0 0 1 22 0v2H5v-2Z"/><path d="M16 8v11M3 22v4h26v-4M10 11V8m12 3V8"/></>}
    </svg>
  );
}

export function ContactSection() {
  const contactImage = getExistingPublicImage("/images/hero.webp");

  return (
    <section className="contact section" id="contacto" aria-labelledby="contact-title">
      {contactImage && (
        <div className="contact-photo" aria-hidden="true">
          <Image src={contactImage} alt="" fill sizes="(max-width: 380px) calc(100vw - 36px), (max-width: 760px) calc(100vw - 44px), (max-width: 1263px) 54vw, 684px" />
        </div>
      )}
      <div className="contact-copy">
        <div className="contact-intro">
          <div className="contact-brand" aria-label="ELEVA">
            <Image
              className="contact-brand-logo"
              src="/images/logo-header.webp"
              alt="ELEVA, alquiler de plataformas"
              width={2040}
              height={484}
              sizes="(max-width: 760px) 170px, 230px"
            />
          </div>
          <span className="contact-title-rule" aria-hidden="true" />
          <span className="contact-kicker">{"CU\u00c9NTANOS TU PROYECTO"}</span>
          <h2 id="contact-title">Solicita una <span>{"cotizaci\u00f3n"}</span></h2>
          <p>{"D\u00e9janos tus datos y coordinaremos contigo la disponibilidad del servicio."}</p>
          <div className="contact-detail">
            <span className="detail-mark"><ContactIcon name="location" /></span>
            <div>
              <strong>ELEVA</strong>
              <span>Servicio en Arequipa y alrededores</span>
            </div>
          </div>
        </div>

        <ul className="contact-benefits" aria-label={"Beneficios de atenci\u00f3n"}>
          {contactBenefits.map(({ icon, label }) => (
            <li className="contact-benefit" key={label}>
              <span className="contact-benefit-icon"><ContactIcon name={icon} /></span>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <ContactForm />
    </section>
  );
}
