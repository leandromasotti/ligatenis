import type { Metadata } from "next";
import { EnConstruccion, Seccion, TituloSeccion } from "@/components/seccion";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Entrá a tu perfil de tenista de la Liga Dolorense de Tenis.",
};

export default function IngresarPage() {
  return (
    <Seccion className="max-w-xl">
      <TituloSeccion
        eyebrow="Tenistas"
        titulo="Ingresar"
        bajada="Con el email y la contraseña que usaste al registrarte."
      />
      <div className="mt-8">
        <EnConstruccion
          sprint="Sprint 2"
          titulo="Inicio de sesión"
          detalle="Login con email y contraseña sobre Supabase Auth, sesión en cookies para las páginas del servidor y recupero de contraseña por mail."
        />
      </div>
    </Seccion>
  );
}
