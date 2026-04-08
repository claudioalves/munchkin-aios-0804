# Source Tree — Munchkin Level Tracker

**Versao:** 1.0
**Data:** 2026-04-08
**Audiencia:** @dev — referencia para localizacao e criacao de arquivos

---

## 1. Arvore Completa do Monorepo

```
munchkin-level-tracker/
│
├── apps/
│   │
│   ├── web/                              # SPA React 19 + Vite (browser)
│   │   ├── public/                       # Assets estaticos (favicon, robots.txt)
│   │   ├── src/
│   │   │   ├── app/                      # Rotas (React Router v7 — layout files)
│   │   │   │   ├── layout.tsx            # Layout raiz — AppHeader, outlets
│   │   │   │   ├── page.tsx              # Rota /  — Menu Principal
│   │   │   │   ├── new-game/
│   │   │   │   │   └── page.tsx          # Rota /new-game — Stepper de novo jogo
│   │   │   │   └── game/
│   │   │   │       └── page.tsx          # Rota /game — Tela de partida ativa
│   │   │   │
│   │   │   ├── components/               # Componentes UI reutilizaveis
│   │   │   │   ├── AdBanner/
│   │   │   │   │   ├── AdBanner.tsx      # Banner do Google AdSense
│   │   │   │   │   └── index.ts          # Re-export padrao
│   │   │   │   ├── AppHeader/
│   │   │   │   │   ├── AppHeader.tsx     # Header global com titulo e icones de acao
│   │   │   │   │   └── index.ts
│   │   │   │   ├── EpicModeToggle/
│   │   │   │   │   ├── EpicModeToggle.tsx # Toggle ON/OFF para Modo Epico
│   │   │   │   │   └── index.ts
│   │   │   │   ├── HoldButton/
│   │   │   │   │   ├── HoldButton.tsx    # Botao com hold 3s para finalizar partida
│   │   │   │   │   └── index.ts
│   │   │   │   ├── LevelButton/
│   │   │   │   │   ├── LevelButton.tsx   # Botao +/- com feedback tatil
│   │   │   │   │   ├── LevelButton.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── NarratorButton/
│   │   │   │   │   ├── NarratorButton.tsx # Toggle TTS (narrar niveis)
│   │   │   │   │   └── index.ts
│   │   │   │   ├── PlayerCard/
│   │   │   │   │   ├── PlayerCard.tsx    # Card principal do jogador (nivel em destaque)
│   │   │   │   │   ├── PlayerCard.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── PlayerGrid/
│   │   │   │   │   ├── PlayerGrid.tsx    # Grid responsivo de PlayerCards
│   │   │   │   │   ├── PlayerGrid.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── ProgressChart/
│   │   │   │   │   ├── ProgressChart.tsx # Modal com Recharts LineChart
│   │   │   │   │   └── index.ts
│   │   │   │   ├── QuickAddPlayer/
│   │   │   │   │   ├── QuickAddPlayer.tsx # Inline: cadastrar jogador rapido no stepper
│   │   │   │   │   └── index.ts
│   │   │   │   └── SortDropdown/
│   │   │   │       ├── SortDropdown.tsx  # Dropdown: level-desc / random / custom
│   │   │   │       └── index.ts
│   │   │   │
│   │   │   ├── hooks/                    # Hooks React exclusivos da camada web
│   │   │   │   ├── useAutoSave.ts        # Debounce de saves automaticos no Supabase
│   │   │   │   ├── useRealtime.ts        # Subscricao Supabase Realtime (V2)
│   │   │   │   ├── useSnapshotTimer.ts   # Timer de 15min para level_snapshots
│   │   │   │   └── useTTS.ts             # Web Speech API — narrar niveis
│   │   │   │
│   │   │   ├── lib/
│   │   │   │   └── supabase.ts           # Instancia do supabase client tipada
│   │   │   │
│   │   │   ├── styles/
│   │   │   │   └── globals.css           # CSS custom properties (tokens do design system)
│   │   │   │
│   │   │   └── main.tsx                  # Entry point — ReactDOM.createRoot
│   │   │
│   │   ├── index.html                    # Template HTML do Vite
│   │   ├── vite.config.ts                # Config Vite: alias @/, plugin react
│   │   ├── tsconfig.json                 # TypeScript config (extends base)
│   │   └── package.json                  # Dependencias do app web
│   │
│   └── mobile/                           # App React Native (Expo SDK 52)
│       ├── app/                          # Rotas Expo Router v4 (file-based)
│       │   ├── _layout.tsx               # Layout raiz — NavigationContainer
│       │   ├── index.tsx                 # Tela / — Menu Principal
│       │   ├── new-game.tsx              # Tela /new-game — Stepper
│       │   └── game.tsx                  # Tela /game — Partida ativa
│       ├── components/                   # Componentes especificos do mobile
│       ├── app.config.ts                 # Config Expo (env vars, permissions)
│       ├── babel.config.js               # Babel config (NativeWind, Reanimated)
│       └── package.json
│
├── packages/
│   └── shared/                           # Codigo compartilhado web + mobile
│       └── src/
│           ├── types.ts                  # Tipos TypeScript de dominio (Player, Game, etc.)
│           ├── constants.ts              # Constantes globais (MAX_PLAYERS, SNAPSHOT_INTERVAL_MS)
│           ├── database.types.ts         # Auto-gerado: supabase gen types typescript
│           ├── services/                 # Supabase service functions
│           │   ├── auth.ts               # ensureAnonymousSession()
│           │   ├── players.ts            # getPlayers, createPlayer, deletePlayer
│           │   ├── games.ts              # createGame, getActiveGame, finishGame
│           │   ├── levels.ts             # updateLevel, captureSnapshot, getSnapshots
│           │   └── realtime.ts           # subscribeToGameLevels (V2)
│           └── store/
│               └── gameStore.ts          # Zustand store com persist middleware
│       ├── package.json                  # { "name": "@munchkin/shared" }
│       └── tsconfig.json
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql        # Tabelas: players, games, game_players, level_snapshots
│   │   ├── 002_rls_policies.sql          # Row Level Security policies
│   │   └── 003_db_functions.sql          # Triggers e functions (check_level_limit, etc.)
│   └── config.toml                       # Config do Supabase CLI (project ref, etc.)
│
├── docs/
│   ├── architecture/
│   │   └── fullstack-architecture.md     # Decisoes tecnicas, schema, fluxos
│   ├── framework/
│   │   ├── tech-stack.md                 # Versoes, setup, links de docs
│   │   ├── coding-standards.md           # Convencoes, patterns, proibicoes
│   │   └── source-tree.md                # Este arquivo — mapa de diretorios
│   ├── front-end-spec.md                 # Design system, wireframes, tokens visuais
│   └── stories/                          # Stories de desenvolvimento (EP01-S01, etc.)
│
├── .github/
│   └── workflows/
│       ├── ci.yml                        # Lint + typecheck + testes no PR
│       └── deploy.yml                    # Deploy automatico no merge para main
│
├── package.json                          # npm workspaces root
├── tsconfig.base.json                    # TypeScript config base (shared entre pacotes)
└── .env.example                          # Template de variaveis de ambiente (sem valores)
```

---

## 2. Convencao de Criacao de Arquivos

### Novo componente React (web)

**Destino:** `apps/web/src/components/<NomeDoComponente>/`

```bash
# Criar pasta e arquivos minimos
mkdir apps/web/src/components/NovoComponente
touch apps/web/src/components/NovoComponente/NovoComponente.tsx
touch apps/web/src/components/NovoComponente/index.ts
# Testes se o componente tiver logica interativa:
touch apps/web/src/components/NovoComponente/NovoComponente.test.tsx
```

**Conteudo do `index.ts`:**
```typescript
export { default } from './NovoComponente';
export type { NovoComponenteProps } from './NovoComponente';
```

### Novo hook (web)

**Destino:** `apps/web/src/hooks/useNomeDoHook.ts`

```bash
touch apps/web/src/hooks/useNomeDoHook.ts
touch apps/web/src/hooks/useNomeDoHook.test.ts
```

### Novo service (shared — acesso ao Supabase)

**Destino:** `packages/shared/src/services/nomeDoServico.ts`

```bash
touch packages/shared/src/services/nomeDoServico.ts
touch packages/shared/src/services/nomeDoServico.test.ts
```

### Nova migration SQL

**Destino:** `supabase/migrations/`

**Nomenclatura:** `NNN_descricao_curta.sql` (NNN = numero sequencial zero-padded)

```bash
# Exemplo
touch supabase/migrations/004_add_player_avatar.sql
```

Aplicar apos criar:
```bash
supabase db push
```

### Novo tipo de dominio

**Destino:** `packages/shared/src/types.ts`

Adicionar interface ou type ao arquivo existente. Nao criar arquivos de tipo separados por entidade.

### Nova constante global

**Destino:** `packages/shared/src/constants.ts`

```typescript
// Formato: UPPER_SNAKE_CASE exportado nomeadamente
export const SNAPSHOT_INTERVAL_MS = 15 * 60 * 1000;
export const MAX_PLAYERS = 6;
export const MIN_PLAYERS = 2;
```

---

## 3. Como Importar do Package Shared

O package shared e referenciado pelo nome `@munchkin/shared` (definido em `packages/shared/package.json`).

```typescript
// Tipos de dominio
import type { Player, Game, GamePlayer, LevelSnapshot } from '@munchkin/shared';

// Constantes
import { MAX_PLAYERS, SNAPSHOT_INTERVAL_MS } from '@munchkin/shared';

// Zustand store
import { useGameStore } from '@munchkin/shared';

// Services
import { playersService } from '@munchkin/shared';
import { gamesService } from '@munchkin/shared';
import { levelsService } from '@munchkin/shared';

// Types do banco (auto-gerados)
import type { Database } from '@munchkin/shared';
```

**Regra:** nunca importar diretamente por caminho relativo cross-package:

```typescript
// ERRADO
import type { Player } from '../../packages/shared/src/types';

// CORRETO
import type { Player } from '@munchkin/shared';
```

---

## 4. Resolucao de Alias por Pacote

| Pacote | Alias disponivel | Exemplo de uso |
|--------|-----------------|----------------|
| `apps/web` | `@/` → `src/` | `import { PlayerCard } from '@/components/PlayerCard'` |
| `apps/web` | `@munchkin/shared` | `import type { Game } from '@munchkin/shared'` |
| `apps/mobile` | `@munchkin/shared` | `import { useGameStore } from '@munchkin/shared'` |
| `packages/shared` | — | Usa paths relativos internos |

---

## 5. Regras de Camada

O projeto segue separacao estrita de responsabilidades:

| Camada | Onde mora | O que faz | O que NAO faz |
|--------|-----------|-----------|---------------|
| **View** | `apps/web/src/components/` | Renderiza UI, dispara eventos | Chama Supabase diretamente |
| **Hook** | `apps/web/src/hooks/` | Orquestra state, efeitos, subscricoes | Contem logica de negocios pura |
| **Store** | `packages/shared/src/store/` | Estado global, optimistic updates | Renderiza JSX |
| **Service** | `packages/shared/src/services/` | Chama Supabase, retorna dados | Conhece componentes ou hooks |
| **Types** | `packages/shared/src/types.ts` | Define contratos de dado | Contem logica |
| **Constants** | `packages/shared/src/constants.ts` | Valores fixos nomeados | Contem logica |

Fluxo de dados:
```
Component → Hook → Store → Service → Supabase
                    ↑
              (state update)
```
