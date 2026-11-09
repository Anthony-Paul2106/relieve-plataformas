import { AboutSection } from "./components/about-section";
import { ContactSection } from "./components/contact-section";
import { HeroSection } from "./components/hero-section";
import { ServicesSection } from "./components/services-section";
import { ServiceAssurances } from "./components/service-assurances";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { WhatsAppBubble } from "./components/whatsapp-bubble";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <ServiceAssurances />
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <WhatsAppBubble />
    </>
  );
}
