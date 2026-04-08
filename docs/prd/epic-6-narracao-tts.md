# Épico 6 — Narração TTS

**ID:** EP-06
**Fase:** V1
**Pontos:** 8

## Objetivo

Implementar a funcionalidade de narração dos níveis usando a Web Speech API (Text-to-Speech nativo do browser/OS), com botão de destaque na tela de partida, modal de configuração de voz nas Configurações e narração automática ao detectar condição de vitória.

## Stories

| Story ID | Título | Pts |
|----------|--------|-----|
| EP06-S01 | Hook useTTS | 3 |
| EP06-S02 | NarratorButton | 2 |
| EP06-S03 | Modal de Configurações — Voz | 2 |
| EP06-S04 | Narração automática de vitória | 1 |

## Contexto do PRD

### Tela de Partida — Narração (seção 5.3)

- Botão de destaque na tela de partida
- Exemplo de narração: "Claudio nível 6, Padova nível 4..."
- Narração lê os níveis de todos os jogadores em ordem

### Menu Principal — Configurações (seção 5.1)

- **Configurações** — contém seleção de voz do narrador

### Objetivos Secundários do Produto (seção 3)

- Criar diferenciação com features imersivas (narração, gráfico)

### Métricas de Sucesso (seção 8)

- Uso da função de narração (KPI a ser rastreado)

### Referência de Arquitetura

**Web Speech API** é identificada como sistema externo no diagrama C4:
- Sintetiza narração via API local do browser/OS
- Sem custo adicional, sem dependência de servidor externo
- Disponível em todos os browsers modernos e Android

**Componente NarratorButton** está na estrutura do frontend:
```
apps/web/src/components/NarratorButton/
```

**Hook useTTS** está na estrutura de hooks:
```
apps/web/src/hooks/useTTS.ts
```

### Exemplo de Texto Narrado

```
"Claudio está no nível 6. Padova está no nível 4. Banzai está no nível 3."
```

Ordem de narração: do maior nível para o menor.

## Critérios de Aceite do Épico

- [ ] Hook `useTTS` encapsula `window.speechSynthesis` com interface limpa (speak, stop, isSupported, voices)
- [ ] `NarratorButton` visível e destacado na tela de partida
- [ ] Ao tocar o botão, narra todos os jogadores em ordem decrescente de nível
- [ ] Formato de narração: "{Nome} nível {N}" para cada jogador
- [ ] Modal de Configurações permite selecionar a voz do narrador entre as disponíveis no dispositivo
- [ ] Configuração de voz persiste entre sessões (localStorage/Zustand)
- [ ] Narração automática disparada ao atingir condição de vitória
- [ ] Fallback gracioso quando Web Speech API não disponível (botão desabilitado com tooltip)
- [ ] Narração pode ser interrompida se botão pressionado novamente durante fala

## Dependências

- **EP-01** — Setup & Infraestrutura (design system, estrutura do projeto)
- **EP-04** — Tela de Partida — Core (PlayerGrid e estado dos jogadores para narrar)
- **EP-05** — Persistência & Salvamento (estado dos jogadores disponível no Zustand store)
