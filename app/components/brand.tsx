import Image from "next/image";

export function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="ELEVA, inicio">
      <Image
        className="footer-logo"
        src="/images/logo-header.webp"
        alt="ELEVA, alquiler de plataformas"
        width={2040}
        height={484}
        sizes="200px"
      />
    </a>
  );
}
