import type { Metadata } from "next";
import { GoogleAnalytics } from "./components/google-analytics";
import { ServiceStructuredData } from "./components/service-structured-data";
import { getSiteUrl } from "./lib/site-config";
import "./globals.css";

const siteUrl = getSiteUrl();
const title = "Alquiler de Plataformas Elevadoras en Arequipa | ELEVA";
const description =
  "Consulta por alquiler de plataformas elevadoras para mantenimiento, montaje y trabajos en altura en Arequipa. Disponibilidad y condiciones sujetas a confirmación.";
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title,
  description,
  alternates: siteUrl ? { canonical: new URL("/", siteUrl).toString() } : undefined,
  openGraph: {
    title,
    description,
    locale: "es_PE",
    type: "website",
    ...(siteUrl
      ? {
          url: new URL("/", siteUrl).toString(),
          images: [
            {
              url: new URL("/images/hero.webp", siteUrl).toString(),
              alt: "Plataforma elevadora articulada ELEVA.",
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    ...(siteUrl
      ? {
          images: [
            {
              url: new URL("/images/hero.webp", siteUrl).toString(),
              alt: "Plataforma elevadora articulada ELEVA.",
            },
          ],
        }
      : {}),
  },
  robots: { index: true, follow: true },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <GoogleAnalytics />
        <ServiceStructuredData />
        {children}
      </body>
    </html>
  );
}
