const serviceData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Alquiler de plataformas elevadoras",
  description:
    "Opciones de alquiler de plataformas elevadoras en Arequipa para mantenimiento, montaje y trabajos en altura. Disponibilidad y condiciones sujetas a confirmación.",
  areaServed: "Arequipa",
  provider: {
    "@type": "Organization",
    name: "ELEVA",
  },
};

export function ServiceStructuredData() {
  const safeJson = JSON.stringify(serviceData).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
