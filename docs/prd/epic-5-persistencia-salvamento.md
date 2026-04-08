# Épico 5 — Persistência & Salvamento

**ID:** EP-05
**Fase:** MVP
**Pontos:** 14

## Objetivo

Garantir zero perda de estado da partida através de uma estratégia local-first: Zustand como source of truth em RAM, persist middleware para localStorage como fallback offline, sync assíncrono com Supabase como cloud backup, fila de writes para reconexão e restauração inteligente por timestamp ao abrir o app.

## Stories

| Story ID | Título | Pts |
|----------|--------|-----|
| EP05-S01 | Zustand store com persist middleware | 3 |
| EP05-S02 | Auto-save no Supabase | 3 |
| EP05-S03 | Sync queue offline | 3 |
| EP05-S04 | Restauração de estado ao abrir app | 3 |
| EP05-S05 | Limpeza de dados ao finalizar | 2 |

## Contexto do PRD

### Persistência e Segurança (seção 5.4)

#### Salvamento Automático (CRÍTICO)

- **Trigger:** Alteração de nível / Alteração de posição
- **Salva:** Estado completo (jogadores + níveis + ordem)

#### Limpeza de Dados

- Ao finalizar: Deletar permanentemente o estado da partida
- Não manter histórico

### Riscos do PRD (seção 10)

| Risco | Mitigação |
|-------|-----------|
| Perda de estado | Zustand persist (localStorage) + Supabase cloud backup; restauração por comparação de timestamp ao abrir o app |
| Dependência de conexão | Local-first: localStorage é source of truth durante partida; sync queue enfileira writes offline e sincroniza ao reconectar |

### Estratégia Local-First

```
[Level change] → [Zustand RAM] → [localStorage persist] → [Supabase async]
                  ↑ source of truth   ↑ fallback offline    ↑ cloud backup
```

### Zustand Persist Configuration

```typescript
export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({ /* ... */ }),
        {
            name: 'munchkin-game-store',
            storage: createJSONStorage(() => localStorage), // AsyncStorage no RN
            partialize: (state) => ({
                userId: state.userId,
                players: state.players,
                activeGame: state.activeGame,
                gamePlayers: state.gamePlayers,
                sortMode: state.sortMode,
            }),
        }
    )
);
```

### Restauração de Estado ao Abrir App

```
1. Ler localStorage/AsyncStorage (instantâneo)
2. Anonymous auth no Supabase
3. Se online: buscar state do Supabase
4. Comparar timestamps: mais recente vence
5. Flush sync queue de writes pendentes
6. Renderizar UI
```

### Limpeza ao Finalizar

```sql
-- ON DELETE CASCADE garante limpeza completa automaticamente
DELETE FROM games WHERE id = gameId;
-- Cascateia para game_players e level_snapshots automaticamente
```

### Hooks Relacionados

| Hook | Responsabilidade |
|------|-----------------|
| `useGameStore.ts` | Zustand store principal com persist |
| `useAutoSave.ts` | Dispara sync com Supabase após mudanças |

## Critérios de Aceite do Épico

- [ ] Zustand store configurado com persist middleware salvando em localStorage
- [ ] Partidas em andamento sobrevivem a reload da página/app
- [ ] Toda alteração de nível dispara auto-save assíncrono no Supabase
- [ ] Em caso de falha no save, UI faz rollback e exibe feedback de erro
- [ ] Sync queue enfileira writes quando offline e sincroniza ao reconectar
- [ ] Ao abrir o app, estado mais recente (localStorage vs Supabase) é restaurado por timestamp
- [ ] "Continuar Partida" aparece no menu apenas quando há jogo ativo salvo
- [ ] Finalizar partida deleta o game no Supabase (ON DELETE CASCADE remove game_players e snapshots)
- [ ] Após finalização, localStorage é limpo (sem estado residual)
- [ ] Zero perda de dados em cenários de: conexão instável, fechar aba, reiniciar dispositivo

## Dependências

- **EP-01** — Setup & Infraestrutura (Supabase client, schema, Anonymous Auth)
- **EP-03** — Fluxo de Novo Jogo (estrutura do game criado)
- **EP-04** — Tela de Partida — Core (eventos de mudança de nível a serem persistidos)
