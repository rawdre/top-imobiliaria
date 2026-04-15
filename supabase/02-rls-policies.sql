alter table public.properties enable row level security;

drop policy if exists "Public can read active properties" on public.properties;
create policy "Public can read active properties"
on public.properties
for select
to anon, authenticated
using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated users can insert properties" on public.properties;
create policy "Authenticated users can insert properties"
on public.properties
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update properties" on public.properties;
create policy "Authenticated users can update properties"
on public.properties
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete properties" on public.properties;
create policy "Authenticated users can delete properties"
on public.properties
for delete
to authenticated
using (true);

