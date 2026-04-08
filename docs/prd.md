# PRD — Munchkin Level Tracker

**Versão:** 1.0
**Data:** 2026-04-08
**Status:** Aprovado

## 1. Visão Geral

**Nome do Produto:** Munchkin Level Tracker
**Plataformas:** Web (browser) + Android
**Tipo:** Aplicativo companion para jogos presenciais

### Objetivo

Desenvolver uma aplicação para gerenciar partidas presenciais de *Munchkin*, com foco em:

* Visibilidade clara dos níveis dos jogadores
* Atualização rápida e intuitiva
* Persistência automática do estado do jogo
* Sincronização em nuvem

---

## 2. Problema

Jogadores de Munchkin enfrentam:

* Controle manual confuso (papel, apps genéricos)
* Perda de progresso ao sair do app
* Falta de visão clara da evolução da partida
* Baixa usabilidade em apps existentes

---

## 3. Objetivos do Produto

### Objetivos Primários

* Garantir controle de níveis simples e rápido
* Evitar perda de dados (persistência em tempo real)
* Melhorar experiência social da mesa

### Objetivos Secundários

* Criar diferenciação com features imersivas (narração, gráfico)
* Permitir monetização leve (ads)

---

## 4. Personas

### Jogador Casual

* Usa o app durante partidas com amigos
* Quer rapidez e simplicidade

### Host/Organizador

* Controla a partida
* Precisa de visão geral clara

---

## 5. Funcionalidades

### 5.1 Menu Principal

O menu deve conter:

* **Cadastro de Jogadores**
  * Campos: Nome, Avatar, Cor identificadora

* **Novo Jogo**

* **Continuar Partida**
  * Visível apenas se houver jogo salvo
  * Deve restaurar estado completo

* **Regras (PDF)**

* **Dúvidas (NotebookLM)**
  * Link externo

* **Configurações**
  * Seleção de voz do narrador

* **Espaço para anúncios**
  * Integração com AdSense

---

### 5.2 Fluxo de Novo Jogo

#### 1. Seleção de Jogadores

* Lista de jogadores cadastrados
* Opção de cadastro rápido inline

#### 2. Configuração de Partida

* Checkbox: **Modo Épico**
  * OFF: Nível máximo 10, Vitória em 11
  * ON: Nível máximo 20, Vitória em 21

---

### 5.3 Tela de Partida (Core Feature)

#### Layout: Grid de Jogadores

Cada jogador exibe:

* Nome
* Nível atual
* Botões: ➕ incrementar nível / ➖ decrementar nível

#### Controle de Nível

* Atualização instantânea
* Persistência automática

#### Organização

* Ordenação por: Maior nível / Aleatório
* Drag & Drop manual

#### Narração (Text-to-Speech)

* Botão de destaque
* Exemplo: "Claudio nível 6, Padova nível 4..."

#### Gráfico de Progresso

* Linha do tempo dos níveis
* Atualização automática a cada 15 minutos

---

### 5.4 Persistência e Segurança

#### Salvamento Automático (CRÍTICO)

* Trigger: Alteração de nível / Alteração de posição
* Salva: Estado completo (jogadores + níveis + ordem)

#### Finalização de Partida

* Botão com interação: pressionar por 3 segundos
* Feedback visual (progress bar)

#### Limpeza de Dados

* Ao finalizar: Deletar permanentemente o estado da partida
* Não manter histórico

---

## 6. Requisitos Técnicos

### 6.1 Backend / Banco de Dados

* Cloud-based
* Tempo real (ou quase)
* Plano gratuito utilizável
* Baixa latência
* SDK simples para web + mobile

**Decisão:** Supabase (PostgreSQL + Realtime + Auth embutido, plano free ideal para MVP)

### 6.2 Arquitetura Sugerida

* Frontend Web: React
* Frontend Mobile: React Native ou Flutter
* Backend: Supabase (BaaS)
* Realtime: WebSockets via Supabase Realtime

---

## 7. Requisitos Não Funcionais

| Requisito | Meta |
|-----------|------|
| Performance | Atualização de nível < 100ms |
| Usabilidade | Operável com uma mão |
| Confiabilidade | Zero perda de estado |
| Offline (futuro) | Cache local com sync posterior |

---

## 8. Métricas de Sucesso

* Tempo médio de interação por partida
* Número de partidas iniciadas vs finalizadas
* Retenção de usuários
* Uso da função de narração
* Frequência de salvamento sem erro

---

## 9. Roadmap

### MVP

* Cadastro de jogadores
* Novo jogo
* Grid com níveis
* Salvamento automático
* Continuar partida

### V1

* Narração (TTS)
* Gráfico de progresso
* Ordenação + drag & drop

### V2

* Multiplayer sincronizado em tempo real
* Estatísticas históricas
* Customizações avançadas

---

## 10. Riscos

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Perda de estado | Crítico | Zustand persist (localStorage) + Supabase cloud backup; restauração por comparação de timestamp ao abrir o app |
| Complexidade de realtime sync | Alto | Adiado para V2; MVP usa single-device com Supabase como backup assíncrono (LWW em V2) |
| UX ruim em mesa (muitos cliques) | Médio | Design Zone of Comfort (botões na metade inferior da tela), tap targets ≥ 64px, operação com uma mão validada na Front-End Spec |
| Dependência de conexão | Médio | Local-first: localStorage é source of truth durante partida; sync queue enfileira writes offline e sincroniza ao reconectar |

---

## 11. Épicos

| ID | Épico | Fase |
|----|-------|------|
| EP-01 | Setup & Infraestrutura | MVP |
| EP-02 | Gerenciamento de Jogadores | MVP |
| EP-03 | Fluxo de Novo Jogo | MVP |
| EP-04 | Tela de Partida — Core | MVP |
| EP-05 | Persistência & Salvamento | MVP |
| EP-06 | Narração TTS | V1 |
| EP-07 | Gráfico de Progresso | V1 |
| EP-08 | Ordenação & Drag & Drop | V1 |
| EP-09 | Multiplayer Realtime | V2 |
| EP-10 | Estatísticas Históricas | V2 |
