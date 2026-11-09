export function getSiteUrl(): URL | undefined {
  const configuredUrl = process.env.SITE_URL?.trim();
  if (!configuredUrl) {
    return undefined;
  }

  try {
    const url = new URL(configuredUrl);
    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      url.username ||
      url.password
    ) {
      return undefined;
    }

    return url;
  } catch {
    return undefined;
  }
}
