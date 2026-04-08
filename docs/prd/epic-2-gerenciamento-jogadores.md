# Épico 2 — Gerenciamento de Jogadores

**ID:** EP-02
**Fase:** MVP
**Pontos:** 10

## Objetivo

Permitir que o usuário crie e gerencie sua lista de jogadores cadastrados, com nome, cor identificadora e avatar. Os jogadores cadastrados ficam disponíveis para seleção ao iniciar um novo jogo. Inclui também o fluxo de cadastro rápido inline na tela de seleção de jogadores.

## Stories

| Story ID | Título | Pts |
|----------|--------|-----|
| EP02-S01 | Tela de Gestão de Jogadores | 3 |
| EP02-S02 | Cadastro de jogador | 3 |
| EP02-S03 | Remoção de jogador | 2 |
| EP02-S04 | Cadastro rápido inline (New Game) | 2 |

## Contexto do PRD

### Menu Principal — Cadastro de Jogadores (seção 5.1)

O menu deve conter o item **Cadastro de Jogadores** com os seguintes campos:
- Nome
- Avatar
- Cor identificadora

### Fluxo de Novo Jogo — Seleção de Jogadores (seção 5.2)

- Lista de jogadores cadastrados
- Opção de cadastro rápido inline

### Schema de Banco (players)

```sql
CREATE TABLE public.players (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id   UUID NOT NULL DEFAULT auth.uid(),
    name       TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 30),
    color      TEXT NOT NULL CHECK (color ~ '^#[0-9a-fA-F]{6}$'),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### API de Players (services/players.ts)

```typescript
getPlayers(): Promise<Player[]>
createPlayer(name: string, color: string): Promise<Player>
deletePlayer(id: string): Promise<void>
```

### Segurança

RLS com isolamento por `owner_id`: cada usuário (anonymous session) vê apenas seus próprios jogadores. Validações no DB: nome entre 1-30 chars, cor em formato hex `#RRGGBB`.

## Critérios de Aceite do Épico

- [ ] Tela de gestão exibe lista de jogadores do usuário autenticado
- [ ] Formulário de cadastro com campos: nome (obrigatório, máx 30 chars), cor (color picker hex), avatar (opcional)
- [ ] Jogador criado aparece imediatamente na lista (optimistic UI ou reload)
- [ ] Jogador pode ser removido com confirmação
- [ ] Remoção de jogador não afeta partidas históricas (ON DELETE CASCADE apenas em game_players e snapshots)
- [ ] Cadastro rápido inline disponível na tela de Novo Jogo sem sair do fluxo
- [ ] Validação de campos com mensagens de erro claras
- [ ] Estado persiste via Supabase (sobrevive a reload/fechar app)

## Dependências

- **EP-01** — Setup & Infraestrutura (Supabase provisionado, Auth anônimo, schema migrado, design system)
