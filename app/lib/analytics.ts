type AnalyticsEvent = (
  command: "event",
  eventName: string,
  parameters: Record<string, string>,
) => void;

declare global {
  interface Window {
    gtag?: AnalyticsEvent;
  }
}

export function trackContactLead(): void {
  window.gtag?.("event", "generate_lead", { form_name: "contact" });
}
