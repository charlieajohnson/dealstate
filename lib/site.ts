// Canonical site origin used for metadataBase, sitemap and Open Graph image URLs.
// Precedence: explicit override, then the Vercel production domain (always set on
// Vercel, including preview deployments, so OG links point at production), then a
// local development default. This must never resolve to localhost in production.
export function resolveSiteUrl(env: Record<string, string | undefined> = process.env): string {
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL;
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
