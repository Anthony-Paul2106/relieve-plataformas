import { existsSync } from "node:fs";
import { resolve, sep } from "node:path";

const publicDirectory = resolve(process.cwd(), "public");

export function getExistingPublicImage(src: string): string | undefined {
  if (!src.startsWith("/images/")) {
    return undefined;
  }

  const filePath = resolve(publicDirectory, src.slice(1));
  if (!filePath.startsWith(`${publicDirectory}${sep}`)) {
    return undefined;
  }

  return existsSync(filePath) ? src : undefined;
}
