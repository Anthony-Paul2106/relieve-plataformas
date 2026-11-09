import Image from "next/image";
import { getExistingPublicImage } from "../lib/public-images";
import { whatsappLinks } from "./content";
import { WhatsAppOutlineIcon } from "./whatsapp-icon";

export function HeroSection() {
  const heroImage = getExistingPublicImage("/images/hero.webp");

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-inner">
        <div className={`hero-photo${heroImage ? " hero-photo--with-image" : ""}`}>
          {heroImage ? (
            <Image
              className="hero-image"
              src={heroImage}
              alt="Plataforma articulada ELEVA trabajando junto a una fachada."
              fill
              sizes="(min-width: 1601px) 1600px, 100vw"
              priority
            />
          ) : null}
        </div>
        <div className="hero-copy">
          <p className="hero-eyebrow">PLATAFORMA ARTICULADA</p>
          <h1 id="hero-title">
            <span>Alquiler de</span>
            <span>Plataforma</span>
            <span className="hero-title-accent">Elevadora</span>
          </h1>
          <p className="hero-model">JLG 600 — Articulada</p>
          <span className="hero-accent-rule" aria-hidden="true" />
          <p className="hero-description">
            Alcance, seguridad y productividad para trabajos en altura.
          </p>
          <a
            className="button hero-cta"
            href={whatsappLinks.project}
            aria-label="Solicita tu cotización por WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppOutlineIcon />
            <span>Solicita tu cotización</span>
            <span className="hero-cta-arrow" aria-hidden="true">→</span>
          </a>
          <p className="hero-availability">
            Disponibilidad y configuración del equipo por confirmar.
          </p>
        </div>
        <span className="hero-edge-accent" aria-hidden="true" />
      </div>
    </section>
  );
}
