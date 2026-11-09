"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { whatsappLinks } from "./content";
import { WhatsAppIcon } from "./whatsapp-icon";

const DISMISS_KEY = "relieve-whatsapp-card-dismissed";
const DISMISS_EVENT = "relieve-whatsapp-card-dismissed-change";
let dismissedInMemory = false;

function subscribeToCard(callback: () => void) {
  window.addEventListener(DISMISS_EVENT, callback);
  return () => window.removeEventListener(DISMISS_EVENT, callback);
}

function getCardSnapshot() {
  if (dismissedInMemory) return false;
  try {
    return window.sessionStorage.getItem(DISMISS_KEY) !== "true";
  } catch {
    return true;
  }
}

function getServerCardSnapshot() {
  return true;
}

export function WhatsAppBubble() {
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const isCardOpen = useSyncExternalStore(
    subscribeToCard,
    getCardSnapshot,
    getServerCardSnapshot,
  );

  useEffect(() => {
    const contactSection = document.getElementById("contacto");
    const footer = document.querySelector(".site-footer");
    const mobileViewport = window.matchMedia("(max-width: 760px)");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === contactSection) {
          setIsContactVisible(mobileViewport.matches && entry.isIntersecting);
        }
        if (entry.target === footer) {
          setIsFooterVisible(entry.isIntersecting);
        }
      }
    });

    if (contactSection) observer.observe(contactSection);
    if (footer) observer.observe(footer);

    const handleViewportChange = () => {
      if (!contactSection || !mobileViewport.matches) {
        setIsContactVisible(false);
        return;
      }

      const bounds = contactSection.getBoundingClientRect();
      setIsContactVisible(bounds.top < window.innerHeight && bounds.bottom > 0);
    };

    mobileViewport.addEventListener("change", handleViewportChange);
    return () => {
      observer.disconnect();
      mobileViewport.removeEventListener("change", handleViewportChange);
    };
  }, []);

  const isAway = isContactVisible || isFooterVisible;

  const dismissCard = () => {
    dismissedInMemory = true;
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // Closing the card still works for the current render.
    }
    window.dispatchEvent(new Event(DISMISS_EVENT));
  };

  return (
    <div
      className={`whatsapp-bubble${isAway ? " whatsapp-bubble--away" : ""}`}
      aria-hidden={isAway || undefined}
    >
      {isCardOpen && (
        <div className="whatsapp-bubble__card">
          <a
            className="whatsapp-bubble__message"
            href={whatsappLinks.project}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isAway ? -1 : undefined}
            aria-label="¿Tienes un proyecto en altura? Escríbenos por WhatsApp. Se abrirá en una pestaña nueva."
          >
            <span>¿Tienes un proyecto en altura?</span>
            <strong>Escríbenos <span className="whatsapp-bubble__arrow" aria-hidden="true">→</span></strong>
          </a>
          <button
            className="whatsapp-bubble__close"
            type="button"
            onClick={dismissCard}
            tabIndex={isAway ? -1 : undefined}
            aria-label="Cerrar mensaje de WhatsApp por esta sesión"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      )}

      <a
        className="whatsapp-bubble__button"
        href={whatsappLinks.project}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={isAway ? -1 : undefined}
        aria-label="Abrir WhatsApp para solicitar una cotización. Se abrirá en una pestaña nueva."
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
