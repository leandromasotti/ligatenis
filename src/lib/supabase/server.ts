import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { configSupabase } from "@/lib/supabase/config";

/**
 * Cliente de Supabase para Server Components, Server Actions y route handlers.
 * Hay que crear uno por request: nunca compartirlo entre pedidos.
 */
export async function crearClienteServidor() {
  const { url, anonKey } = configSupabase();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Los Server Components no pueden escribir cookies: el refresh de la
          // sesión lo hace el middleware (sprint 2).
        }
      },
    },
  });
}
