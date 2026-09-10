import type { Metadata } from "next";
import { EnConstruccion, Seccion, TituloSeccion } from "@/components/seccion";

export const metadata: Metadata = {
  title: "Registrarme",
  description: "Creá tu cuenta de tenista de la Liga Dolorense de Tenis.",
};

export default function RegistrarmePage() {
  return (
    <Seccion className="max-w-xl">
      <TituloSeccion
        eyebrow="Tenistas"
        titulo="Crear mi cuenta"
        bajada="El alta la hace cada tenista: email, datos personales, foto y la categoría en la que juega. La organización aprueba el alta antes de publicar la ficha."
      />
      <div className="mt-8">
        <EnConstruccion
          sprint="Sprint 2"
          titulo="Registro y verificación de email"
          detalle="Formulario de alta con Supabase Auth, mail de verificación, recupero de contraseña y el onboarding en pasos para cargar el perfil y la foto."
        />
      </div>
    </Seccion>
  );
}
