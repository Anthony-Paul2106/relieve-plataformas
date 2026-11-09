import Image from "next/image";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <Image
      className={className}
      src="/images/whatsapp-icon.webp"
      alt=""
      aria-hidden="true"
      width={30}
      height={30}
    />
  );
}

export function WhatsAppOutlineIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5.2 26.8 6.8 22a11.2 11.2 0 1 1 4.1 3.4l-5.7 1.4Z" />
      <path d="M11.5 10.1c.3-.6.6-.6.9-.6h.7c.2 0 .5.1.7.5l1 2.3c.1.3.1.6-.1.8l-.8 1c-.2.2-.2.4 0 .7.4.7 1.1 1.5 1.9 2.1.7.6 1.5 1 2.2 1.2.3.1.5 0 .7-.2l1-1.2c.2-.2.5-.3.8-.2l2.2 1c.3.1.5.3.5.6 0 .5-.3 1.5-1 2-.7.6-1.7.8-2.7.6-1.1-.2-2.6-.8-4.4-2.3-2.1-1.8-3.5-4.1-3.9-5.1-.4-1-.4-2 .3-2.9Z" />
    </svg>
  );
}
