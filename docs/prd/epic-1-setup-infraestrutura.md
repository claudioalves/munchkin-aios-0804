# Épico 1 — Setup & Infraestrutura

**ID:** EP-01
**Fase:** MVP
**Pontos:** 14

## Objetivo

Estabelecer toda a base técnica do projeto: monorepo configurado, projeto Supabase provisionado, schema inicial migrado, autenticação anônima funcional, design system base com Tailwind e pipeline de CI/CD operacional. Este épico é o alicerce que todos os demais épicos dependem.

## Stories

| Story ID | Título | Pts |
|----------|--------|-----|
| EP01-S01 | Setup do monorepo e tooling | 3 |
| EP01-S02 | Setup Supabase project | 2 |
| EP01-S03 | Migração inicial do banco | 3 |
| EP01-S04 | Anonymous Auth flow | 2 |
| EP01-S05 | Design System base (Tailwind) | 2 |
| EP01-S06 | CI/CD pipeline | 2 |

## Contexto do PRD

### Requisitos Técnicos (seção 6)

**Backend / Banco de Dados:**
- Cloud-based
- Tempo real (ou quase)
- Plano gratuito utilizável
- Baixa latência
- SDK simples para web + mobile
- **Decisão:** Supabase (PostgreSQL + Realtime + Auth embutido, plano free ideal para MVP)

**Arquitetura:**
- Frontend Web: React
- Frontend Mobile: React Native ou Flutter
- Backend: Supabase (BaaS)
- Realtime: WebSockets via Supabase Realtime

### Tech Stack Definido na Arquitetura

| Camada | Tecnologia |
|--------|-----------|
| Frontend Web | React 19 + Vite 6 + TypeScript 5.5+ |
| Frontend Mobile | React Native via Expo SDK 52 |
| Styling | Tailwind CSS 4 / NativeWind 4 |
| State | Zustand 5 com persist middleware |
| Backend | Supabase (PostgreSQL 15) |
| Auth | Supabase Auth (anônimo) |
| Web Hosting | Vercel |
| Mobile Build | EAS Build (Expo) |
| CI/CD | GitHub Actions |

### Estrutura do Monorepo

```
munchkin-level-tracker/
├── apps/
│   ├── web/          # React 19 + Vite
│   └── mobile/       # React Native + Expo
├── packages/
│   └── shared/       # Código compartilhado (types, services, store)
├── supabase/
│   ├── migrations/
│   └── config.toml
└── package.json      # npm workspaces
```

## Critérios de Aceite do Épico

- [ ] Monorepo com workspaces npm configurado e rodando (`apps/web`, `apps/mobile`, `packages/shared`)
- [ ] `npm run dev` inicia o app web sem erros
- [ ] Projeto Supabase criado com URL e anon key configurados em `.env`
- [ ] Migration `001_initial_schema.sql` aplicada com todas as 4 tabelas (players, games, game_players, level_snapshots)
- [ ] RLS habilitado em todas as tabelas
- [ ] `ensureAnonymousSession()` retorna um `user_id` válido sem tela de login
- [ ] Design system com tokens Tailwind (cores, tipografia, espaçamentos) documentados
- [ ] GitHub Actions executa lint + typecheck + testes em todo PR
- [ ] Deploy automático na Vercel ao fazer merge na branch main

## Dependências

Nenhuma. EP-01 é o ponto de partida de todos os épicos.
