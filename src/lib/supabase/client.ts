import { createBrowserClient } from "@supabase/ssr";
import { configSupabase } from "@/lib/supabase/config";

/** Cliente de Supabase para componentes del navegador ("use client"). */
export function crearClienteNavegador() {
  const { url, anonKey } = configSupabase();
  return createBrowserClient(url, anonKey);
}
