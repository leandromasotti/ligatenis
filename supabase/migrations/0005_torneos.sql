-- ============================================================================
-- Liga Dolorense de Tenis · torneos
-- ----------------------------------------------------------------------------
-- La liga se juega por torneos, de singles y de dobles, y de ahí van a salir los
-- puntos del ranking. Este esquema cubre lo mínimo: qué torneos hay, en qué estado
-- están y quién ganó cada cuadro. El admin carga los campeones al terminar.
--
-- Deliberadamente simple:
--   * `periodo` es texto libre ("Abril 2026", "Del 12 al 20 de octubre") en lugar
--     de un rango de fechas, porque la liga anuncia así y no hay que calcular nada
--   * `orden` decide la posición en el listado, sin depender de fechas
--   * los campeones se guardan por nombre y, cuando el tenista tiene cuenta,
--     también por `profile_id`: así se puede publicar un resultado de alguien que
--     todavía no se registró, y enlazar su ficha cuando lo haga
-- ============================================================================

create type public.estado_torneo as enum ('en_camino', 'en_progreso', 'terminado');

create table public.torneos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  temporada_id uuid references public.temporadas (id) on delete set null,
  modalidad public.modalidad_categoria not null default 'singles',
  estado public.estado_torneo not null default 'en_camino',
  periodo text not null,
  club_id smallint references public.clubes (id),
  orden smallint not null default 0,
  creado_at timestamptz not null default now(),
  actualizado_at timestamptz not null default now()
);

comment on table public.torneos is
  'Torneos de la liga. El estado lo mueve el admin: en camino → en progreso → terminado.';

create index torneos_estado_idx on public.torneos (estado, orden desc);

create trigger torneos_actualizado_at
before update on public.torneos
for each row execute function public.tocar_actualizado_at();

create table public.torneo_resultados (
  id uuid primary key default gen_random_uuid(),
  torneo_id uuid not null references public.torneos (id) on delete cascade,
  categoria_id smallint not null references public.categorias (id),
  -- 1 campeón, 2 subcampeón. Alcanza para lo que la liga publica hoy.
  puesto smallint not null check (puesto in (1, 2)),
  -- Un nombre en singles, dos en dobles.
  nombres text[] not null check (array_length(nombres, 1) between 1 and 2),
  -- Opcional: las cuentas de esos tenistas, para enlazar sus fichas.
  profile_ids uuid[],
  creado_at timestamptz not null default now(),
  unique (torneo_id, categoria_id, puesto)
);

comment on table public.torneo_resultados is
  'Campeones y subcampeones de cada cuadro de un torneo. Los carga el admin al terminar.';

-- ----------------------------------------------------------------------- RLS
alter table public.torneos enable row level security;
alter table public.torneo_resultados enable row level security;

revoke all on table public.torneos from anon, authenticated;
grant select on table public.torneos to anon, authenticated;
grant insert, update, delete on table public.torneos to authenticated;

create policy "torneos públicos"
  on public.torneos for select to anon, authenticated using (true);

create policy "solo el admin gestiona torneos"
  on public.torneos for all
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

revoke all on table public.torneo_resultados from anon, authenticated;
grant select on table public.torneo_resultados to anon, authenticated;
grant insert, update, delete on table public.torneo_resultados to authenticated;

create policy "resultados públicos"
  on public.torneo_resultados for select to anon, authenticated using (true);

create policy "solo el admin carga resultados"
  on public.torneo_resultados for all
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

-- ------------------------------------------------------------------ datos
-- Los dos torneos terminados son los que publicó la prensa local. Los campeones
-- van por nombre porque todavía no tienen cuenta en el sitio.
insert into public.torneos (slug, nombre, modalidad, estado, periodo, orden) values
  ('1er-torneo-singles-caballeros-2026', '1° Torneo Singles Caballeros', 'singles', 'terminado', 'Abril 2026', 10),
  ('1er-torneo-singles-damas-2026',      '1° Torneo Singles Damas',      'singles', 'terminado', 'Temporada 2026', 20)
on conflict (slug) do nothing;

insert into public.torneo_resultados (torneo_id, categoria_id, puesto, nombres)
select t.id, c.id, 1, array['Leandro Bordeu']
from public.torneos t, public.categorias c
where t.slug = '1er-torneo-singles-caballeros-2026' and c.slug = 'intermedia-caballeros'
on conflict (torneo_id, categoria_id, puesto) do nothing;

insert into public.torneo_resultados (torneo_id, categoria_id, puesto, nombres)
select t.id, c.id, 1, array['Agustina Díaz']
from public.torneos t, public.categorias c
where t.slug = '1er-torneo-singles-damas-2026' and c.slug = '1ra-damas'
on conflict (torneo_id, categoria_id, puesto) do nothing;
