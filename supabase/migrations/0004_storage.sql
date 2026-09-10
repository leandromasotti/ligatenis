-- ============================================================================
-- Liga Dolorense de Tenis · Storage
-- Sprint 1 · Dev B
-- ----------------------------------------------------------------------------
-- Tres buckets públicos de lectura. La escritura está acotada:
--   fotos-perfil → cada tenista solo puede escribir dentro de su carpeta <uid>/
--   equipo, anuncios → solo administradores
-- Límite de 5 MB por archivo y solo imágenes: el recorte y la conversión a WebP
-- se hacen en el navegador antes de subir (sprint 2).
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('fotos-perfil', 'fotos-perfil', true, 5242880,
    array['image/jpeg', 'image/png', 'image/webp']),
  ('equipo', 'equipo', true, 5242880,
    array['image/jpeg', 'image/png', 'image/webp']),
  ('anuncios', 'anuncios', true, 5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

-- ---------------------------------------------------------------- fotos-perfil
create policy "fotos de perfil son públicas"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'fotos-perfil');

create policy "cada tenista sube su foto en su carpeta"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'fotos-perfil'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "cada tenista reemplaza su foto"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'fotos-perfil'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.es_admin())
  );

create policy "cada tenista borra su foto"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'fotos-perfil'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.es_admin())
  );

-- ----------------------------------------------------- equipo técnico y avisos
create policy "imágenes de equipo y anuncios son públicas"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('equipo', 'anuncios'));

create policy "solo el admin sube imágenes de equipo y anuncios"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('equipo', 'anuncios') and public.es_admin());

create policy "solo el admin modifica imágenes de equipo y anuncios"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('equipo', 'anuncios') and public.es_admin());

create policy "solo el admin borra imágenes de equipo y anuncios"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('equipo', 'anuncios') and public.es_admin());
