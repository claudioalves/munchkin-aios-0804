# Coding Standards — Munchkin Level Tracker

**Versao:** 1.0
**Data:** 2026-04-08
**Audiencia:** @dev — carregar antes de cada story

---

## 1. Linguagem

**TypeScript strict mode obrigatorio em todos os pacotes.**

```json
// tsconfig.json — base obrigatoria
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

Nunca usar `any` sem comentario inline justificando:

```typescript
// PROIBIDO
const data: any = response.data;

// PERMITIDO com justificativa obrigatoria
// eslint-disable-next-line @typescript-eslint/no-explicit-any — API externa sem types
const legacyPayload = response.data as any;
```

---

## 2. Naming Conventions

| Tipo | Convencao | Exemplo |
|------|-----------|---------|
| Componentes React | `PascalCase` | `PlayerCard`, `LevelButton`, `AppHeader` |
| Hooks customizados | `camelCase` com prefixo `use` | `useGameStore`, `useTTS`, `useAutoSave` |
| Services / utilitarios | `camelCase` | `playersService`, `gamesService`, `levelsService` |
| Constantes globais | `UPPER_SNAKE_CASE` | `MAX_PLAYERS`, `SNAPSHOT_INTERVAL_MS`, `DEFAULT_SORT_MODE` |
| Tipos e Interfaces | `PascalCase` | `Player`, `Game`, `GamePlayer`, `LevelSnapshot` |
| Enums | `PascalCase` membros `PascalCase` | `SortMode.LevelDesc`, `GameStatus.Active` |
| Arquivos de componente | `PascalCase` | `PlayerCard.tsx`, `LevelButton.tsx` |
| Arquivos de hook | `camelCase` | `useGameStore.ts`, `useTTS.ts` |
| Arquivos de service | `camelCase` | `players.ts`, `games.ts`, `levels.ts` |
| Arquivos de teste | `.test.tsx` ou `.test.ts` | `PlayerCard.test.tsx`, `useGameStore.test.ts` |

---

## 3. Estrutura de Componentes

Todo componente segue este padrao:

```typescript
// apps/web/src/components/PlayerCard/PlayerCard.tsx

import { type FC } from 'react';

// 1. Interface de props — sempre exportada para testes
export interface PlayerCardProps {
  playerId: string;
  name: string;
  level: number;
  color: string;
  isLeader: boolean;
  onLevelChange: (delta: 1 | -1) => void;
}

// 2. JSDoc opcional — apenas para props nao-obvias
/**
 * Card de jogador na tela de partida.
 * Exibe nivel em destaque e botoes de incremento/decremento.
 */
const PlayerCard: FC<PlayerCardProps> = ({
  playerId,
  name,
  level,
  color,
  isLeader,
  onLevelChange,
}) => {
  // logica interna...

  return (
    // JSX...
  );
};

// 3. Export default sempre ao final
export default PlayerCard;
```

Regras adicionais:
- Componentes com subcomponentes ficam em pasta propria: `PlayerCard/index.tsx`, `PlayerCard/PlayerCard.tsx`, `PlayerCard/PlayerCard.test.tsx`
- Props interfaces nao usam o sufixo `I` (ex: `PlayerCardProps`, nao `IPlayerCardProps`)
- Evitar componentes com mais de 200 linhas — extrair sub-componentes

---

## 4. Error Handling

**Regra: nunca engolir erros silenciosamente.**

### Services (Supabase)

```typescript
// packages/shared/src/services/players.ts

export async function createPlayer(name: string, color: string): Promise<Player> {
  const { data, error } = await supabase
    .from('players')
    .insert({ name, color })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create player "${name}": ${error.message}`);
  }

  return data;
}
```

### Hooks / Store actions

```typescript
// Optimistic update com rollback explicito
updateLevel: (gamePlayerId, delta) => {
  const previous = get().gamePlayers;

  // Optimistic update
  set(state => ({ ... }));

  levelsService.updateLevel(gamePlayerId, newLevel).catch((err) => {
    // Rollback com mensagem descritiva
    console.error('[useGameStore] updateLevel rollback:', err);
    set({ gamePlayers: previous });
    // Notificar usuario via toast
    toast.error('Nao foi possivel salvar o nivel. Tente novamente.');
  });
},
```

### Componentes

```typescript
// try/catch em event handlers async
const handleFinishGame = async () => {
  try {
    await gamesService.finishGame(activeGame.id);
    navigate('/');
  } catch (err) {
    console.error('[GamePage] finishGame error:', err);
    toast.error('Erro ao finalizar partida. Tente novamente.');
  }
};
```

Regras:
- `console.error` com prefixo `[NomeDoContexto]` para rastrear origem
- Sempre exibir feedback ao usuario via `sonner/toast` em erros de UI
- `console.log` **proibido em producao** — apenas durante desenvolvimento (remover antes de commit)

---

## 5. Imports — Path Aliases

**Regra: sempre usar imports absolutos via path alias. Nunca `../../` com mais de 1 nivel.**

### Aliases configurados

| Alias | Resolve para | Quando usar |
|-------|-------------|-------------|
| `@/` | `apps/web/src/` | Dentro de `apps/web` |
| `@shared/` | `packages/shared/src/` | Acesso ao shared package (alternativa ao package import) |
| `@munchkin/shared` | `packages/shared` | Import do package (preferido) |

### Configuracao no Vite

```typescript
// apps/web/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Exemplos de uso

```typescript
// CORRETO — import absoluto
import { PlayerCard } from '@/components/PlayerCard';
import { useGameStore } from '@/hooks/useGameStore';
import { gamesService } from '@/services/games';
import type { Player, Game } from '@munchkin/shared';
import { SNAPSHOT_INTERVAL_MS } from '@munchkin/shared';

// ERRADO — import relativo profundo
import { PlayerCard } from '../../../components/PlayerCard';
import type { Player } from '../../../../../../packages/shared/src/types';
```

---

## 6. Testing

### Stack

- **Runner:** Vitest
- **Componentes:** `@testing-library/react` + `@testing-library/user-event`
- **Mocks:** `vi.mock()` do Vitest (nao jest.mock)
- **Assertions:** `@testing-library/jest-dom`

### Localizacao dos arquivos

```
apps/web/src/components/PlayerCard/
├── PlayerCard.tsx
├── PlayerCard.test.tsx     ← ao lado do componente
└── index.ts

apps/web/src/hooks/
├── useGameStore.ts
└── useGameStore.test.ts    ← ao lado do hook

packages/shared/src/services/
├── players.ts
└── players.test.ts         ← ao lado do service
```

### Padrao de teste de componente

```typescript
// PlayerCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import PlayerCard, { type PlayerCardProps } from './PlayerCard';

const defaultProps: PlayerCardProps = {
  playerId: 'uuid-1',
  name: 'Claudio',
  level: 5,
  color: '#c9943a',
  isLeader: false,
  onLevelChange: vi.fn(),
};

describe('PlayerCard', () => {
  it('exibe o nivel do jogador', () => {
    render(<PlayerCard {...defaultProps} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('chama onLevelChange com +1 ao clicar em incrementar', async () => {
    const onLevelChange = vi.fn();
    render(<PlayerCard {...defaultProps} onLevelChange={onLevelChange} />);
    await userEvent.click(screen.getByRole('button', { name: /incrementar/i }));
    expect(onLevelChange).toHaveBeenCalledWith(1);
  });
});
```

### Cobertura minima

| Tipo | Cobertura esperada |
|------|--------------------|
| Services (Supabase calls) | 80% statements |
| Hooks customizados | 70% statements |
| Componentes de UI criticos | Smoke test + interacoes principais |
| Utilitarios / helpers | 90% statements |

---

## 7. Git — Conventional Commits

**Formato:** `<tipo>(<escopo>): <descricao> [Story-ID]`

### Tipos

| Tipo | Quando usar |
|------|------------|
| `feat` | Nova funcionalidade |
| `fix` | Correcao de bug |
| `chore` | Manutencao, configs, deps |
| `docs` | Documentacao |
| `test` | Adicionar ou corrigir testes |
| `refactor` | Refatoracao sem mudanca de comportamento |
| `style` | Formatacao, espacos (nao logica) |
| `perf` | Melhoria de performance |

### Escopos recomendados

`web`, `mobile`, `shared`, `supabase`, `ci`, `deps`

### Exemplos

```
feat(web): add PlayerCard component [EP04-S01]
fix(shared): rollback level on Supabase error [EP05-S02]
chore(deps): update @supabase/supabase-js to 2.45.4
test(web): add PlayerCard interaction tests [EP04-S01]
docs: update coding-standards with testing section
```

### Regras

- Um commit por story task completada (nao um commit gigante por story)
- Incluir Story ID `[EP0X-S0X]` em `feat` e `fix`
- Mensagem em ingles
- Subject line: maximo 72 caracteres
- Sem ponto final no subject

---

## 8. Proibicoes Explicitas

| Proibido | Motivo | Alternativa |
|----------|--------|-------------|
| `any` sem comentario justificando | Quebra type safety end-to-end | Tipo correto ou `unknown` com type guard |
| `console.log` em codigo de producao | Polui logs e pode vazar dados | Remover antes de commit; usar `console.error` com prefixo para erros reais |
| `.env` ou `.env.local` commitados | Exposicao de credenciais | Usar `.gitignore`; documentar variaveis em `.env.example` |
| `// @ts-ignore` sem justificativa | Mascara erros de tipo | Corrigir o tipo ou usar `// @ts-expect-error — <razao>` |
| `import *` (namespace import) | Piora tree-shaking | Named imports: `import { foo } from '...'` |
| `export default` em services e hooks (apenas componentes) | Dificulta refactor e auto-import | `export const myService = ...` |
| Mutacao direta de state fora do Zustand store | Quebra reatividade | Usar `set()` do Zustand |
| Fetch direto ao Supabase dentro de componentes | Viola separacao de camadas | Sempre via service function em `packages/shared/src/services/` |
| Logica de negocios em componentes | Mistura view e logica | Extrair para hook ou service |
| Magic numbers sem constante nomeada | Ilegivel, dificil de manter | Definir em `packages/shared/src/constants.ts` |

---

## 9. Formatacao e Linting

### Ferramentas

- **ESLint** com `@typescript-eslint` + `eslint-plugin-react-hooks`
- **Prettier** para formatacao automatica

### Configuracao base do ESLint

```js
// eslint.config.js
export default [
  { rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': ['error', { allow: ['error', 'warn'] }],
  }}
];
```

### Executar antes de cada commit

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # Vitest
```
