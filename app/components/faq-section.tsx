"use client";

import { useRef, useState } from "react";
import { faqs, whatsappLinks } from "./content";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const pointerActivationRef = useRef(false);

  return (
    <section className="faq-section" aria-labelledby="faq-title">
      <header className="faq-heading">
        <span className="faq-heading-mark" aria-hidden="true" />
        <div>
          <span className="faq-kicker">CENTRO DE AYUDA</span>
          <h2 id="faq-title">Preguntas frecuentes</h2>
          <p>{"Resolvemos tus dudas antes de solicitar una cotizaci\u00f3n."}</p>
        </div>
      </header>

      <div className="faq-list">
        {faqs.map(({ question, answer }, index) => {
          const isOpen = openIndex === index;
          const questionId = `faq-question-${index + 1}`;
          const answerId = `faq-answer-${index + 1}`;

          return (
            <article className={`faq-item${isOpen ? " is-open" : ""}`} key={question}>
              <button
                className="faq-question"
                id={questionId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onPointerDown={() => {
                  pointerActivationRef.current = false;
                }}
                onKeyDown={() => {
                  pointerActivationRef.current = false;
                }}
                onPointerUp={(event) => {
                  if (event.button !== 0) return;
                  pointerActivationRef.current = true;
                  setOpenIndex((current) => current === index ? null : index);
                }}
                onClick={() => {
                  if (pointerActivationRef.current) {
                    pointerActivationRef.current = false;
                    return;
                  }

                  pointerActivationRef.current = false;
                  setOpenIndex((current) => current === index ? null : index);
                }}
              >
                <span className="faq-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="faq-question-text">{question}</span>
                <span className="faq-toggle" aria-hidden="true">
                  {isOpen ? "\u2212" : "+"}
                </span>
              </button>
              <div
                className="faq-answer"
                id={answerId}
                role="region"
                aria-labelledby={questionId}
                aria-hidden={!isOpen}
                inert={!isOpen}
              >
                <div className="faq-answer-inner">
                  <p>{answer}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <footer className="faq-contact">
        <p>{"\u00bfTienes otra consulta?"}</p>
        <a
          className="faq-contact-button"
          href={whatsappLinks.project}
          target="_blank"
          rel="noopener noreferrer"
        >
          {"Cont\u00e1ctanos"}
          <span aria-hidden="true">{"\u2197"}</span>
        </a>
      </footer>
    </section>
  );
}
