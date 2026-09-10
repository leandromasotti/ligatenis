-- ============================================================================
-- Liga Dolorense de Tenis · Row Level Security
-- Sprint 1 · Dev B
-- ----------------------------------------------------------------------------
-- Regla general:
--   * anon      → lee lo publicado (perfiles aprobados, categorías, ranking,
--                 equipo técnico y anuncios vigentes) y registra impresiones
--   * tenista   → además lee y edita su propio perfil, incluidos sus datos
--                 privados, pero no su estado ni su rol
--   * admin     → todo, con las acciones sensibles vía funciones explícitas
-- ============================================================================

alter table public.clubes enable row level security;
alter table public.profiles enable row level security;
alter table public.profiles_privados enable row level security;
alter table public.categorias enable row level security;
alter table public.temporadas enable row level security;
alter table public.inscripciones enable row level security;
alter table public.ranking enable row level security;
alter table public.equipo_tecnico enable row level security;
alter table public.anuncios enable row level security;
alter table public.anuncios_eventos enable row level security;

-- `security definer` para que la consulta no vuelva a pasar por las políticas de
-- profiles: sin eso, cualquier política que llame a esta función se autorreferencia.
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and rol = 'admin'
  );
$$;

grant execute on function public.es_admin() to anon, authenticated;

-- ------------------------------------------------------------------- profiles
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to anon, authenticated;
grant insert on table public.profiles to authenticated;
-- Column-level: el tenista puede editar su ficha, pero `estado` y `rol` quedan
-- fuera de su alcance. Aprobar o promover se hace con las funciones de abajo.
grant update (nombre, apellido, foto_url, mano, reves, club_id, localidad, bio, instagram)
  on table public.profiles to authenticated;

create policy "perfiles aprobados son públicos"
  on public.profiles for select
  to anon, authenticated
  using (estado = 'aprobado');

create policy "cada uno ve su propio perfil"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "el admin ve todos los perfiles"
  on public.profiles for select
  to authenticated
  using (public.es_admin());

create policy "cada uno crea su propio perfil"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "cada uno edita su propio perfil"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "el admin edita cualquier perfil"
  on public.profiles for update
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

-- ---------------------------------------------------------- profiles_privados
revoke all on table public.profiles_privados from anon, authenticated;
grant select, insert, update on table public.profiles_privados to authenticated;

create policy "datos privados solo del titular o del admin"
  on public.profiles_privados for select
  to authenticated
  using (profile_id = auth.uid() or public.es_admin());

create policy "el titular crea sus datos privados"
  on public.profiles_privados for insert
  to authenticated
  with check (profile_id = auth.uid());

create policy "el titular edita sus datos privados"
  on public.profiles_privados for update
  to authenticated
  using (profile_id = auth.uid() or public.es_admin())
  with check (profile_id = auth.uid() or public.es_admin());

-- --------------------------------------------------------------------- clubes
revoke all on table public.clubes from anon, authenticated;
grant select on table public.clubes to anon, authenticated;
grant insert, update, delete on table public.clubes to authenticated;

create policy "clubes públicos"
  on public.clubes for select to anon, authenticated using (true);

create policy "solo el admin toca clubes"
  on public.clubes for all
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

-- ------------------------------------------------- categorías y temporadas
revoke all on table public.categorias from anon, authenticated;
grant select on table public.categorias to anon, authenticated;
grant insert, update, delete on table public.categorias to authenticated;

create policy "categorías públicas"
  on public.categorias for select to anon, authenticated using (true);

create policy "solo el admin toca categorías"
  on public.categorias for all
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

revoke all on table public.temporadas from anon, authenticated;
grant select on table public.temporadas to anon, authenticated;
grant insert, update, delete on table public.temporadas to authenticated;

create policy "temporadas públicas"
  on public.temporadas for select to anon, authenticated using (true);

create policy "solo el admin toca temporadas"
  on public.temporadas for all
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

-- -------------------------------------------------------------- inscripciones
revoke all on table public.inscripciones from anon, authenticated;
grant select on table public.inscripciones to anon, authenticated;
grant insert on table public.inscripciones to authenticated;
grant update, delete on table public.inscripciones to authenticated;

create policy "inscripciones públicas"
  on public.inscripciones for select to anon, authenticated using (true);

create policy "el tenista declara su categoría"
  on public.inscripciones for insert
  to authenticated
  with check (profile_id = auth.uid());

create policy "solo el admin mueve inscripciones"
  on public.inscripciones for update
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

create policy "solo el admin borra inscripciones"
  on public.inscripciones for delete
  to authenticated
  using (public.es_admin());

-- -------------------------------------------------------------------- ranking
revoke all on table public.ranking from anon, authenticated;
grant select on table public.ranking to anon, authenticated;
grant insert, update, delete on table public.ranking to authenticated;

create policy "ranking público"
  on public.ranking for select to anon, authenticated using (true);

create policy "solo el admin carga el ranking"
  on public.ranking for all
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

-- ------------------------------------------------------------- equipo técnico
revoke all on table public.equipo_tecnico from anon, authenticated;
grant select on table public.equipo_tecnico to anon, authenticated;
grant insert, update, delete on table public.equipo_tecnico to authenticated;

create policy "equipo técnico activo es público"
  on public.equipo_tecnico for select
  to anon, authenticated
  using (activo or public.es_admin());

create policy "solo el admin edita el equipo técnico"
  on public.equipo_tecnico for all
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

-- --------------------------------------------------------------- publicidades
revoke all on table public.anuncios from anon, authenticated;
grant select on table public.anuncios to anon, authenticated;
grant insert, update, delete on table public.anuncios to authenticated;

create policy "anuncios vigentes son públicos"
  on public.anuncios for select
  to anon, authenticated
  using (
    public.es_admin()
    or (
      activo
      and (desde is null or desde <= current_date)
      and (hasta is null or hasta >= current_date)
    )
  );

create policy "solo el admin gestiona anuncios"
  on public.anuncios for all
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

revoke all on table public.anuncios_eventos from anon, authenticated;
grant select on table public.anuncios_eventos to authenticated;
grant insert on table public.anuncios_eventos to anon, authenticated;

create policy "cualquiera registra impresiones y clics"
  on public.anuncios_eventos for insert
  to anon, authenticated
  with check (true);

create policy "solo el admin lee las métricas"
  on public.anuncios_eventos for select
  to authenticated
  using (public.es_admin());

-- ------------------------------------------------- acciones sensibles de admin
-- Van por función para que `estado` y `rol` nunca sean editables por el titular.
create or replace function public.admin_cambiar_estado_perfil(
  p_profile_id uuid,
  p_estado public.estado_perfil
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede cambiar el estado de un perfil';
  end if;

  update public.profiles set estado = p_estado where id = p_profile_id;
end;
$$;

create or replace function public.admin_cambiar_rol(
  p_profile_id uuid,
  p_rol public.rol_usuario
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.es_admin() then
    raise exception 'Solo un administrador puede cambiar roles';
  end if;

  if p_rol = 'tenista' and p_profile_id = auth.uid() then
    raise exception 'No podés quitarte a vos mismo el rol de administrador';
  end if;

  update public.profiles set rol = p_rol where id = p_profile_id;
end;
$$;

grant execute on function public.admin_cambiar_estado_perfil(uuid, public.estado_perfil)
  to authenticated;
grant execute on function public.admin_cambiar_rol(uuid, public.rol_usuario)
  to authenticated;
