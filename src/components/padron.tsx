"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Avatar, InsigniaCampeon } from "@/components/jugador";
import type { Tenista } from "@/lib/datos/tipos";

/** Listado de tenistas de un cuadro, con buscador por nombre. */
export function Padron({ tenistas }: { tenistas: Tenista[] }) {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return tenistas;
    return tenistas.filter((tenista) => tenista.nombre.toLowerCase().includes(termino));
  }, [busqueda, tenistas]);

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="sr-only">Buscar tenista</span>
        <input
          type="search"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          placeholder="Buscar por nombre"
          className="border-line bg-surface focus:border-celeste h-10 rounded-md border px-3 text-[0.93rem] outline-none"
        />
      </label>

      {filtrados.length === 0 ? (
        <p className="text-muted py-6 text-center text-[0.93rem]">
          Ningún tenista de este cuadro coincide con “{busqueda}”.
        </p>
      ) : (
        <ul className="border-line bg-surface rounded-card border px-4">
          {filtrados.map((tenista) => (
            <li key={tenista.slug} className="border-line border-b last:border-b-0">
              <Link
                href={`/jugadores/${tenista.slug}`}
                className="hover:text-verde flex items-center gap-3 py-3 transition-colors"
              >
                <Avatar nombre={tenista.nombre} />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-display truncate text-[0.98rem] font-semibold">
                    {tenista.nombre}
                  </span>
                  <span className="text-muted text-[0.8rem]">
                    {tenista.club ?? "Perfil sin completar"}
                  </span>
                </span>
                {tenista.campeon && (
                  <span className="ml-auto shrink-0">
                    <InsigniaCampeon categoriaSlug={tenista.categoriaSlug} />
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
