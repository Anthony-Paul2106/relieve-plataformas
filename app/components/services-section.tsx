import Image from "next/image";
import { services } from "./content";
import { FaqSection } from "./faq-section";

const validationItems = [
  {
    icon: "shield",
    title: "Seguridad y certificación",
    detail: "Documentación de la unidad: por confirmar.",
  },
  {
    icon: "operator",
    title: "Operador",
    detail: "Disponibilidad y calificación por confirmar.",
  },
  {
    icon: "tools",
    title: "Soporte técnico",
    detail: "Alcance durante el servicio por confirmar.",
  },
  {
    icon: "calendar",
    title: "Alquiler por período",
    detail: "Día, semana o mes: condiciones por confirmar.",
  },
] as const;

function ServicioCard({ title, description, image }: (typeof services)[number]) {
  return (
    <li className="servicio-card">
      <div className="servicio-card-media">
        <Image
          className="servicio-card-image"
          src={image}
          alt={title}
          width={1536}
          height={1024}
          sizes="(max-width: 380px) calc(100vw - 32px), (max-width: 760px) calc(100vw - 32px), (max-width: 1050px) calc((100vw - 70px) / 2), (max-width: 1263px) calc((100vw - 108px) / 3), 385px"
        />
      </div>
      <div className="servicio-card-copy">
        <h3>{title}</h3>
        <span className="servicio-card-rule" aria-hidden="true" />
        <p>{description}</p>
      </div>
    </li>
  );
}

function ValidationIcon({ name }: { name: (typeof validationItems)[number]["icon"] }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "shield" && <><path d="M20 4 33 9v10c0 8-5.6 13.5-13 17-7.4-3.5-13-9-13-17V9l13-5Z"/><path d="m13 20 5 5 9-10"/></>}
      {name === "operator" && <><path d="M7 20a13 13 0 0 1 26 0v2H7v-2Z"/><path d="M5 22v6h30v-6M12 28v5h16v-5"/><path d="M14 13h12"/></>}
      {name === "tools" && <><path d="m7 7 7 7m-4-10 7 7-8 8-7-7 5-8ZM23 25l12 11-4 4-11-12m3-4 9-9a7 7 0 0 0 6-9l-5 5-5-1-1-5 5-5a7 7 0 0 0-9 7l-9 9"/></>}
      {name === "calendar" && <><rect x="5" y="8" width="30" height="27" rx="2"/><path d="M12 4v8m16-8v8M5 16h30"/><path d="m12 25 5 5 11-11"/></>}
    </svg>
  );
}

export function ServicesSection() {
  return (
    <section className="services section" id="servicios" aria-labelledby="services-title">
      <div className="services-title-row">
        <span className="services-title-mark" aria-hidden="true" />
        <h2 id="services-title">Nuestros Servicios</h2>
      </div>

      <ul className="servicio-card-grid">
        {services.map((service) => <ServicioCard key={service.title} {...service} />)}
      </ul>

      <aside className="service-validation" aria-label="Condiciones que se confirman antes de cotizar">
        {validationItems.map(({ icon, title, detail }) => (
          <div className="validation-item" key={title}>
            <ValidationIcon name={icon} />
            <p><strong>{title}</strong><span>{detail}</span></p>
          </div>
        ))}
      </aside>

      <FaqSection />
    </section>
  );
}
