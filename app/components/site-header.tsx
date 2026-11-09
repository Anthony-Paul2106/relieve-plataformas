"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { whatsappLinks } from "./content";
import { WhatsAppOutlineIcon } from "./whatsapp-icon";

const navigation = [
  ["Inicio", "#inicio"],
  ["Servicios", "#servicios"],
  ["Nosotros", "#nosotros"],
  ["Contacto", "#contacto"],
] as const;

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const clientReady = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const [lastPointerEvent, setLastPointerEvent] = useState("ninguno");
  const [lastClickEvent, setLastClickEvent] = useState("ninguno");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const focusMenuOnOpenRef = useRef(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    if (focusMenuOnOpenRef.current) {
      navigationRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      focusMenuOnOpenRef.current = false;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (
        navigationRef.current?.contains(target) ||
        menuButtonRef.current?.contains(target)
      ) {
        return;
      }

      setIsMenuOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
    focusMenuOnOpenRef.current = false;
    if (window.matchMedia("(max-width: 760px)").matches) {
      menuButtonRef.current?.focus();
    }
  }

  function toggleMenu(focusFirstLink: boolean) {
    const willOpen = !isMenuOpen;
    focusMenuOnOpenRef.current = willOpen && focusFirstLink;
    setIsMenuOpen(willOpen);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#inicio" aria-label="ELEVA, inicio">
          <Image
            className="header-logo"
            src="/images/logo-header.webp"
            alt="ELEVA, alquiler de plataformas"
            width={2040}
            height={484}
            sizes="(max-width: 380px) 140px, (max-width: 760px) clamp(120px, 40vw, 164px), (max-width: 1050px) clamp(182px, 24vw, 250px), clamp(260px, 26vw, 390px)"
            priority
          />
        </a>
        <nav
          ref={navigationRef}
          className={`main-nav${isMenuOpen ? " main-nav--open" : ""}`}
          id="main-navigation"
          aria-label="Navegación principal"
        >
          {navigation.map(([label, href], index) => (
            <a
              href={href}
              key={label}
              aria-current={index === 0 ? "page" : undefined}
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          className="button button-header"
          href={whatsappLinks.header}
          aria-label="Cotiza por WhatsApp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppOutlineIcon />
          <span className="button-header-long">Cotiza por WhatsApp</span>
          <span className="button-header-short" aria-hidden="true">Cotiza</span>
        </a>
        <button
          className={`mobile-menu-toggle${isMenuOpen ? " mobile-menu-toggle--open" : ""}`}
          ref={menuButtonRef}
          type="button"
          aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          onPointerDown={() => {
            setLastPointerEvent("pointerdown recibido");
          }}
          onPointerUp={(event) => {
            setLastPointerEvent(`pointerup recibido (botón ${event.button})`);
          }}
          onClick={(event) => {
            setLastClickEvent(`click recibido (detail ${event.detail})`);
            toggleMenu(event.detail === 0);
          }}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
      {process.env.NODE_ENV !== "production" && (
        <output className="mobile-menu-diagnostic" aria-live="polite">
          <strong>Diagnóstico del menú (desarrollo)</strong>
          <span>{clientReady ? "React: hidratado" : "React: esperando hidratación"}</span>
          <span>Menú renderizado en DOM: sí (CSS controla visibilidad)</span>
          <span>Estado: {isMenuOpen ? "abierto" : "cerrado"}</span>
          <span>Puntero: {lastPointerEvent}</span>
          <span>Click: {lastClickEvent}</span>
        </output>
      )}
    </header>
  );
}
