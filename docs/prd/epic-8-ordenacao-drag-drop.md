# Épico 8 — Ordenação & Drag & Drop

**ID:** EP-08
**Fase:** V1
**Pontos:** 12

## Objetivo

Permitir que o usuário organize a exibição dos jogadores na tela de partida de três formas: ordenação automática por maior nível (padrão), ordem aleatória e reordenação manual via drag & drop. A ordem é persistida no campo `player_order` (JSONB) do game.

## Stories

| Story ID | Título | Pts |
|----------|--------|-----|
| EP08-S01 | SortDropdown | 2 |
| EP08-S02 | Drag & Drop com @dnd-kit | 5 |
| EP08-S03 | Auto-sort por nível | 3 |
| EP08-S04 | Reordenação por teclado (acessibilidade) | 2 |

## Contexto do PRD

### Tela de Partida — Organização (seção 5.3)

- Ordenação por: **Maior nível** / **Aleatório**
- **Drag & Drop** manual

### Salvamento Automático (seção 5.4)

- **Trigger:** Alteração de nível / **Alteração de posição**
- Salva: Estado completo (jogadores + níveis + ordem)

### Schema — Campo sort_mode em games

```sql
sort_mode TEXT NOT NULL DEFAULT 'level-desc'
    CHECK (sort_mode IN ('level-desc', 'random', 'custom')),
player_order JSONB NOT NULL DEFAULT '[]'::jsonb,
-- Array de UUIDs para drag & drop sem tabela auxiliar
```

| sort_mode | Comportamento |
|-----------|--------------|
| `level-desc` | Auto-ordenar por nível decrescente (padrão) |
| `random` | Embaralhar ordem |
| `custom` | Usar array `player_order` (posição salva pelo drag & drop) |

### Campo position em game_players

```sql
position INT NOT NULL DEFAULT 0,
-- Usado para persistir a ordem quando sort_mode = 'custom'
```

### Bibliotecas de Drag & Drop

| Plataforma | Biblioteca | Versão |
|-----------|-----------|--------|
| Web | `@dnd-kit/core` + `@dnd-kit/sortable` | ^6.1 |
| Mobile | `react-native-draggable-flatlist` | ^4.0 |

### Componentes

| Componente | Arquivo |
|-----------|---------|
| `SortDropdown` | `apps/web/src/components/SortDropdown/` |
| `PlayerGrid` (com DnD) | `apps/web/src/components/PlayerGrid/` |

### Persistência da Ordem

Quando `sort_mode = 'custom'` (após drag & drop):
1. Zustand atualiza `gamePlayers[].position` otimisticamente
2. Auto-save persiste `player_order` (JSONB com array de UUIDs) no Supabase
3. `game_players.position` também atualizado para cada jogador

## Critérios de Aceite do Épico

- [ ] `SortDropdown` com opções: "Por Nível", "Aleatório", "Personalizado"
- [ ] Modo "Por Nível" (padrão): cards reordenam automaticamente ao mudar nível
- [ ] Modo "Aleatório": embaralha a ordem dos cards uma vez ao selecionar
- [ ] Drag & Drop habilitado no modo "Personalizado": arrastar um card reordena a lista
- [ ] Ordem customizada persiste ao sair e retornar à tela de partida
- [ ] Auto-save dispara após qualquer alteração de posição (mesmo trigger que alteração de nível)
- [ ] Reordenação por teclado (teclas de seta) funcionando para acessibilidade
- [ ] Animação suave durante o drag (60fps, React Native Reanimated no mobile)
- [ ] Ao trocar de modo de ordenação, transição visual suave dos cards
- [ ] `position` e `player_order` no Supabase refletem a ordem atual após cada mudança

## Dependências

- **EP-01** — Setup & Infraestrutura (design system, monorepo, Supabase schema com campos sort_mode e player_order)
- **EP-04** — Tela de Partida — Core (PlayerGrid, estrutura dos cards)
- **EP-05** — Persistência & Salvamento (auto-save integrado ao trigger de posição, Zustand store)
