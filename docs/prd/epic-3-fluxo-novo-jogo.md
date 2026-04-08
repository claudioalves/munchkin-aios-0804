# Épico 3 — Fluxo de Novo Jogo

**ID:** EP-03
**Fase:** MVP
**Pontos:** 13

## Objetivo

Implementar o Menu Principal e o fluxo de criação de nova partida: stepper com seleção de jogadores (mínimo 2, máximo 6), configuração do Modo Épico, criação do registro de jogo no Supabase e navegação para a tela de partida. Inclui também o fluxo de "Continuar Partida" para restaurar uma partida ativa.

## Stories

| Story ID | Título | Pts |
|----------|--------|-----|
| EP03-S01 | Menu Principal | 3 |
| EP03-S02 | Stepper Step 1 — Seleção de Jogadores | 3 |
| EP03-S03 | Stepper Step 2 — Configuração Modo Épico | 2 |
| EP03-S04 | Criar Game no Supabase | 3 |
| EP03-S05 | Continuar Partida | 2 |

## Contexto do PRD

### Menu Principal (seção 5.1)

O menu deve conter:

- **Cadastro de Jogadores** — navega para tela de gestão
- **Novo Jogo** — inicia o stepper
- **Continuar Partida** — visível apenas se houver jogo salvo, deve restaurar estado completo
- **Regras (PDF)** — link para PDF das regras
- **Dúvidas (NotebookLM)** — link externo
- **Configurações** — seleção de voz do narrador
- **Espaço para anúncios** — integração com AdSense

### Fluxo de Novo Jogo (seção 5.2)

#### Step 1 — Seleção de Jogadores
- Lista de jogadores cadastrados
- Opção de cadastro rápido inline

#### Step 2 — Configuração de Partida
- Checkbox: **Modo Épico**
  - OFF: Nível máximo 10, Vitória em 11
  - ON: Nível máximo 20, Vitória em 21

### Fluxo Principal (arquitetura)

```
Menu Principal → Novo Jogo
→ Selecionar Jogadores (min 2 / max 6)
→ Configurar Modo Épico ON/OFF
→ Criar Game no Supabase
→ Tela de Partida

Menu Principal → Continuar Partida
→ Restaurar Estado do Supabase/Local
→ Tela de Partida
```

### API de Games

```typescript
createGame(playerIds: string[], epicMode: boolean): Promise<Game>
// Cria registro em games + N registros em game_players (level=1, position=index)

getActiveGame(): Promise<GameWithPlayers | null>
// SELECT * FROM games WHERE status='active' + game_players + players
```

### Schema games

```sql
-- max_level e victory_level são computed columns (sem lógica no frontend)
epic_mode = false → max_level = 10, victory_level = 11
epic_mode = true  → max_level = 20, victory_level = 21

-- Constraint: apenas 1 partida ativa por owner
CREATE UNIQUE INDEX idx_games_active_owner ON public.games (owner_id) WHERE status = 'active';
```

### Monetização no Menu

- Banner AdSense na área de anúncios do Menu Principal
- Nenhum ad na tela de partida

## Critérios de Aceite do Épico

- [ ] Menu Principal renderiza todos os itens especificados no PRD
- [ ] Botão "Continuar Partida" visível apenas quando existe `status='active'` no Supabase/localStorage
- [ ] Stepper Step 1: lista jogadores cadastrados, permite selecionar 2-6, habilita cadastro rápido inline
- [ ] Stepper Step 2: toggle Modo Épico com feedback visual dos limites (10 vs 20)
- [ ] Ao confirmar, `createGame()` cria game + game_players no Supabase e navega para `/game`
- [ ] Continuar Partida restaura estado completo (jogadores, níveis, posições, modo épico)
- [ ] Fluxo completo funciona offline (localStorage como fallback)
- [ ] AdSense banner carrega no Menu Principal sem bloquear a UI

## Dependências

- **EP-01** — Setup & Infraestrutura (Supabase, Auth, schema, design system)
- **EP-02** — Gerenciamento de Jogadores (lista de jogadores disponíveis para seleção)
