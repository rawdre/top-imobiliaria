# Top Imobiliária Admin + Supabase

## Decisão de arquitetura

O plano com `server.js`, `properties.json`, uploads locais e sessões em Node não foi seguido.

Motivo: o site público está hospedado em GitHub Pages em [https://rawdre.github.io/top-imobiliaria/](https://rawdre.github.io/top-imobiliaria/), então ele não consegue executar:

- Express
- upload local em disco
- sessões server-side
- banco JSON no servidor

O caminho correto para este projeto é:

- site público estático no GitHub Pages
- painel estático em `/admin`
- autenticação com Supabase Auth
- dados em tabela Postgres `properties`
- imagens no Supabase Storage

Isso preserva a hospedagem atual e remove a necessidade de servidor Node.

## Arquivos do painel

O painel foi criado em:

- `admin/index.html`
- `admin/dashboard.html`
- `admin/properties.html`
- `admin/add-property.html`
- `admin/edit-property.html`
- `admin/api.js`
- `admin/login.js`
- `admin/dashboard.js`
- `admin/properties.js`
- `admin/property-form.js`
- `admin/styles.css`

## 1. Criar projeto Supabase

1. Crie um projeto no Supabase.
2. Copie:
   - `Project URL`
   - `anon public key`
3. Substitua os placeholders em:
   - `admin/api.js`
   - `index.html`

Procure por:

- `YOUR_SUPABASE_URL`
- `YOUR_SUPABASE_ANON_KEY`

## 2. Criar tabela properties

Execute o SQL abaixo no SQL Editor do Supabase:

```sql
create extension if not exists pgcrypto;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  property_type text not null,
  listing_type text not null check (listing_type in ('aluguel', 'venda')),
  price numeric not null default 0,
  gross_price numeric not null default 0,
  punctuality_discount numeric not null default 0,
  condo_fee numeric not null default 0,
  water_notes text,
  area_m2 numeric not null default 0,
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  garage_spaces integer not null default 0,
  address text not null,
  neighborhood text not null,
  condominium_name text,
  description text,
  gallery jsonb not null default '[]'::jsonb,
  gradient text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_properties_listing_type on public.properties (listing_type);
create index if not exists idx_properties_is_active on public.properties (is_active);
create index if not exists idx_properties_is_featured on public.properties (is_featured);
create index if not exists idx_properties_neighborhood on public.properties (neighborhood);
create index if not exists idx_properties_created_at on public.properties (created_at desc);
```

## 3. Criar bucket de imagens

No Supabase Storage:

1. Crie o bucket `property-images`
2. Marque como `Public`

Estrutura usada pelo painel:

- `property-images/properties/<arquivo>`

## 4. Criar usuário administrador

No Supabase Auth:

1. Vá em `Authentication > Users`
2. Crie o usuário admin manualmente
3. Use esse email e senha em `admin/index.html`

## 5. Row Level Security

### Opção prática para MVP

Para o MVP, o mais simples é:

- deixar leitura pública apenas dos imóveis ativos
- permitir escrita apenas para usuários autenticados

Execute:

```sql
alter table public.properties enable row level security;

create policy "Public can read active properties"
on public.properties
for select
to anon, authenticated
using (is_active = true or auth.role() = 'authenticated');

create policy "Authenticated users can insert properties"
on public.properties
for insert
to authenticated
with check (true);

create policy "Authenticated users can update properties"
on public.properties
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete properties"
on public.properties
for delete
to authenticated
using (true);
```

Para o bucket público, configure políticas que permitam:

- leitura pública
- upload/update/delete apenas para autenticados

## 6. Como acessar o painel

URL sugerida depois do publish:

- `https://rawdre.github.io/top-imobiliaria/admin/`

Observação importante:

- eu não recomendo colocar link público para o admin no site principal
- melhor acessar via URL direta

## 7. Fluxo de operação

1. Entrar em `/admin/`
2. Fazer login com Supabase Auth
3. Cadastrar imóvel
4. Enviar imagens
5. Marcar:
   - ativo
   - destaque, se necessário
6. Salvar
7. Validar no site público

## 8. Compatibilidade com o site atual

O site público já tenta buscar da tabela `properties`.

Quando as chaves forem configuradas corretamente:

- o site deixa de usar `sampleProperties`
- passa a usar a base real do Supabase

## 9. Limitações atuais

Este painel depende de:

- credenciais reais do Supabase
- tabela criada
- bucket criado
- usuário admin criado

Sem isso, ele existe visualmente, mas não autentica nem persiste dados.

## 10. Próximo passo recomendado

Antes de publicar o admin em produção:

1. configurar Supabase completo
2. cadastrar 2 ou 3 imóveis reais
3. validar imagens e listagem no site público
4. só depois decidir se o admin fica no mesmo repo público ou vai para um subdomínio separado
