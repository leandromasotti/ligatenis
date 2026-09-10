import { Seccion } from "@/components/seccion";
import { BotonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Seccion className="max-w-xl">
      <span className="eyebrow text-verde">Error 404</span>
      <h1 className="mt-2 text-3xl font-bold">Esta pelota se fue afuera</h1>
      <p className="text-foreground-muted mt-3">
        La página que buscás no existe o cambió de dirección.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <BotonLink href="/">Volver al inicio</BotonLink>
        <BotonLink href="/categorias" variante="secundaria">
          Ver categorías
        </BotonLink>
      </div>
    </Seccion>
  );
}
