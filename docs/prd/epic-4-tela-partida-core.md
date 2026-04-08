# Épico 4 — Tela de Partida — Core

**ID:** EP-04
**Fase:** MVP
**Pontos:** 19

## Objetivo

Implementar a tela principal de partida com o grid de PlayerCards, controle de nível com botões +/-, detecção de líder e condição de vitória, AppHeader com informações da partida e o botão de finalizar partida com interação hold de 3 segundos. Esta é a core feature do produto.

## Stories

| Story ID | Título | Pts |
|----------|--------|-----|
| EP04-S01 | PlayerCard component | 5 |
| EP04-S02 | LevelButton com feedback tátil | 3 |
| EP04-S03 | PlayerGrid responsivo | 3 |
| EP04-S04 | Detecção de líder e vitória | 2 |
| EP04-S05 | AppHeader da partida | 2 |
| EP04-S06 | Finalizar partida (HoldButton 3s) | 3 |
| EP04-S07 | Animações de entrada (stagger) | 1 |

## Contexto do PRD

### Tela de Partida — Core Feature (seção 5.3)

#### Layout: Grid de Jogadores

Cada jogador exibe:
- Nome
- Nível atual
- Botões: ➕ incrementar nível / ➖ decrementar nível

#### Controle de Nível

- Atualização instantânea (< 100ms — NFR crítico)
- Persistência automática

#### Finalização de Partida (seção 5.4)

- Botão com interação: pressionar por 3 segundos
- Feedback visual (progress bar)
- Ao finalizar: deletar permanentemente o estado da partida

### Requisitos Não Funcionais Críticos

| Requisito | Meta |
|-----------|------|
| Performance | Atualização de nível < 100ms |
| Usabilidade | Operável com uma mão |
| Tap targets | Mínimo 64px |
| Zone of Comfort | Botões na metade inferior da tela |

### Padrão Optimistic UI (Zustand Store)

```typescript
updateLevel: (gamePlayerId, delta) => {
    const newLevel = player.level + delta;

    // Guard: respeitar limites (1 a max_level)
    if (newLevel < 1 || newLevel > activeGame.max_level) return;

    // 1. Update local INSTANTÂNEO (< 100ms — NFR atendido)
    set(state => ({ gamePlayers: state.gamePlayers.map(...) }));

    // 2. Persist no Supabase async (com rollback em falha)
    levelsService.updateLevel(gamePlayerId, newLevel).catch(() => {
        // Rollback para o valor anterior
    });
},
```

### Componentes da Tela

| Componente | Descrição |
|-----------|-----------|
| `PlayerCard` | Card individual com nome, nível, botões +/- |
| `LevelButton` | Botão de incremento/decremento com feedback tátil |
| `PlayerGrid` | Grid responsivo de PlayerCards |
| `AppHeader` | Cabeçalho com nome do jogo, modo épico, menu |
| `HoldButton` | Botão de 3s para finalizar partida com progress bar |

### Fluxo de Finalização

```
Hold 3s → Feedback visual (progress bar)
→ finishGame(gameId): DELETE FROM games WHERE id=gameId
→ ON DELETE CASCADE limpa game_players e level_snapshots automaticamente
→ Navegar para Menu Principal
```

## Critérios de Aceite do Épico

- [ ] PlayerCard exibe nome, nível atual e botões + / - claramente
- [ ] Tap em + ou - atualiza o nível localmente em < 100ms (optimistic UI)
- [ ] Limites de nível respeitados: mínimo 1, máximo `max_level` (10 ou 20)
- [ ] Jogador com maior nível exibe indicador visual de líder
- [ ] Quando nível atinge `victory_level` (11 ou 21), exibe tela/modal de vitória
- [ ] Botões com tap target >= 64px, operáveis com uma mão
- [ ] PlayerGrid responsivo: 2 colunas no mobile, 3+ no tablet/desktop
- [ ] AppHeader exibe modo épico e permite acessar menu de opções
- [ ] HoldButton exige 3 segundos contínuos com progress bar visível
- [ ] Finalizar partida navega para Menu Principal e remove o estado da partida
- [ ] Animações de entrada dos cards em stagger (sequencial) ao carregar a tela

## Dependências

- **EP-01** — Setup & Infraestrutura (design system, monorepo, Supabase)
- **EP-02** — Gerenciamento de Jogadores (dados dos jogadores)
- **EP-03** — Fluxo de Novo Jogo (game criado no Supabase, game_players populados)
