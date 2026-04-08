# Épico 7 — Gráfico de Progresso

**ID:** EP-07
**Fase:** V1
**Pontos:** 8

## Objetivo

Implementar a visualização de linha do tempo dos níveis dos jogadores durante a partida, com coleta automática de snapshots a cada 15 minutos e exibição em modal com gráfico de linhas (Recharts na web, Victory Native no mobile).

## Stories

| Story ID | Título | Pts |
|----------|--------|-----|
| EP07-S01 | Timer de snapshots (15min) | 2 |
| EP07-S02 | Modal ProgressChart (Recharts) | 5 |
| EP07-S03 | Botão de gráfico na barra | 1 |

## Contexto do PRD

### Tela de Partida — Gráfico de Progresso (seção 5.3)

- Linha do tempo dos níveis
- Atualização automática a cada 15 minutos

### Objetivos Secundários (seção 3)

- Criar diferenciação com features imersivas (narração, gráfico)

### Schema — level_snapshots

```sql
CREATE TABLE public.level_snapshots (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id     UUID NOT NULL REFERENCES public.games (id) ON DELETE CASCADE,
    player_id   UUID NOT NULL REFERENCES public.players (id) ON DELETE CASCADE,
    level       INT NOT NULL CHECK (level >= 1),
    captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_snapshots_game_time
    ON public.level_snapshots (game_id, captured_at);
```

Série temporal imutável — não polui o estado atual do game.

### API de Snapshots

```typescript
captureSnapshot(gameId: string, players: GamePlayer[]): Promise<void>
// INSERT em level_snapshots para todos os jogadores da partida

getSnapshots(gameId: string): Promise<LevelSnapshot[]>
// SELECT * ORDER BY captured_at ASC para alimentar o gráfico
```

### Timer de Snapshot (Hook useSnapshotTimer)

```typescript
useEffect(() => {
    if (!activeGame) return;
    captureSnapshot(activeGame.id, gamePlayers); // snapshot inicial ao entrar na tela

    const interval = setInterval(() => {
        captureSnapshot(activeGame.id, gamePlayers);
    }, 15 * 60 * 1000); // 15 minutos

    return () => clearInterval(interval);
}, [activeGame?.id]);
```

### Bibliotecas de Gráfico

| Plataforma | Biblioteca | Versão |
|-----------|-----------|--------|
| Web | `recharts` | ^2.12 |
| Mobile | `victory-native` | ^41 |

**Componente:** `ProgressChart` em `apps/web/src/components/ProgressChart/`

**Hook:** `useSnapshotTimer` em `apps/web/src/hooks/useSnapshotTimer.ts`

### Limpeza de Dados

`ON DELETE CASCADE` em `level_snapshots` garante que snapshots são deletados automaticamente quando o game é finalizado — não há histórico persistente.

## Critérios de Aceite do Épico

- [ ] Snapshot inicial capturado ao entrar na tela de partida
- [ ] Snapshots capturados automaticamente a cada 15 minutos
- [ ] Botão de gráfico visível na barra da tela de partida
- [ ] Modal exibe LineChart com eixo X = tempo, eixo Y = nível
- [ ] Cada jogador representado por uma linha colorida (usando a cor do jogador)
- [ ] Legenda identifica cada linha pelo nome do jogador
- [ ] Gráfico funciona com 1 a 6 jogadores
- [ ] Modal responsivo e fechável (tap fora ou botão X)
- [ ] Snapshots são deletados automaticamente ao finalizar a partida (CASCADE)
- [ ] Gráfico vazio exibe estado informativo quando há apenas 1 snapshot

## Dependências

- **EP-01** — Setup & Infraestrutura (schema com level_snapshots, Supabase client)
- **EP-04** — Tela de Partida — Core (estado dos jogadores, estrutura da tela de partida)
- **EP-05** — Persistência & Salvamento (Zustand store com gamePlayers disponível para snapshots)
