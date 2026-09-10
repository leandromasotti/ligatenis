/**
 * Lee la configuración de Supabase de forma perezosa: si se leyera en el módulo,
 * un `next build` sin variables de entorno fallaría sin necesidad.
 */
export function configSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. Copiá .env.example a .env.local y completá los valores del proyecto.",
    );
  }

  return { url, anonKey };
}
