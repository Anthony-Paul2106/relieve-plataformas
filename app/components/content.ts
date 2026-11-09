export const services = [
  {
    title: "Instalación de Letras Corpóreas 3D",
    description: "Montaje de letras volumétricas, logotipos y anuncios luminosos en fachadas y edificios.",
    image: "/images/servicios/letras-corporeas-3d-clean.webp",
  },
  {
    title: "Montaje de Paneles y Tótems Publicitarios",
    description: "Instalación de paneles, tótems, cajas de luz y estructuras publicitarias.",
    image: "/images/servicios/paneles-totems-publicitarios-clean.webp",
  },
  {
    title: "Mantenimiento de Fachadas y Edificios",
    description: "Limpieza, reparación, inspección y pintura de fachadas y superficies exteriores.",
    image: "/images/servicios/mantenimiento-fachadas-clean.webp",
  },
  {
    title: "Montaje de Estructuras Metálicas",
    description: "Instalación de estructuras, coberturas, techos, soportes metálicos y componentes industriales.",
    image: "/images/servicios/estructuras-metalicas-clean.webp",
  },
  {
    title: "Instalaciones Eléctricas e Iluminación",
    description: "Instalación y mantenimiento de luminarias, reflectores, cableado y sistemas de iluminación en altura.",
    image: "/images/servicios/instalaciones-electricas-clean.webp",
  },
  {
    title: "Instalación de Cámaras de Seguridad",
    description: "Instalación, cableado y configuración de sistemas de videovigilancia en altura.",
    image: "/images/servicios/camaras-seguridad-clean.webp",
  },
] as const;

export const faqs = [
  {
    question: "¿Cómo consulto la disponibilidad?",
    answer: "La disponibilidad se confirma al revisar la fecha, la ubicación y los requerimientos del proyecto.",
  },
  {
    question: "¿Cómo solicito una cotización?",
    answer: "Puedes completar el formulario o escribir por WhatsApp. La cotización se coordina tras revisar los datos del proyecto.",
  },
  {
    question: "¿El transporte del equipo está incluido?",
    answer: "La cobertura y las condiciones de transporte se confirman según la ubicación y el equipo disponible.",
  },
  {
    question: "¿El servicio incluye operador?",
    answer: "La necesidad de operador y sus condiciones se confirman al evaluar el equipo y los requerimientos del proyecto.",
  },
] as const;

const whatsappMessage =
  "Hola, deseo consultar información sobre el alquiler de plataformas elevadoras en Arequipa. Quisiera conocer la disponibilidad y las tarifas.";
const whatsappUrl = `https://wa.me/51927483349?text=${encodeURIComponent(whatsappMessage)}`;

export const whatsappLinks = {
  header: whatsappUrl,
  mobile: whatsappUrl,
  project: whatsappUrl,
  footer: whatsappUrl,
} as const;
