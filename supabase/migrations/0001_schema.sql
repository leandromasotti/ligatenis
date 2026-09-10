-- ============================================================================
-- Liga Dolorense de Tenis · esquema base
-- Sprint 1 · Dev B
-- ----------------------------------------------------------------------------
-- Convenciones:
--   * nombres de tablas y columnas en español, snake_case
--   * timestamps `creado_at` / `actualizado_at`
--   * los datos personales sensibles viven en `profiles_privados`, separados de
--     la ficha pública, para que ninguna consulta pública pueda filtrarlos
--   * los cuadros de categoría son DATOS, no código: el nivel es texto libre
--     porque la liga usa 1era a 5ta más Intermedia, y eso puede cambiar
-- ============================================================================

create extension if not exists pgcrypto;
create extension if not exists unaccent;

-- ---------------------------------------------------------------- enumerados
create type public.rol_usuario as enum ('tenista', 'admin');
create type public.estado_perfil as enum ('pendiente', 'aprobado', 'inactivo');
create type public.genero_categoria as enum ('damas', 'caballeros');
create type public.modalidad_categoria as enum ('singles', 'dobles');
create type public.mano_habil as enum ('derecha', 'izquierda');
create type public.tipo_reves as enum ('una_mano', 'dos_manos');
create type public.estado_inscripcion as enum ('activa', 'baja');
create type public.slot_anuncio as enum ('cabecera', 'listado', 'lateral', 'pie');
create type public.tipo_evento_anuncio as enum ('impresion', 'clic');

-- ----------------------------------------------------------------- utilidades
create or replace function public.tocar_actualizado_at()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_at = now();
  return new;
end;
$$;

create or replace function public.slug_desde(p_nombre text, p_apellido text)
returns text
language sql
immutable
set search_path = public, extensions
as $$
  select btrim(
    regexp_replace(
      lower(unaccent(btrim(coalesce(p_nombre, '') || ' ' || coalesce(p_apellido, '')))),
      '[^a-z0-9]+', '-', 'g'
    ),
    '-'
  );
$$;

-- --------------------------------------------------------- clubes y localidades
-- Las sedes donde se juega. La liga es regional: hay tenistas de Dolores,
-- Castelli, Pila, Chascomús y alrededores, así que la localidad del jugador es
-- un dato aparte del club en el que juega.
create table public.clubes (
  id smallint generated always as identity primary key,
  slug text not null unique,
  nombre text not null,
  localidad text not null default 'Dolores',
  es_sede boolean not null default true,
  orden smallint not null default 0,
  activo boolean not null default true
);

comment on table public.clubes is 'Clubes y sedes de la liga. Alimenta el select del perfil del tenista.';

-- ------------------------------------------------------------------- perfiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null default '',
  apellido text not null default '',
  slug text unique,
  foto_url text,
  mano public.mano_habil,
  reves public.tipo_reves,
  club_id smallint references public.clubes (id),
  localidad text,
  bio text,
  instagram text,
  estado public.estado_perfil not null default 'pendiente',
  rol public.rol_usuario not null default 'tenista',
  creado_at timestamptz not null default now(),
  actualizado_at timestamptz not null default now(),
  constraint bio_corta check (bio is null or char_length(bio) <= 500),
  constraint instagram_valido check (instagram is null or instagram ~ '^[A-Za-z0-9._]{1,30}$'),
  -- Un perfil solo se puede aprobar si tiene nombre y apellido cargados.
  constraint completo_para_aprobar check (
    estado <> 'aprobado'
    or (char_length(btrim(nombre)) >= 2 and char_length(btrim(apellido)) >= 2)
  )
);

comment on table public.profiles is 'Ficha pública del tenista. Los datos sensibles van en profiles_privados.';

create index profiles_estado_idx on public.profiles (estado);

create trigger profiles_actualizado_at
before update on public.profiles
for each row execute function public.tocar_actualizado_at();

-- El slug se calcula una sola vez: si el tenista corrige su nombre más adelante,
-- la URL pública que ya circuló sigue funcionando.
create or replace function public.completar_slug()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_base text;
  v_candidato text;
  v_n int := 1;
begin
  if new.slug is not null then
    return new;
  end if;

  v_base := public.slug_desde(new.nombre, new.apellido);
  if v_base = '' then
    return new;
  end if;

  v_candidato := v_base;
  while exists (select 1 from public.profiles p where p.slug = v_candidato and p.id <> new.id) loop
    v_n := v_n + 1;
    v_candidato := v_base || '-' || v_n;
  end loop;

  new.slug := v_candidato;
  return new;
end;
$$;

create trigger profiles_slug
before insert or update of nombre, apellido on public.profiles
for each row execute function public.completar_slug();

create table public.profiles_privados (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  dni text,
  fecha_nacimiento date,
  telefono text,
  direccion text,
  contacto_emergencia text,
  -- Consentimiento explícito para el tratamiento de datos personales (ley 25.326).
  acepto_datos_at timestamptz,
  actualizado_at timestamptz not null default now(),
  constraint dni_valido check (dni is null or dni ~ '^[0-9]{7,9}$'),
  constraint telefono_valido check (telefono is null or telefono ~ '^[0-9 ()+-]{6,25}$')
);

comment on table public.profiles_privados is
  'Datos personales sensibles. Solo el titular y un administrador pueden leerlos. La mayoría de edad se valida en la aplicación: la liga no admite menores.';

create trigger profiles_privados_actualizado_at
before update on public.profiles_privados
for each row execute function public.tocar_actualizado_at();

-- Cada usuario nuevo de auth arranca con su ficha creada y en estado pendiente.
create or replace function public.manejar_nuevo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nombre, apellido)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', ''),
    coalesce(new.raw_user_meta_data ->> 'apellido', '')
  )
  on conflict (id) do nothing;

  insert into public.profiles_privados (profile_id)
  values (new.id)
  on conflict (profile_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.manejar_nuevo_usuario();

-- ----------------------------------------------------- categorías y temporadas
create table public.categorias (
  id smallint generated always as identity primary key,
  slug text not null unique,
  -- Texto y no enum: la liga juega 1era, 2da, 3ra, 4ta, 5ta e Intermedia, y esa
  -- lista la define la organización. Agregar un cuadro es insertar una fila.
  nivel text not null,
  genero public.genero_categoria not null,
  modalidad public.modalidad_categoria not null default 'singles',
  nombre text not null,
  orden smallint not null,
  activa boolean not null default true,
  unique (nivel, genero, modalidad)
);

comment on table public.categorias is
  'Cuadros de la liga: nivel × género × modalidad (singles o dobles). Los administra la organización desde el panel.';

create table public.temporadas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  desde date not null,
  hasta date,
  activa boolean not null default false,
  creado_at timestamptz not null default now(),
  constraint rango_valido check (hasta is null or hasta >= desde)
);

-- No puede haber dos temporadas activas a la vez.
create unique index temporadas_una_sola_activa on public.temporadas (activa) where activa;

create table public.inscripciones (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  categoria_id smallint not null references public.categorias (id),
  temporada_id uuid not null references public.temporadas (id) on delete cascade,
  estado public.estado_inscripcion not null default 'activa',
  creado_at timestamptz not null default now(),
  -- Un tenista juega en un solo cuadro por temporada.
  unique (profile_id, temporada_id)
);

create index inscripciones_cuadro_idx on public.inscripciones (temporada_id, categoria_id);

-- --------------------------------------------------------------------- ranking
create table public.ranking (
  temporada_id uuid not null references public.temporadas (id) on delete cascade,
  categoria_id smallint not null references public.categorias (id),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  posicion smallint not null check (posicion > 0),
  puntos integer not null default 0 check (puntos >= 0),
  partidos_jugados smallint not null default 0 check (partidos_jugados >= 0),
  posicion_anterior smallint check (posicion_anterior is null or posicion_anterior > 0),
  actualizado_at timestamptz not null default now(),
  primary key (temporada_id, categoria_id, profile_id)
);

-- Sin índice único sobre `posicion`: la liga admite empates en la misma posición.
create index ranking_orden_idx on public.ranking (temporada_id, categoria_id, posicion);

comment on table public.ranking is
  'Tabla de posiciones de un cuadro de singles, desacoplada del origen de los puntos: hoy la carga el panel desde el Excel de la liga y en la fase 2 la calculan los puntos de los torneos. Dobles no lleva ranking en esta versión: se juega por torneo.';

create trigger ranking_actualizado_at
before update on public.ranking
for each row execute function public.tocar_actualizado_at();

-- -------------------------------------------------------------- equipo técnico
create table public.equipo_tecnico (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  rol text not null,
  foto_url text,
  bio text,
  orden smallint not null default 0,
  activo boolean not null default true,
  creado_at timestamptz not null default now(),
  actualizado_at timestamptz not null default now(),
  constraint bio_equipo_corta check (bio is null or char_length(bio) <= 800)
);

create trigger equipo_tecnico_actualizado_at
before update on public.equipo_tecnico
for each row execute function public.tocar_actualizado_at();

-- ---------------------------------------------------------------- publicidades
create table public.anuncios (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  imagen_url text not null,
  url_destino text not null,
  slot public.slot_anuncio not null,
  orden smallint not null default 0,
  desde date,
  hasta date,
  activo boolean not null default true,
  creado_at timestamptz not null default now(),
  actualizado_at timestamptz not null default now(),
  constraint vigencia_valida check (desde is null or hasta is null or hasta >= desde),
  constraint destino_http check (url_destino ~* '^https?://')
);

create index anuncios_vigentes_idx on public.anuncios (slot, orden) where activo;

create trigger anuncios_actualizado_at
before update on public.anuncios
for each row execute function public.tocar_actualizado_at();

create table public.anuncios_eventos (
  id bigint generated always as identity primary key,
  anuncio_id uuid not null references public.anuncios (id) on delete cascade,
  tipo public.tipo_evento_anuncio not null,
  creado_at timestamptz not null default now()
);

create index anuncios_eventos_idx on public.anuncios_eventos (anuncio_id, tipo, creado_at);
