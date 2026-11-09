import { whatsappLinks } from "./content";
import { Brand } from "./brand";
import { WhatsAppIcon } from "./whatsapp-icon";
import { CopyrightYear } from "./copyright-year";

const footerNavigation = [
  ["Inicio", "#inicio"],
  ["Servicios", "#servicios"],
  ["Nosotros", "#nosotros"],
  ["Contacto", "#contacto"],
] as const;

type FooterIconName = "support" | "email" | "phone" | "location" | "area" | "grid";

function FooterIcon({ name }: { name: FooterIconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "support" && <><path d="M4 13v-2a8 8 0 0 1 16 0v2"/><path d="M4 13H3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h3v-7H4Zm16 0h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3v-7h2Zm-2 6a6 6 0 0 1-6 3h-2"/></>}
      {name === "email" && <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>}
      {name === "phone" && <path d="M7 3h3l2 5-2.2 1.8a15 15 0 0 0 4.4 4.4L16 12l5 2v3c0 1.1-.9 2-2 2C10.7 19 5 13.3 5 5c0-1.1.9-2 2-2Z"/>}
      {name === "location" && <><path d="M20 10c0 5.5-8 12-8 12S4 15.5 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>}
      {name === "area" && <><path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"/><circle cx="12" cy="10" r="2.3"/><path d="M4 21h16"/></>}
      {name === "grid" && <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>}
    </svg>
  );
}

function getWhatsappPhone() {
  const digits = whatsappLinks.footer.match(/^https:\/\/wa\.me\/(\d+)/)?.[1];
  if (!digits) return null;

  const nationalNumber = digits.startsWith("51") ? digits.slice(2) : digits;
  const formatted = nationalNumber.length === 9
    ? `+51 ${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3, 6)} ${nationalNumber.slice(6)}`
    : `+${digits}`;

  return { href: `+${digits}`, label: formatted };
}

export function SiteFooter() {
  const email = process.env.CONTACT_EMAIL?.trim();
  const phone = getWhatsappPhone();

  return (
    <>
      <aside className="commercial-notice">
        <span className="notice-icon" aria-hidden="true">i</span>
        <p><strong>Aviso comercial:</strong> El servicio está sujeto a la disponibilidad de equipos propios o de proveedores asociados. La cobertura y las condiciones se confirmarán al consultar.</p>
      </aside>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-main">
            <section className="footer-column footer-brand" aria-label="ELEVA">
              <Brand />
              <span className="footer-brand__rule" aria-hidden="true" />
              <p className="footer-brand__description">
                Soluciones de acceso en altura para proyectos en Arequipa y alrededores.
              </p>
              <p className="footer-area-tag">
                <span className="footer-icon"><FooterIcon name="location" /></span>
                <span>Atención en Arequipa y alrededores</span>
              </p>
            </section>

            <section className="footer-column footer-company" aria-labelledby="footer-contact-title">
              <h2 id="footer-contact-title"><span className="footer-icon"><FooterIcon name="support" /></span>Contáctanos</h2>
              <ul className="footer-contact-list">
                {email && (
                  <li>
                    <span className="footer-icon"><FooterIcon name="email" /></span>
                    <a href={`mailto:${email}`}>{email}</a>
                  </li>
                )}
                {phone && (
                  <li>
                    <span className="footer-icon"><FooterIcon name="phone" /></span>
                    <a href={`tel:${phone.href}`}>{phone.label}</a>
                  </li>
                )}
                <li><span className="footer-icon"><FooterIcon name="location" /></span><span>Arequipa, Perú</span></li>
                <li><span className="footer-icon"><FooterIcon name="area" /></span><span>Atención en Arequipa y alrededores</span></li>
              </ul>
            </section>

            <nav className="footer-column footer-nav" aria-labelledby="footer-explore-title">
              <h2 id="footer-explore-title"><span className="footer-icon"><FooterIcon name="grid" /></span>Explora</h2>
              <ul>
                {footerNavigation.map(([label, href]) => (
                  <li key={label}><a href={href}><span aria-hidden="true">›</span>{label}</a></li>
                ))}
              </ul>
            </nav>

            <section className="footer-column footer-action" aria-labelledby="footer-whatsapp-title">
              <div className="footer-whatsapp-card">
                <span className="footer-contact__icon"><WhatsAppIcon /></span>
                <div className="footer-contact__copy">
                  <h2 id="footer-whatsapp-title">¿Tienes un proyecto en altura?</h2>
                  <a className="footer-whatsapp-button" href={whatsappLinks.footer} target="_blank" rel="noopener noreferrer">
                    Escríbenos por WhatsApp <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </section>
          </div>

          <div className="footer-bottom">
            <p>© <CopyrightYear /> ELEVA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
