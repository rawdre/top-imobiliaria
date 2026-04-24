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
   - `assets/top-imobiliaria/supabase-config.js`

Procure por:

- `YOUR_SUPABASE_URL`
- `YOUR_SUPABASE_ANON_KEY`

Esse arquivo é compartilhado pelo site público e pelo painel admin. Assim a configuração fica em um lugar só.

## 2. Criar tabela properties

Execute o arquivo abaixo no SQL Editor do Supabase:

- `supabase/01-schema.sql`

## 3. Criar bucket de imagens

No Supabase Storage, você pode executar:

- `supabase/03-storage-policies.sql`

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

- `supabase/02-rls-policies.sql`

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
5. Selecionar a foto principal na área de miniaturas
6. Definir a situação do cadastro:
   - ativo
   - vendido
   - suspenso
   - inativo
7. Marcar:
   - destaque, se necessário
8. Salvar
9. Validar no site público

## 7.1 Campos importantes do novo cadastro

O formulário do admin agora aceita também:

- `Situação do cadastro`
- `Suítes`
- `DCE`
- checklist de `Detalhes do imóvel`
- seleção de `foto principal`

Exemplos de detalhes já disponíveis no checklist:

- cozinha com armários
- salão de festas
- piscina
- área de lazer
- academia
- churrasqueira
- sauna
- área de serviço
- varanda
- playground
- aceita pet
- vista livre
- elevador
- portaria 24h

Esses campos são gravados na tabela `properties` e também aparecem no detalhamento do imóvel no site público.

## 8. Compatibilidade com o site atual

O site público já tenta buscar da tabela `properties`.

Quando as chaves forem configuradas corretamente:

- o site deixa de usar `sampleProperties`
- passa a usar a base real do Supabase

Além disso:

- a imagem marcada como principal vira a primeira da galeria
- o status do cadastro ajuda a equipe a filtrar imóveis no admin
- suítes, DCE e detalhes do imóvel passam a enriquecer o modal público

## 9. Limitações atuais

Este painel depende de:

- credenciais reais do Supabase
- tabela criada
- bucket criado
- usuário admin criado

Sem isso, ele existe visualmente, mas não autentica nem persiste dados.

## 10. Próximo passo recomendado

Antes de publicar o admin em produção:

1. preencher `assets/top-imobiliaria/supabase-config.js`
2. cadastrar 2 ou 3 imóveis reais
3. validar imagens e listagem no site público
4. só depois decidir se o admin fica no mesmo repo público ou vai para um subdomínio separado
