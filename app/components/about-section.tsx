import Image from "next/image";
import { getExistingPublicImage } from "../lib/public-images";

type AboutIconName =
  | "height"
  | "installation"
  | "assembly";

const focusAreas: { label: string; icon: AboutIconName }[] = [
  { label: "Trabajos en altura", icon: "height" },
  { label: "Montaje de estructuras", icon: "assembly" },
  { label: "Instalación y eventos", icon: "installation" },
];

function AboutIcon({ name }: { name: AboutIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "height" && (
        <>
          <path d="M4 21h16M7 21V4h10v17M10 8h4M10 12h4M10 16h4" />
        </>
      )}
      {name === "installation" && (
        <>
          <path d="M4 5h16v10H4zM8 15v5m8-5v5M8 20h8M8 9h8" />
          <path d="m10 12 2-2 2 2" />
        </>
      )}
      {name === "assembly" && (
        <>
          <path d="M3 21h18M6 21V9l6-5 6 5v12M9 14h6M9 18h6" />
        </>
      )}
    </svg>
  );
}

export function AboutSection() {
  const aboutImage = getExistingPublicImage("/images/servicios/nosotros.webp");

  return (
    <section className="about section" id="nosotros" aria-labelledby="about-title">
      <div className="about-intro">
        <div className="about-copy about-reveal">
          <div className="about-brand" aria-label="ELEVA">
            <span className="about-brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <span>ELEVA</span>
          </div>
          <span className="about-title-rule" aria-hidden="true" />
          <h2 id="about-title">
            <span>Plataformas</span>
            <span>elevadoras para</span>
            <span className="about-title-accent">cada proyecto</span>
          </h2>
          <div className="about-copy-body">
            <p>
              ELEVA coordina opciones de alquiler de plataformas elevadoras para
              trabajos en altura en Arequipa. Cada solicitud se revisa según la
              tarea, el alcance requerido, la ubicación y la fecha.
            </p>
            <p>
              Los equipos disponibles pueden ser propios o de proveedores
              asociados. El modelo, la configuración, la documentación, el
              operador, la cobertura y las condiciones se confirman antes de
              preparar la cotización.
            </p>
          </div>
        </div>

        <div className="about-visual about-reveal">
          <span className="about-visual-shape about-visual-shape--top" aria-hidden="true" />
          <span className="about-visual-shape about-visual-shape--bottom" aria-hidden="true" />
          <figure className="about-photo">
            {aboutImage ? (
              <Image
                src={aboutImage}
                alt="Plataforma elevadora naranja junto a un edificio durante un trabajo de instalación."
                fill
                sizes="(max-width: 380px) calc(100vw - 72px), (max-width: 760px) calc(100vw - 80px), (max-width: 1050px) 46vw, (max-width: 1280px) min(45vw, 540px), 540px"
              />
            ) : (
              <span>TRABAJOS EN ALTURA</span>
            )}
          </figure>
          <ul className="about-highlights" aria-label="Áreas de trabajo">
            {focusAreas.map(({ label, icon }) => (
              <li className="about-highlight" key={label}>
                <AboutIcon name={icon} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </section>
  );
}
