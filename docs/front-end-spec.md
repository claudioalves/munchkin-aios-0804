# Front-End Spec — Munchkin Level Tracker

**Versão:** 1.0
**Data:** 2026-04-08
**Autor:** Uma (@ux-design-expert)
**Status:** Aprovado para Desenvolvimento

---

## Índice

1. [Direção Estética](#1-direção-estética)
2. [Design System](#2-design-system)
3. [Wireframes Descritivos](#3-wireframes-descritivos)
4. [Componentes UI](#4-componentes-ui)
5. [Interactions & Animations](#5-interactions--animations)
6. [Responsive Breakpoints](#6-responsive-breakpoints)
7. [Acessibilidade](#7-acessibilidade)
8. [Tokens de Decisão](#8-tokens-de-decisão)

---

## 1. Direção Estética

### Conceito: "Taverna Digital"

O app vive na mesa física. Ele é um artefato do jogo — não um dashboard corporativo. A estética une o universo fantasy/medieval do Munchkin com uma interface dark, tátil e imediata.

**Palavras-chave:** manuscrito, pergaminho queimado, metal dourado, gema rubi, dungeon light.

**Tom visual:** Dark fantasy com alto contraste. Cores de accent quentes (âmbar, rubi). Tipografia com personalidade. Nada de gradientes azul-roxo genéricos. Nada de cards brancos com sombras cinzas.

**O diferencial memorável:** O número de nível é o protagonista absoluto de cada card. Ele ocupa 60% da altura do card, em fonte grossa e expressiva. O jogador que está na frente tem o card com leve glow dourado pulsante. Hierarquia visual imediata — você enxerga quem está ganhando de 2 metros de distância.

---

## 2. Design System

### 2.1 Paleta de Cores

```css
:root {
  /* --- Backgrounds --- */
  --color-bg-base:        #0e0c0a;   /* Preto quente — fundo raiz */
  --color-bg-surface:     #1a1713;   /* Pergaminho escuro — cards, modais */
  --color-bg-elevated:    #252018;   /* Camada elevada — dropdowns, tooltips */
  --color-bg-overlay:     rgba(14,12,10,0.85); /* Overlay de modais */

  /* --- Borders --- */
  --color-border-subtle:  #2e2920;   /* Divisores discretos */
  --color-border-default: #4a3f2f;   /* Borda padrão de card */
  --color-border-active:  #c9943a;   /* Borda de elemento em foco */

  /* --- Accent Primário: Ouro Munchkin --- */
  --color-gold-900:       #7a5820;
  --color-gold-700:       #b07d2e;
  --color-gold-500:       #c9943a;   /* Accent principal */
  --color-gold-300:       #e8be6e;   /* Texto de destaque, ícones */
  --color-gold-100:       #f7e9c0;   /* Texto sobre fundos dourados */

  /* --- Accent Secundário: Rubi Combate --- */
  --color-ruby-700:       #7a1a1a;
  --color-ruby-500:       #b02828;   /* Botão decrementar */
  --color-ruby-300:       #e05050;   /* Hover do botão decrementar */
  --color-ruby-100:       #ffd4d4;   /* Texto sobre rubi */

  /* --- Accent Terciário: Esmeralda Vitória --- */
  --color-emerald-700:    #1a4a2e;
  --color-emerald-500:    #2d7a4a;   /* Indicador de vitória */
  --color-emerald-300:    #4db87a;   /* Glow de vitória */

  /* --- Texto --- */
  --color-text-primary:   #f0e6d0;   /* Pergaminho claro — corpo de texto */
  --color-text-secondary: #9a8a6a;   /* Texto secundário, labels */
  --color-text-muted:     #5a4e38;   /* Placeholder, desabilitado */
  --color-text-inverse:   #0e0c0a;   /* Texto sobre fundos claros */

  /* --- Status --- */
  --color-success:        #4db87a;
  --color-warning:        #e8be6e;
  --color-error:          #e05050;
  --color-info:           #6ab4e8;

  /* --- Nível Glow (Líder) --- */
  --glow-leader:          0 0 20px rgba(201,148,58,0.4), 0 0 60px rgba(201,148,58,0.15);
  --glow-victory:         0 0 30px rgba(77,184,122,0.5), 0 0 80px rgba(77,184,122,0.2);
}
```

#### Uso dos Tokens

| Token | Uso |
|-------|-----|
| `--color-bg-base` | `<body>`, tela raiz |
| `--color-bg-surface` | Cards de jogador, modais |
| `--color-bg-elevated` | Dropdowns, menus flutuantes |
| `--color-gold-500` | Botão primário, borda de card ativo, ícone de nível |
| `--color-gold-300` | Número de nível (display grande) |
| `--color-ruby-500` | Botão decrementar |
| `--color-emerald-500` | Badge de vitória, estado ganhando |
| `--color-text-primary` | Todo texto de corpo |
| `--color-text-secondary` | Nome do jogador, labels |

### 2.2 Tipografia

#### Fontes Selecionadas

| Papel | Fonte | Racional |
|-------|-------|----------|
| Display / Nível | **Cinzel Decorative** | Serifa romana clássica com feel de inscrição medieval. Funciona perfeitamente para números grandes. Carrega referência épica sem ser ilegível. |
| Headings | **Cinzel** | Versão regular do Cinzel para títulos de seção. Mesma família, mais sóbrio. |
| Body / UI | **Crimson Pro** | Serifa humanista legível. Warm e orgânica. Perfeita para nomes de jogadores e textos de interface. |
| Monospace / Dados | **JetBrains Mono** | Para valores numéricos secundários (gráficos, timestamps). |

**Import (Google Fonts):**
```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
```

#### Escala Tipográfica

```css
:root {
  /* Escala modular — razão 1.333 (perfect fourth) */
  --font-size-xs:   0.563rem;  /*  9px */
  --font-size-sm:   0.75rem;   /* 12px */
  --font-size-base: 1rem;      /* 16px */
  --font-size-md:   1.333rem;  /* 21px */
  --font-size-lg:   1.777rem;  /* 28px */
  --font-size-xl:   2.369rem;  /* 38px */
  --font-size-2xl:  3.157rem;  /* 51px */
  --font-size-3xl:  4.209rem;  /* 67px */
  --font-size-hero: 6rem;      /* 96px — número de nível no card */

  --font-family-display: 'Cinzel Decorative', serif;
  --font-family-heading: 'Cinzel', serif;
  --font-family-body:    'Crimson Pro', serif;
  --font-family-mono:    'JetBrains Mono', monospace;

  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  --line-height-tight:   1.1;
  --line-height-default: 1.5;
  --line-height-loose:   1.75;

  --letter-spacing-tight: -0.02em;
  --letter-spacing-wide:   0.08em;
  --letter-spacing-wider:  0.15em;
}
```

#### Classes Tipográficas (Tailwind Config Custom)

```js
// tailwind.config.js — extend.fontFamily
fontFamily: {
  display: ['Cinzel Decorative', 'serif'],
  heading: ['Cinzel', 'serif'],
  body: ['Crimson Pro', 'serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

Uso:
```html
<!-- Número de nível -->
<span class="font-display text-[6rem] font-black leading-none tracking-tight text-gold-300">
  7
</span>

<!-- Nome do jogador -->
<p class="font-heading text-lg font-semibold tracking-wide text-text-secondary uppercase">
  Claudio
</p>

<!-- Texto de UI -->
<p class="font-body text-base text-text-primary">
  Partida em andamento
</p>
```

### 2.3 Espaçamento

```css
:root {
  /* Base: 4px — escala 4pt grid */
  --space-1:   0.25rem;  /*  4px */
  --space-2:   0.5rem;   /*  8px */
  --space-3:   0.75rem;  /* 12px */
  --space-4:   1rem;     /* 16px */
  --space-5:   1.25rem;  /* 20px */
  --space-6:   1.5rem;   /* 24px */
  --space-8:   2rem;     /* 32px */
  --space-10:  2.5rem;   /* 40px */
  --space-12:  3rem;     /* 48px */
  --space-16:  4rem;     /* 64px */
  --space-20:  5rem;     /* 80px */
  --space-24:  6rem;     /* 96px */
}
```

### 2.4 Border Radius

```css
:root {
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-2xl:  24px;
  --radius-full: 9999px;
}
```

### 2.5 Sombras e Elevação

```css
:root {
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.4);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.5);
  --shadow-lg:  0 8px 24px rgba(0,0,0,0.6);
  --shadow-inset: inset 0 1px 3px rgba(0,0,0,0.5);

  /* Texturas de fundo para efeito pergaminho */
  --texture-card: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%231a1713'/%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%23252018' opacity='0.3'/%3E%3C/svg%3E");
}
```

### 2.6 Iconografia

**Biblioteca:** Phosphor Icons (versão React `@phosphor-icons/react`)

Ícones usados:

| Ícone | Phosphor Name | Contexto |
|-------|--------------|---------|
| Nível subir | `Plus` (weight: bold) | Botão incrementar |
| Nível descer | `Minus` (weight: bold) | Botão decrementar |
| Arrastar | `DotsSixVertical` | Handle de drag & drop |
| Narrar | `SpeakerHigh` / `SpeakerSlash` | Toggle TTS |
| Gráfico | `ChartLineUp` | Botão gráfico |
| Configurações | `Gear` | Configurações |
| Novo jogo | `Sword` | Botão Novo Jogo |
| Continuar | `ArrowCounterClockwise` | Continuar Partida |
| Regras | `Book` | Regras PDF |
| Dúvidas | `Question` | Link externo |
| Finalizar | `SkullSimple` | Encerrar partida (hold 3s) |
| Avatar | `UserCircle` | Placeholder de avatar |
| Modo Épico | `Crown` | Checkbox Modo Épico |
| Adicionar jogador | `UserPlus` | Cadastro rápido |
| Vencedor | `Trophy` | Estado de vitória |

---

## 3. Wireframes Descritivos

### 3.1 Menu Principal

#### Layout Web (Desktop 1280px)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER (64px)                                                          │
│  [⚔ MUNCHKIN LEVEL TRACKER]          [Gear icon]  Configurações        │
│   font-display, text-gold-300                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  HERO ZONE (160px) — centralizado                                       │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  Ilustração ASCII/SVG de dados de Munchkin ou ícone Sword grande  │  │
│  │  [⚔]  Subtítulo: "Companion para partidas épicas"                 │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  GRID DE AÇÕES (2 colunas, max-w-2xl, mx-auto)                         │
│  ┌──────────────────────┐  ┌──────────────────────┐                    │
│  │  [Sword]             │  │  [ArrowCounter]       │                    │
│  │  NOVO JOGO           │  │  CONTINUAR            │                    │
│  │  — Botão primário —  │  │  — Visível se salvo — │                    │
│  │  bg-gold-500 h-20    │  │  bg-bg-surface h-20   │                    │
│  └──────────────────────┘  └──────────────────────┘                    │
│                                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐                    │
│  │  [UserCircle]        │  │  [Book]               │                    │
│  │  JOGADORES           │  │  REGRAS               │                    │
│  │  Gerenciar cadastros │  │  Abre PDF externo     │                    │
│  │  bg-bg-surface h-16  │  │  bg-bg-surface h-16   │                    │
│  └──────────────────────┘  └──────────────────────┘                    │
│                                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐                    │
│  │  [Question]          │  │  [Gear]               │                    │
│  │  DÚVIDAS             │  │  CONFIGURAÇÕES        │                    │
│  │  Link NotebookLM     │  │  Voz narrador         │                    │
│  │  bg-bg-surface h-16  │  │  bg-bg-surface h-16   │                    │
│  └──────────────────────┘  └──────────────────────┘                    │
│                                                                         │
│  AD BANNER (728x90) — AdSense                                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  [Anúncio — carregado pelo AdSense]                               │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Layout Mobile (390px)

```
┌─────────────────────┐
│ HEADER (56px)       │
│ [⚔ MUNCHKIN]  [⚙]  │
├─────────────────────┤
│                     │
│ HERO (80px)         │
│ [⚔ ícone grande]   │
│ Companion épico     │
│                     │
├─────────────────────┤
│ AÇÕES — 1 coluna    │
│                     │
│ ┌─────────────────┐ │
│ │ [Sword]         │ │
│ │ NOVO JOGO       │ │
│ │ h-16 bg-gold    │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ [Arrow]         │ │
│ │ CONTINUAR       │ │
│ │ h-14 bg-surface │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ [UserCircle]    │ │
│ │ JOGADORES       │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ [Book]  REGRAS  │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ [?]  DÚVIDAS    │ │
│ └─────────────────┘ │
│                     │
│ AD BANNER 320x50    │
│ ┌─────────────────┐ │
│ │   [AdSense]     │ │
│ └─────────────────┘ │
└─────────────────────┘
```

**Notas de comportamento:**
- "Continuar" só renderiza se `localStorage` / Supabase tiver sessão ativa. Animação de fade-in ao montar.
- Botão "Novo Jogo" tem peso visual maior (bg-gold-500, text-inverse, `font-heading font-bold`).
- Header sticky — fica fixo ao rolar.

---

### 3.2 Seleção de Jogadores + Configuração

#### Fluxo: Novo Jogo → Step 1 (Jogadores) → Step 2 (Configuração)

O fluxo usa um **stepper inline** na mesma tela (sem navegação de rota separada).

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                  │
│ [← Voltar]    NOVO JOGO    Passo 1/2: Jogadores                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PROGRESS STEPPER                                                       │
│  ●——————○   Step 1: Jogadores    Step 2: Configuração                  │
│  [gold-500]  [border-gold-500]                                          │
│                                                                         │
│  ─────────────────────────────────────────────────────                  │
│  JOGADORES CADASTRADOS (lista scrollable, max-h-64)                     │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ ☑  [Avatar A]  Ana Clara          [Cor: ●rubi]   [✕ remover]    │   │
│  │ ☑  [Avatar C]  Claudio            [Cor: ●ouro]   [✕ remover]    │   │
│  │ ☐  [Avatar P]  Padova             [Cor: ●verde]  [✕ remover]    │   │
│  │ ☐  [Avatar M]  Maria              [Cor: ●azul]   [✕ remover]    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ─────────────────────────────────────────────────────                  │
│  CADASTRO RÁPIDO INLINE                                                 │
│  ┌──────────────────────────────────────────────────┐  ┌──────────┐   │
│  │ [UserPlus]  Nome do novo jogador...               │  │  + ADD   │   │
│  └──────────────────────────────────────────────────┘  └──────────┘   │
│  [Seletor de cor: ● ● ● ● ● ● — swatches coloridos]                    │
│                                                                         │
│  Selecionados: 2 jogadores  (min 2, max 6)                              │
│                                                                         │
│  ─────────────────────────────────────────────────────                  │
│                                     [PRÓXIMO: CONFIGURAR →]             │
│                                     btn bg-gold-500, desabilitado < 2   │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Step 2: Configuração da Partida

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                  │
│ [← Voltar]    NOVO JOGO    Passo 2/2: Configuração                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PROGRESS STEPPER                                                       │
│  ●——————●   Step 1: Jogadores ✓    Step 2: Configuração                │
│                                                                         │
│  ─────────────────────────────────────────────────────                  │
│  RESUMO DE JOGADORES (read-only, chips)                                 │
│  [Ana Clara ●]  [Claudio ●]                                             │
│                                                                         │
│  ─────────────────────────────────────────────────────                  │
│  MODO ÉPICO                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Crown icon]  MODO ÉPICO                                        │   │
│  │                                                                  │   │
│  │  Nível máximo: 10 → 20    Vitória: nível 11 → 21               │   │
│  │                                                                  │   │
│  │  ○ OFF  ●●●●●●●●●  ○ ON                                         │   │
│  │        [toggle slider]                                           │   │
│  │        bg-gold-500 quando ON, bg-border-default quando OFF       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Estado atual: MODO NORMAL (nível máx 10)                               │
│  text-text-secondary, font-body, italic                                 │
│                                                                         │
│  ─────────────────────────────────────────────────────                  │
│                                     [⚔ INICIAR PARTIDA]                 │
│                                     btn grande, bg-gold-500             │
│                                     w-full ou max-w-sm                   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Comportamento do Cadastro Rápido:**
- Campo de nome com `Enter` aciona adição.
- Cor aleatória pré-selecionada (da paleta de avatars).
- Novo jogador entra na lista já selecionado (checkbox marcado).
- Validação: nome vazio bloqueia adição. Nome duplicado mostra shake + tooltip.

---

### 3.3 Tela de Partida (Core)

#### Layout Web Desktop (1280px) — 4 jogadores

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER (56px) — sticky                                                  │
│ [← Encerrar]   PARTIDA  •  Modo Normal   [Sort: ▼]  [♪]  [≡ Menu]    │
│ hold 3s          font-heading                dropdown  TTS  extras      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  GRID DE JOGADORES — CSS Grid, responsive                               │
│  (4 jogadores = 2×2 no desktop, 1 col no mobile)                       │
│                                                                         │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐      │
│  │ ⠿  [Avatar] CLAUDIO         │  │ ⠿  [Avatar] ANA CLARA       │      │
│  │     ● Ouro   drag handle    │  │     ● Rubi                  │      │
│  │                             │  │                             │      │
│  │         7                   │  │         5                   │      │
│  │   (Cinzel Decorative 96px)  │  │   (Cinzel Decorative 96px)  │      │
│  │       text-gold-300         │  │       text-gold-300         │      │
│  │                             │  │                             │      │
│  │  ┌──────────┐ ┌──────────┐  │  │  ┌──────────┐ ┌──────────┐  │      │
│  │  │    −     │ │    +     │  │  │  │    −     │ │    +     │  │      │
│  │  │ ruby-500 │ │ gold-500 │  │  │  │ ruby-500 │ │ gold-500 │  │      │
│  │  │  h-16    │ │  h-16    │  │  │  │  h-16    │ │  h-16    │  │      │
│  │  └──────────┘ └──────────┘  │  │  └──────────┘ └──────────┘  │      │
│  │                             │  │                             │      │
│  │  [LÍDER]  glow-leader       │  │                             │      │
│  └─────────────────────────────┘  └─────────────────────────────┘      │
│                                                                         │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐      │
│  │ ⠿  [Avatar] PADOVA          │  │ ⠿  [Avatar] MARIA           │      │
│  │     ● Verde                 │  │     ● Azul                  │      │
│  │                             │  │                             │      │
│  │         4                   │  │         3                   │      │
│  │       text-gold-300         │  │       text-gold-300         │      │
│  │                             │  │                             │      │
│  │  ┌──────────┐ ┌──────────┐  │  │  ┌──────────┐ ┌──────────┐  │      │
│  │  │    −     │ │    +     │  │  │  │    −     │ │    +     │  │      │
│  │  └──────────┘ └──────────┘  │  │  └──────────┘ └──────────┘  │      │
│  └─────────────────────────────┘  └─────────────────────────────┘      │
│                                                                         │
│  BARRA INFERIOR — sticky                                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  [ChartLineUp] Gráfico    [DotsSixVertical] Reordenar  [♪ TTS] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Layout Mobile (390px) — 1 coluna

```
┌─────────────────────┐
│ HEADER (56px)       │
│ [← 3s] PARTIDA [≡] │
├─────────────────────┤
│                     │
│ ┌─────────────────┐ │
│ │ ⠿ CLAUDIO  ●   │ │
│ │                 │ │
│ │       7         │ │  ← 72px (menor no mobile)
│ │   text-gold-300 │ │
│ │                 │ │
│ │ [−][     ][+]   │ │  ← botões h-16 (64px tap target)
│ │  ruby  num gold │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ ⠿ ANA CLARA ●  │ │
│ │                 │ │
│ │       5         │ │
│ │                 │ │
│ │ [−][     ][+]   │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ ⠿ PADOVA    ●  │ │
│ │       4         │ │
│ │ [−][     ][+]   │ │
│ └─────────────────┘ │
│                     │
│ BOTTOM BAR (56px)   │
│ [📊][⠿ Ordem][♪]  │
└─────────────────────┘
```

#### Card de Vitória (estado especial)

```
┌─────────────────────────────────┐
│ [Trophy]  VENCEDOR!             │  ← badge overlay
│ ⠿  [Avatar] CLAUDIO      ●    │
│                                 │
│         11                      │  ← emerald-300, glow-victory
│                                 │
│  [−]   NÍVEL MÁXIMO   [+]       │  ← botões desabilitados
│                                 │
│  ████████████████████  100%     │  ← progress bar esmeralda
└─────────────────────────────────┘
```

---

### 3.4 Modal de Configurações (Voz Narrador)

```
┌──────────────────────────────────────────────┐
│  [X]  CONFIGURAÇÕES                           │
├──────────────────────────────────────────────┤
│                                               │
│  VOZ DO NARRADOR                              │
│  ┌────────────────────────────────────────┐   │
│  │  Selecione a voz:                      │   │
│  │  ○  Masculino grave (pt-BR)            │   │
│  │  ●  Feminino padrão (pt-BR)            │   │
│  │  ○  Inglês dramático (en-US)           │   │
│  └────────────────────────────────────────┘   │
│                                               │
│  [▶ Testar voz selecionada]                   │
│                                               │
│  [SALVAR]                                     │
└──────────────────────────────────────────────┘
```

---

### 3.5 Gráfico de Progresso (Modal/Panel)

```
┌──────────────────────────────────────────────────────────────┐
│  [X]  PROGRESSO DA PARTIDA                                   │
│  Última atualização: 14:32   [⟳ Atualizar]                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Níveis ao longo do tempo                                    │
│                                                              │
│  11│                                    ···· Claudio         │
│  10│                               ···/                      │
│   9│                          ···/   ── Ana Clara            │
│   8│                    ···  /      .... Padova              │
│   7│               ···/··· /         -- Maria                │
│   6│          ···/···    ··                                   │
│   5│     ···/···  ·····                                       │
│   4│ ···/···                                                  │
│   3│/                                                         │
│   2│──────────────────────────────────────────────────────   │
│    0     15min    30min    45min    60min    75min            │
│                                                              │
│  (Eixo X: tempo; Eixo Y: nível; Linhas coloridas por jogador)│
└──────────────────────────────────────────────────────────────┘
```

**Biblioteca de gráfico:** Recharts (React) — `LineChart` com tooltip customizado.

---

## 4. Componentes UI

### 4.1 PlayerCard

**Arquivo:** `components/PlayerCard/PlayerCard.tsx`

```tsx
interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    avatarUrl?: string;
    color: string;        // hex
    level: number;
  };
  isLeader: boolean;
  isVictory: boolean;
  maxLevel: number;       // 10 (normal) ou 20 (épico)
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}
```

**Classes base (Tailwind):**
```html
<!-- Card wrapper -->
<div class="
  relative flex flex-col items-center
  bg-bg-surface border border-border-default
  rounded-xl p-4 gap-3
  transition-all duration-300
  data-[leader=true]:border-gold-500 data-[leader=true]:shadow-[var(--glow-leader)]
  data-[victory=true]:border-emerald-500 data-[victory=true]:shadow-[var(--glow-victory)]
  data-[dragging=true]:opacity-60 data-[dragging=true]:scale-95
">
  <!-- Drag handle -->
  <div class="absolute top-2 left-2 text-text-muted cursor-grab active:cursor-grabbing">
    <DotsSixVertical size={20} />
  </div>

  <!-- Avatar + nome -->
  <div class="flex items-center gap-2 w-full justify-center">
    <span class="w-3 h-3 rounded-full flex-shrink-0" style="background: {player.color}" />
    <span class="font-heading text-sm font-semibold tracking-wider uppercase text-text-secondary truncate max-w-[120px]">
      {player.name}
    </span>
  </div>

  <!-- Número de nível — PROTAGONISTA -->
  <span class="font-display font-black leading-none text-gold-300 select-none
               text-[6rem] md:text-[5rem] sm:text-[4rem]
               tabular-nums">
    {player.level}
  </span>

  <!-- Botões +/- -->
  <div class="flex gap-2 w-full">
    <button class="flex-1 h-16 rounded-lg bg-ruby-500 hover:bg-ruby-300
                   text-white font-bold text-2xl
                   transition-transform active:scale-90
                   disabled:opacity-30 disabled:cursor-not-allowed">
      <Minus weight="bold" />
    </button>
    <button class="flex-1 h-16 rounded-lg bg-gold-500 hover:bg-gold-300
                   text-text-inverse font-bold text-2xl
                   transition-transform active:scale-90
                   disabled:opacity-30 disabled:cursor-not-allowed">
      <Plus weight="bold" />
    </button>
  </div>
</div>
```

**Variantes de estado:**
- `isLeader=true`: border-gold-500 + glow-leader pulsante
- `isVictory=true`: border-emerald-500 + glow-victory + badge Trophy + botões disabled
- `isDragging=true`: opacity-60 + scale-95

---

### 4.2 LevelButton

**Arquivo:** `components/LevelButton/LevelButton.tsx`

```tsx
interface LevelButtonProps {
  variant: 'increment' | 'decrement';
  disabled?: boolean;
  onClick: () => void;
  'aria-label': string;
}
```

**Comportamento:**
- `onClick` dispara feedback visual imediato (`scale(0.9)`, 80ms).
- `onPointerDown` inicia a transição de estado otimista no nível.
- Não debounce — resposta < 100ms é requisito.

```html
<button
  class="flex items-center justify-center h-16 w-full rounded-lg
         font-bold text-2xl select-none touch-none
         transition-all duration-75 ease-out
         focus-visible:outline-2 focus-visible:outline-gold-500 focus-visible:outline-offset-2"
  data-variant="increment|decrement"
>
  <!-- increment: bg-gold-500 hover:bg-gold-300 text-text-inverse -->
  <!-- decrement: bg-ruby-500 hover:bg-ruby-300 text-white       -->
</button>
```

---

### 4.3 PlayerGrid

**Arquivo:** `components/PlayerGrid/PlayerGrid.tsx`

```tsx
interface PlayerGridProps {
  players: Player[];
  sortMode: 'level-desc' | 'random' | 'custom';
  epicMode: boolean;
  onLevelChange: (id: string, delta: 1 | -1) => void;
  onReorder: (newOrder: string[]) => void;
}
```

**CSS Grid responsivo:**
```css
.player-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  /* 1 col mobile, 2 col tablet, 3-4 col desktop */
}
```

**Drag & Drop:** `@dnd-kit/core` + `@dnd-kit/sortable`
- `SortableContext` com `rectSortingStrategy`
- `DragOverlay` mostra card fantasma com `opacity-70`

---

### 4.4 EpicModeToggle

**Arquivo:** `components/EpicModeToggle/EpicModeToggle.tsx`

```tsx
interface EpicModeToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}
```

```html
<label class="flex items-center justify-between p-4
              bg-bg-surface border border-border-default rounded-xl
              cursor-pointer select-none
              hover:border-gold-700 transition-colors">
  <div class="flex items-center gap-3">
    <Crown size={24} class="text-gold-500" />
    <div>
      <p class="font-heading font-semibold text-text-primary">Modo Épico</p>
      <p class="font-body text-sm text-text-secondary">
        Nível máx: {enabled ? 20 : 10} • Vitória em {enabled ? 21 : 11}
      </p>
    </div>
  </div>
  <!-- Toggle slider customizado -->
  <div class="relative w-14 h-7 rounded-full transition-colors duration-300
              bg-border-default data-[checked=true]:bg-gold-500">
    <div class="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white
                transition-transform duration-300
                data-[checked=true]:translate-x-7 shadow-md" />
  </div>
</label>
```

---

### 4.5 HoldButton (Encerrar Partida)

**Arquivo:** `components/HoldButton/HoldButton.tsx`

```tsx
interface HoldButtonProps {
  holdDuration?: number;  // default: 3000ms
  onComplete: () => void;
  label: string;
  icon?: React.ReactNode;
}
```

**Mecânica:**
- `onPointerDown` → inicia timer e progresso visual.
- `onPointerUp` / `onPointerLeave` → cancela, volta ao estado inicial.
- `progress` (0→1) controla `stroke-dashoffset` de um SVG circle border.
- Haptic feedback via `navigator.vibrate([100])` ao completar (mobile).

```html
<button
  class="relative flex flex-col items-center justify-center
         h-20 w-full max-w-xs mx-auto
         rounded-xl border-2 border-ruby-700
         text-ruby-300 font-heading font-semibold
         select-none touch-none overflow-hidden
         transition-colors hover:border-ruby-500">

  <!-- Fundo de progresso preenchendo de baixo para cima -->
  <div class="absolute inset-0 bg-ruby-700 origin-bottom
              transition-transform duration-75 ease-linear"
       style="transform: scaleY({progress})" />

  <SkullSimple size={28} class="relative z-10" />
  <span class="relative z-10 text-sm mt-1">Segurar 3s para encerrar</span>
</button>
```

---

### 4.6 PlayerListItem (Seleção de Jogadores)

**Arquivo:** `components/PlayerListItem/PlayerListItem.tsx`

```tsx
interface PlayerListItemProps {
  player: { id: string; name: string; color: string; avatarUrl?: string };
  selected: boolean;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}
```

```html
<li class="flex items-center gap-3 p-3
           rounded-lg border border-transparent
           hover:border-border-default
           data-[selected=true]:border-gold-700 data-[selected=true]:bg-bg-elevated
           transition-all cursor-pointer">
  <!-- Checkbox estilizado -->
  <div class="w-5 h-5 rounded border-2 border-border-default flex-shrink-0
              flex items-center justify-center
              data-[checked=true]:bg-gold-500 data-[checked=true]:border-gold-500">
    <Check size={12} weight="bold" class="text-text-inverse" />
  </div>

  <!-- Avatar placeholder com inicial -->
  <div class="w-9 h-9 rounded-full flex items-center justify-center
              font-heading font-bold text-text-inverse text-sm flex-shrink-0"
       style="background: {player.color}">
    {player.name[0].toUpperCase()}
  </div>

  <!-- Nome -->
  <span class="font-body text-text-primary flex-1 truncate">{player.name}</span>

  <!-- Cor indicator -->
  <span class="w-3 h-3 rounded-full flex-shrink-0"
        style="background: {player.color}" />

  <!-- Remove button -->
  <button class="text-text-muted hover:text-error transition-colors p-1 -mr-1"
          aria-label="Remover {player.name}">
    <X size={16} />
  </button>
</li>
```

---

### 4.7 QuickAddPlayer

**Arquivo:** `components/QuickAddPlayer/QuickAddPlayer.tsx`

```tsx
interface QuickAddPlayerProps {
  onAdd: (name: string, color: string) => void;
  existingNames: string[];
}
```

**Paleta de cores disponíveis:**
```ts
const PLAYER_COLORS = [
  '#c9943a', // ouro
  '#b02828', // rubi
  '#2d7a4a', // esmeralda
  '#2875b0', // safira
  '#8028b0', // ametista
  '#b07820', // bronze
];
```

---

### 4.8 AppHeader

**Arquivo:** `components/AppHeader/AppHeader.tsx`

```tsx
interface AppHeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: React.ReactNode;   // botão voltar ou hold-to-end
  rightActions?: React.ReactNode[]; // sort, tts, menu
  sticky?: boolean;
}
```

```html
<header class="flex items-center h-14 px-4 gap-3
               bg-bg-base/80 backdrop-blur-sm
               border-b border-border-subtle
               sticky top-0 z-40">
  <!-- Left action -->
  <div class="w-10 flex-shrink-0">{leftAction}</div>

  <!-- Title -->
  <div class="flex-1 text-center">
    <h1 class="font-heading font-semibold text-text-primary tracking-wide">{title}</h1>
    {subtitle && <p class="font-body text-xs text-text-secondary">{subtitle}</p>}
  </div>

  <!-- Right actions -->
  <div class="flex items-center gap-2 flex-shrink-0">{rightActions}</div>
</header>
```

---

### 4.9 SortDropdown

**Arquivo:** `components/SortDropdown/SortDropdown.tsx`

```tsx
interface SortDropdownProps {
  value: 'level-desc' | 'random' | 'custom';
  onChange: (value: SortMode) => void;
}
```

**Options:**
- "Maior Nível" (`level-desc`)
- "Aleatório" (`random`) — embaralha e mantém até próxima troca
- "Personalizado" (`custom`) — drag & drop ativado

---

### 4.10 NarratorButton

**Arquivo:** `components/NarratorButton/NarratorButton.tsx`

```tsx
interface NarratorButtonProps {
  isPlaying: boolean;
  onNarrate: () => void;
  onStop: () => void;
  disabled?: boolean;
}
```

Ao clicar em narrar, lê: `"${nome} nível ${nivel}, ${nome2} nível ${nivel2}, ..."` em ordem decrescente de nível.

---

## 5. Interactions & Animations

### 5.1 Princípios

1. **Imediato > Bonito.** Feedback visual acontece em `< 16ms` (frame 0). Animações decorativas não bloqueiam.
2. **Impacto seletivo.** Apenas 3 momentos têm animação rica: entrada do card líder, mudança de nível, estado de vitória.
3. **Reduzido se preferência.** `@media (prefers-reduced-motion: reduce)` desativa todas as animações exceto feedback tátil.

---

### 5.2 Botão +/- (Level Change)

**Sequência ao pressionar `+`:**

| Momento | Duração | Efeito |
|---------|---------|--------|
| `onPointerDown` | 0ms | Número aumenta instantaneamente (state update) |
| Frame 0 | 0ms | Botão: `scale(0.90)` |
| Frame 1 (16ms) | — | Número: `scale(1.15)` + `text-gold-300 → text-gold-100` |
| 80ms | — | Botão: `scale(1.0)` (spring back) |
| 180ms | — | Número: `scale(1.0)` + volta a `text-gold-300` |

**CSS Keyframe (número):**
```css
@keyframes levelBump {
  0%   { transform: scale(1); }
  30%  { transform: scale(1.18); color: var(--color-gold-100); }
  100% { transform: scale(1); color: var(--color-gold-300); }
}

.level-bump {
  animation: levelBump 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

**Sequência ao pressionar `−`:**

| Momento | Duração | Efeito |
|---------|---------|--------|
| `onPointerDown` | 0ms | Número diminui instantaneamente |
| Frame 0 | 0ms | Botão: `scale(0.90)` |
| Frame 1 | 0ms | Número: `scale(0.85)` + `text-ruby-300` |
| 80ms | — | Botão: volta |
| 180ms | — | Número: `scale(1.0)` + `text-gold-300` |

```css
@keyframes levelDip {
  0%   { transform: scale(1); }
  30%  { transform: scale(0.82); color: var(--color-ruby-300); }
  100% { transform: scale(1); color: var(--color-gold-300); }
}
```

---

### 5.3 Mudança de Líder

Quando um jogador ultrapassa o líder atual:

**Card do novo líder:**
```css
@keyframes leaderCrown {
  0%   { box-shadow: none; border-color: var(--color-border-default); }
  50%  { box-shadow: var(--glow-leader); border-color: var(--color-gold-500); transform: scale(1.02); }
  100% { box-shadow: var(--glow-leader); border-color: var(--color-gold-500); transform: scale(1); }
}
```
Duração: 400ms, `ease-out`.

**Badge "LÍDER"** faz fade-in com `translateY(-4px → 0)`.

**Card do ex-líder:**
- Borda volta para `border-default` em 300ms com ease.

---

### 5.4 Drag & Drop

**Durante o arraste:**
- Card sendo arrastado: `opacity: 0.4`, `scale(1.02)`, cursor `grabbing`.
- `DragOverlay` (clone): `opacity: 0.9`, `rotate(-2deg)`, `shadow-lg`.
- Slot de destino: borda tracejada `border-dashed border-gold-700` + fundo `bg-bg-elevated`.

**Drop:**
```css
@keyframes dropSettle {
  0%   { transform: scale(1.02) rotate(-1deg); }
  60%  { transform: scale(0.98); }
  100% { transform: scale(1) rotate(0deg); }
}
```
Duração: 200ms, `cubic-bezier(0.22, 1, 0.36, 1)`.

---

### 5.5 Hold para Encerrar (3 segundos)

**Estados visuais:**

| Tempo | Visual |
|-------|--------|
| 0ms (início) | Borda muda de `ruby-700` para `ruby-500`. Vibração curta (50ms) |
| 0–3000ms | `scaleY(progress)` preenchendo o background rubi de baixo para cima |
| 1500ms | Segunda vibração (100ms) — feedback de meio do caminho |
| 3000ms | Flash branco (200ms) → transição para tela de resumo. Vibração (200ms) |
| Cancelado | Progresso retorna a 0 em `transition: transform 300ms ease-out` |

```css
@keyframes holdFlash {
  0%   { opacity: 1; }
  50%  { opacity: 0; background: white; }
  100% { opacity: 1; }
}
```

---

### 5.6 Estado de Vitória

Quando um jogador atinge nível 11 (ou 21 no Modo Épico):

**Sequência:**
1. Card inteiro: `scale(1 → 1.08 → 1)` em 500ms
2. Número muda de cor: `gold-300 → emerald-300`
3. Glow-victory aplica-se ao card
4. Badge Trophy faz `bounceIn` de `scale(0) → scale(1.2) → scale(1)` em 400ms
5. Confetti localizado (15 partículas) explode a partir do card (CSS particles, sem biblioteca)
6. TTS automático: `"${nome} venceu! Parabéns!"`

```css
@keyframes victoryPulse {
  0%, 100% { box-shadow: var(--glow-victory); }
  50%       { box-shadow: 0 0 40px rgba(77,184,122,0.7), 0 0 100px rgba(77,184,122,0.3); }
}

.card-victory {
  animation: victoryPulse 2s ease-in-out infinite;
}
```

---

### 5.7 Entrada da Tela de Partida

Quando a tela de partida carrega, os cards entram com `stagger`:

```css
@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.player-card:nth-child(1) { animation: cardEnter 300ms 0ms ease-out both; }
.player-card:nth-child(2) { animation: cardEnter 300ms 60ms ease-out both; }
.player-card:nth-child(3) { animation: cardEnter 300ms 120ms ease-out both; }
.player-card:nth-child(4) { animation: cardEnter 300ms 180ms ease-out both; }
.player-card:nth-child(5) { animation: cardEnter 300ms 240ms ease-out both; }
.player-card:nth-child(6) { animation: cardEnter 300ms 300ms ease-out both; }
```

Em React: usar `index * 60` como delay em `style={{ animationDelay: '...' }}`.

---

### 5.8 Toast / Feedback de Salvamento

Ao salvar estado automaticamente, exibe toast não-intrusivo:

- Posição: canto inferior esquerdo (longe dos botões de ação)
- Duração: 1500ms
- Visual: fundo `bg-bg-elevated border border-border-subtle` + ícone check
- Entrada: `slideInLeft 200ms` | Saída: `fadeOut 200ms`

---

## 6. Responsive Breakpoints

### 6.1 Definição de Breakpoints

```js
// tailwind.config.js
screens: {
  'xs': '390px',   // iPhone SE / Android pequeno
  'sm': '640px',   // Tablet portrait menor
  'md': '768px',   // Tablet portrait
  'lg': '1024px',  // Tablet landscape / Desktop pequeno
  'xl': '1280px',  // Desktop
  '2xl': '1536px', // Desktop wide
}
```

### 6.2 Comportamento por Breakpoint

| Elemento | xs (390px) | sm (640px) | md (768px) | lg (1024px) | xl (1280px) |
|----------|-----------|-----------|-----------|------------|------------|
| PlayerGrid | 1 col | 1 col | 2 col | 2-3 col | 2-4 col |
| Número de nível | 72px | 80px | 88px | 96px | 96px |
| LevelButton altura | 64px | 64px | 64px | 56px | 56px |
| Header altura | 56px | 56px | 64px | 64px | 64px |
| Card padding | 12px | 14px | 16px | 16px | 20px |
| Ad Banner | 320×50 | 320×50 | 468×60 | 728×90 | 728×90 |

### 6.3 Android (React Native)

**Dimensões alvo:**
- Telefones pequenos: 360×640dp (mínimo suportado)
- Telefones padrão: 390×844dp
- Telefones grandes: 430×932dp

**SafeArea:**
- `SafeAreaView` com `edges={['top', 'bottom']}` em todas as telas raiz.
- Bottom bar levanta acima da home indicator (≥ 34pt).

**Equivalência de componentes:**

| Web | React Native |
|-----|-------------|
| `div.player-grid` CSS Grid | `FlatList` com `numColumns` calculado |
| `button.level-button` | `Pressable` com `scale` via `Animated.spring` |
| CSS `@keyframes` | `Animated.timing` / `Animated.spring` |
| `position: sticky` header | `stickyHeaderIndices` no FlatList |
| Drag & Drop `@dnd-kit` | `react-native-draggable-flatlist` |

**Escala de nível no RN:**
```tsx
// Usa Animated.spring para o bump no nível
const scaleAnim = useRef(new Animated.Value(1)).current;

const animateLevel = () => {
  Animated.sequence([
    Animated.spring(scaleAnim, { toValue: 1.18, useNativeDriver: true }),
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
  ]).start();
};
```

### 6.4 Orientação Landscape (Web + Android)

Em landscape (≥ 600px height):
- PlayerGrid expande para mais colunas.
- Header se compacta para 48px.
- Número de nível reduz para 64px para caber mais informação vertical.

---

## 7. Acessibilidade

### 7.1 Tap Targets (WCAG 2.5.5)

| Componente | Tamanho mínimo | Implementação |
|-----------|---------------|--------------|
| LevelButton (+/-) | 64×64px | `h-16 w-full` (≥ 64px) |
| Checkbox de jogador | 48×48px | `p-3` no `<li>` wrapper |
| Toggle Modo Épico | 48px área | `<label>` envolvendo todo o item |
| Botão de header | 44×44px | `p-2 -mx-2` com `min-h-[44px]` |
| Drag handle | 44×44px | Área expandida com padding |
| HoldButton | 80px tall, full-width | `h-20 w-full` |

### 7.2 Contraste (WCAG AA)

| Combinação | Ratio | Aprovação |
|-----------|-------|----------|
| `text-gold-300` em `bg-bg-surface` | 7.2:1 | AAA |
| `text-text-primary` em `bg-bg-surface` | 9.1:1 | AAA |
| `text-text-secondary` em `bg-bg-surface` | 4.8:1 | AA |
| `text-text-inverse` em `bg-gold-500` | 5.3:1 | AA |
| `text-white` em `bg-ruby-500` | 5.9:1 | AA |
| `text-text-muted` em `bg-bg-surface` | 2.9:1 | Apenas texto grande (≥18px) |

### 7.3 ARIA Labels

```html
<!-- LevelButton -->
<button aria-label="Aumentar nível de Claudio (atual: 7)">+</button>
<button aria-label="Diminuir nível de Claudio (atual: 7)">-</button>

<!-- PlayerCard -->
<article
  role="article"
  aria-label="Claudio, nível 7, líder atual"
  aria-live="polite"
  aria-atomic="true"
>

<!-- HoldButton -->
<button
  aria-label="Encerrar partida (pressione por 3 segundos)"
  aria-describedby="hold-hint"
>
<span id="hold-hint" class="sr-only">
  Mantenha pressionado por 3 segundos para encerrar a partida
</span>

<!-- Drag Handle -->
<div
  role="button"
  aria-label="Arrastar Claudio para reordenar"
  aria-roledescription="sortable"
  tabindex="0"
>

<!-- EpicModeToggle -->
<input
  type="checkbox"
  role="switch"
  aria-label="Modo Épico"
  aria-checked={enabled}
  aria-describedby="epic-mode-desc"
/>
<span id="epic-mode-desc">
  Ativa nível máximo 20 e vitória em nível 21
</span>
```

### 7.4 Operação com Uma Mão

**Estratégia: Zone of Comfort (ZoC)**

A zona de alcance do polegar ao segurar o telefone com a mão direita alcança facilmente até ~60% da tela (parte inferior e centro).

**Aplicação:**
- Botões +/- ficam na metade inferior do card, não no topo.
- Na tela de partida mobile, os cards mais críticos ficam na parte inferior da lista (por isso a ordenação "maior nível primeiro" coloca o líder — o jogador mais ativo — no topo, mas em lista de 2-3 jogadores, todos ficam na ZoC).
- Header actions (sort, TTS) ficam em menu de contexto (`bottom sheet`) em mobile, não no topo.
- Hold button é `w-full` e fixado na barra inferior — acessível ao polegar.

**Bottom Sheet para Ações Secundárias (Mobile):**
- Sort, gráfico, configurações ficam em bottom sheet (não em header) no mobile.
- Altura: 40% da viewport. Handle no topo.
- Drag down para fechar.

### 7.5 Navegação por Teclado (Web)

- `Tab` navega entre cards na ordem do grid.
- `Enter` / `Space` nos botões +/-.
- `Escape` fecha modais e bottom sheets.
- Cards podem ser reordenados com teclado:
  - `Space` seleciona o card
  - `Arrow Up/Down` move a posição
  - `Space` / `Enter` confirma

### 7.6 Screen Reader

- `aria-live="polite"` no número de nível — anuncia mudança sem interromper.
- `aria-live="assertive"` no estado de vitória — anuncia imediatamente.
- Gráfico de progresso: tabela `<table>` como alternativa textual acessível.
- `role="status"` no toast de salvamento.

### 7.7 Preferências de Acessibilidade

```css
/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .level-bump, .card-enter, .leader-crown, .victory-pulse {
    animation: none;
  }
  .player-card {
    transition: none;
  }
}

/* High contrast */
@media (forced-colors: active) {
  .level-button { forced-color-adjust: none; }
  .player-card  { border: 2px solid ButtonText; }
}
```

---

## 8. Tokens de Decisão

### 8.1 Framework de Cores — Avatar de Jogadores

Paleta de 8 cores para identificação de jogadores. São distintas entre si e legíveis sobre `bg-bg-surface`:

```ts
export const AVATAR_COLORS = {
  gold:     '#c9943a',
  ruby:     '#b02828',
  emerald:  '#2d7a4a',
  sapphire: '#1a5c9e',
  amethyst: '#7a28b0',
  bronze:   '#8c5e28',
  crimson:  '#9e1a3c',
  teal:     '#1a7a6e',
} as const;
```

### 8.2 Máximos e Mínimos de Jogadores

| Parâmetro | Valor | Racional |
|-----------|-------|---------|
| Mínimo de jogadores | 2 | Regra do jogo |
| Máximo de jogadores | 6 | Limite do grid 3×2 no desktop |
| Nível mínimo | 1 | Não permite ir abaixo de 1 |
| Nível máximo (Normal) | 10 | Regra padrão Munchkin |
| Nível máximo (Épico) | 20 | Modo Épico ativo |
| Nível de vitória (Normal) | 11 | Por kill (mata monstro no nível 10) |
| Nível de vitória (Épico) | 21 | Por kill no nível 20 |

### 8.3 Timing de Animações

| Animação | Duração | Easing |
|----------|---------|--------|
| Level bump (+) | 180ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring) |
| Level dip (-) | 180ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Button press | 80ms | `ease-out` |
| Leader glow | 400ms | `ease-out` |
| Card enter | 300ms | `ease-out` |
| Card drop settle | 200ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Victory pulse | 2000ms | `ease-in-out` (loop) |
| Modal open | 250ms | `ease-out` |
| Toast slide | 200ms | `ease-out` |
| Hold progress | linear | — |

### 8.4 Z-Index Scale

```css
:root {
  --z-base:    0;
  --z-card:    10;
  --z-drag:    100;
  --z-sticky:  200;
  --z-overlay: 300;
  --z-modal:   400;
  --z-toast:   500;
}
```

---

## Apêndice — Checklist de Revisão

Antes de marcar qualquer story de UI como Done, verificar:

- [ ] Fonte `Cinzel Decorative` carregando no display de nível
- [ ] Contraste de todos os pares de texto verificado (ferramenta: Colour Contrast Analyser)
- [ ] Tap targets ≥ 44px em mobile (Chrome DevTools touch simulation)
- [ ] Animação de level bump funcionando < 100ms após clique
- [ ] Estado de líder com glow visível
- [ ] Estado de vitória com glow verde e badge Trophy
- [ ] HoldButton cancelando ao soltar antes de 3s
- [ ] `aria-live` anunciando mudanças de nível no VoiceOver/TalkBack
- [ ] `prefers-reduced-motion` desativando animações decorativas
- [ ] Grid responsivo: 1 col (mobile) → 2 col (tablet) → 4 col (desktop)
- [ ] Bottom sheet de ações funcionando no mobile
- [ ] Drag & Drop funcional em touch e mouse
- [ ] Toast de salvamento aparecendo longe dos botões de ação

---

*Front-End Spec — Munchkin Level Tracker v1.0 | @ux-design-expert (Uma)*
