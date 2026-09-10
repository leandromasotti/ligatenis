/**
 * URL pública del sitio, para los metadatos y los enlaces de Open Graph.
 *
 * El orden importa:
 *   1. `NEXT_PUBLIC_SITE_URL` — el dominio propio, cuando lo haya
 *   2. la URL de producción que Vercel inyecta en el build, así los deploys
 *      resuelven bien sin configurar nada
 *   3. el dev local
 *
 * Sin esto, un deploy sin variables generaría las tarjetas de WhatsApp y Facebook
 * apuntando a localhost.
 */
export function urlDelSitio(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return "http://localhost:3000";
}
