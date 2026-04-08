# Tech Stack — Munchkin Level Tracker

**Versão:** 1.0
**Data:** 2026-04-08
**Audiencia:** @dev — referencia rapida antes de cada story

---

## 1. Versoes Exatas

### Frontend Web

| Tecnologia | Versao | Role |
|------------|--------|------|
| React | `^19.0.0` | UI framework |
| Vite | `^6.0.0` | Bundler / dev server |
| TypeScript | `^5.5.0` | Linguagem (strict mode) |
| Tailwind CSS | `^4.0.0` | Styling utility-first |
| React Router | `^7.0.0` | Roteamento SPA |
| Zustand | `^5.0.0` | State management |
| @supabase/supabase-js | `^2.45.0` | Client SDK — DB, Auth, Realtime |
| @dnd-kit/core | `^6.1.0` | Drag & Drop base |
| @dnd-kit/sortable | `^8.0.0` | Drag & Drop sortable |
| recharts | `^2.12.0` | Graficos (ProgressChart) |
| @phosphor-icons/react | `^2.1.0` | Iconografia |
| sonner | `^1.7.0` | Toast notifications |
| vitest | `^2.0.0` | Test runner |
| @testing-library/react | `^16.0.0` | Component testing |

### Frontend Mobile

| Tecnologia | Versao | Role |
|------------|--------|------|
| Expo SDK | `~52.0.0` | React Native platform |
| Expo Router | `~4.0.0` | File-based routing (RN) |
| NativeWind | `^4.0.0` | Tailwind para React Native |
| React Native Reanimated | `^3.0.0` | Animacoes no UI thread |
| react-native-draggable-flatlist | `^4.0.0` | Drag & Drop (RN) |
| victory-native | `^41.0.0` | Graficos (RN) |

### Shared Package

| Tecnologia | Versao | Role |
|------------|--------|------|
| TypeScript | `^5.5.0` | Linguagem |
| Zustand | `^5.0.0` | Store compartilhado |
| @supabase/supabase-js | `^2.45.0` | Services compartilhados |

### Backend (BaaS)

| Tecnologia | Versao | Role |
|------------|--------|------|
| Supabase | cloud | PostgreSQL 15 + Auth + Realtime |
| PostgreSQL | `15` | Banco de dados relacional |

### Infra & Tooling

| Tecnologia | Versao | Role |
|------------|--------|------|
| Node.js | `>=18.0.0` | Runtime |
| npm workspaces | bundled | Monorepo |
| GitHub Actions | — | CI/CD |
| Vercel | — | Deploy web |
| EAS Build (Expo) | — | Build mobile |

---

## 2. Comandos de Setup

### Monorepo raiz

```bash
# Instalar todas as dependencias dos workspaces
npm install

# Rodar web em dev
npm run dev --workspace=apps/web

# Rodar mobile em dev
npm run dev --workspace=apps/mobile

# Rodar todos os testes
npm test

# Typecheck em todos os pacotes
npm run typecheck

# Lint em todos os pacotes
npm run lint
```

### apps/web

```bash
# Inicializar (se criando do zero)
npm create vite@latest web -- --template react-ts
cd web
npm install

# Adicionar dependencias
npm install @supabase/supabase-js@^2.45 zustand@^5 react-router@^7
npm install @dnd-kit/core@^6.1 @dnd-kit/sortable@^8
npm install recharts@^2.12 @phosphor-icons/react@^2.1 sonner@^1.7
npm install tailwindcss@^4 @tailwindcss/vite
npm install -D vitest @testing-library/react @testing-library/user-event @vitejs/plugin-react
```

### apps/mobile

```bash
# Inicializar com Expo
npx create-expo-app mobile --template blank-typescript
cd mobile
npx expo install expo-router@~4 nativewind@^4 tailwindcss@^4
npx expo install react-native-reanimated@^3 react-native-draggable-flatlist@^4
npx expo install victory-native@^41
```

### packages/shared

```bash
# Criar pacote compartilhado
mkdir -p packages/shared/src
cd packages/shared
npm init -y

# Instalar dependencias
npm install @supabase/supabase-js@^2.45 zustand@^5
npm install -D typescript@^5.5
```

### Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar projeto local
supabase init

# Aplicar migracoes
supabase db push

# Gerar types TypeScript
supabase gen types typescript --linked > packages/shared/src/database.types.ts
```

---

## 3. Variaveis de Ambiente

### apps/web — `.env.local`

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

> NUNCA commitar `.env.local`. Esta no `.gitignore`.

### Uso no codigo

```typescript
// apps/web/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@munchkin/shared';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### apps/mobile — `app.config.ts`

```typescript
// Expo usa extra.supabaseUrl / extra.supabaseAnonKey
// Definidos via EAS Secrets em producao
extra: {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
}
```

---

## 4. Links de Documentacao

| Tecnologia | Documentacao |
|------------|-------------|
| React 19 | https://react.dev |
| Vite 6 | https://vitejs.dev/guide |
| TypeScript 5 | https://www.typescriptlang.org/docs |
| Tailwind CSS 4 | https://tailwindcss.com/docs |
| React Router v7 | https://reactrouter.com/home |
| Zustand 5 | https://zustand.docs.pmnd.rs |
| Supabase JS v2 | https://supabase.com/docs/reference/javascript |
| Supabase Auth | https://supabase.com/docs/guides/auth |
| Supabase Realtime | https://supabase.com/docs/guides/realtime |
| @dnd-kit | https://docs.dndkit.com |
| Recharts | https://recharts.org/en-US/api |
| Phosphor Icons | https://phosphoricons.com |
| Sonner | https://sonner.emilkowal.ski |
| Expo SDK 52 | https://docs.expo.dev |
| Expo Router v4 | https://docs.expo.dev/router/introduction |
| NativeWind 4 | https://www.nativewind.dev/v4/overview |
| React Native Reanimated 3 | https://docs.swmansion.com/react-native-reanimated |
| Vitest | https://vitest.dev/guide |
| @testing-library/react | https://testing-library.com/docs/react-testing-library/intro |

---

## 5. Decisoes de Nao Usar

| Tecnologia | Motivo do Descarte |
|------------|-------------------|
| **Redux / Redux Toolkit** | Boilerplate excessivo para escopo do projeto. Zustand e 10x menor, sem reducers, sem actions — suficiente para o state de uma partida. |
| **Firebase / Firestore** | PRD define Supabase explicitamente. Firebase nao tem SQL relacional nem Realtime com Postgres Changes. |
| **Next.js** | SSR e desnecessario para um app companion offline-first. Vite tem HMR mais rapido e bundle menor. |
| **MobX** | Complexidade de observables nao justificada. Zustand com mutacao direta e suficiente. |
| **Styled Components / Emotion** | CSS-in-JS tem overhead de runtime. Tailwind 4 com JIT e zero-runtime. |
| **Tanstack Query** | Estado de server simples — Zustand com optimistic update ja cobre o caso. Query cache seria over-engineering para o volume de dados. |
| **Formik / React Hook Form** | Formularios no app sao minimos (nome + cor do jogador). Formulario nativo controlado e suficiente. |
| **AdMob (web)** | Google AdSense e o padrao para web. AdMob e reservado para Android nativo (V2). |
| **GraphQL** | API do Supabase com PostgREST/supabase-js e adequada. GraphQL adicionaria camada sem beneficio. |
| **CRDTs (Yjs, Automerge)** | Conflitos de nivel sao raros em Munchkin (cada jogador controla so o proprio nivel). Last Write Wins e suficiente para V2. |
