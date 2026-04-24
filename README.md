# GeoAmbiental VR

> Mapa Ambiental Interativo de **Volta Redonda / RJ** — visualização e análise de dados geoespaciais ambientais no frontend.

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)](#)
[![OpenLayers](https://img.shields.io/badge/OpenLayers-10-1f6b75)](#)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)](#)

---

## Sumário
- [Visão geral](#visão-geral)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Sprints](#sprints)
- [Metodologia (Spec-Driven Development)](#metodologia-spec-driven-development)
- [Setup](#setup)
- [Scripts](#scripts)
- [Dados das camadas](#dados-das-camadas)
- [Sobre os commits](#sobre-os-commits)
- [Licença](#licença)

---

## Visão geral

Aplicação web frontend que permite explorar visualmente dados ambientais e geoespaciais
do município de Volta Redonda. O usuário pode ativar/desativar camadas temáticas
(áreas verdes, hidrografia, impacto ambiental, pontos de interesse), clicar em features
para inspecionar atributos, e consultar dados estatísticos oficiais do IBGE no painel lateral.

**Diferenciais técnicos:**
- Arquitetura por features com isolamento por domínio
- Design system baseado em CSS variables, com bridge para Tailwind
- OpenLayers usado diretamente (sem wrapper React desatualizado)
- Estado global enxuto com Zustand
- TypeScript strict + tipos compartilhados ponta-a-ponta
- Tolerância a falhas parciais nas chamadas IBGE

---

## Stack

| Camada | Tecnologia |
|---|---|
| Build & dev server | Vite 6 |
| UI framework | React 19 |
| Linguagem | TypeScript (strict) |
| Mapa & GIS | OpenLayers 10 + OpenStreetMap |
| Estado global | Zustand 5 |
| Estilo | Tailwind 3 + CSS Modules + CSS Variables |
| Dados estatísticos | API IBGE v1/v3 |

---

## Arquitetura

```
src/
├── shared/              # Reutilizável e agnóstico de feature
│   ├── components/      # Button, Card, Toggle, Spinner, Badge (cada um com .module.css)
│   ├── styles/          # colors.css, variables.css, globals.css
│   ├── utils/           # formatters, classnames
│   ├── types/           # tipos compartilhados (FeatureProperties, IBGEMunicipalityStats…)
│   └── constants.ts     # VOLTA_REDONDA, MAP_CONFIG, LAYERS, IBGE
├── features/            # Domínio da aplicação, isolado por contexto
│   ├── map/             # OpenLayers — MapView + useMap + layerStyles
│   ├── layers/          # Toggle de camadas + zustand store
│   └── info-panel/      # Sidebar IBGE + detalhes da feature selecionada
├── services/            # Clientes externos: IBGE + loader de GeoJSON
├── App.tsx              # Shell: header + main(sidebar + map)
└── main.tsx
public/
└── data/                # GeoJSONs estáticos (mock — ver aviso abaixo)
```

**Decisões-chave:**

- **`shared/` vs `features/`** — `shared` tem zero dependência de domínio. `features` pode importar de `shared`, mas nunca o inverso.
- **CSS Module por componente + Tailwind** — Tailwind para layout/spacing/responsivo no JSX; CSS Module para estilo encapsulado, animações e overrides do OpenLayers.
- **Bridge tokens → Tailwind** — toda cor é definida em `colors.css` como CSS variable e exposta no `tailwind.config.ts`. Trocar a paleta = alterar um arquivo.
- **Path aliases** — `@/shared`, `@/features`, `@/services` evitam imports relativos longos.

---

## Sprints

O desenvolvimento foi organizado em quatro sprints curtas, executadas sequencialmente.
Cada sprint produziu um conjunto de commits coerentes (ver [Sobre os commits](#sobre-os-commits)).

### Sprint 0 — Scaffold & Toolchain
> *Objetivo: ambiente de desenvolvimento funcional, build verde, zero código de produto.*

- ✅ Vite + React 19 + TypeScript em modo strict
- ✅ Path aliases (`@/shared`, `@/features`, `@/services`)
- ✅ Tailwind 3 com bridge para CSS variables
- ✅ `.gitignore` para projeto público (sem leak de `.env`, `node_modules`, build, IDE)
- ✅ `.env.example` documentando variáveis IBGE

### Sprint 1 — Design System
> *Objetivo: paleta, tokens e componentes base reutilizáveis antes de qualquer feature.*

- ✅ Paleta ambiental (forest / water / earth / ink + semânticas)
- ✅ Tokens de spacing, tipografia, radius, sombras, transitions, z-index
- ✅ Globals + reset + overrides do OpenLayers harmonizados
- ✅ Componentes: `Button`, `Card`, `Toggle`, `Spinner`, `Badge`
- ✅ Utils: `cx` (classnames), formatadores pt-BR (inteiro, decimal, coordenadas)

### Sprint 2 — Domain & Data
> *Objetivo: contratos de dados, services externos e camadas mock para desenvolvimento isolado.*

- ✅ Tipos: `FeatureProperties`, `SelectedFeature`, `IBGEMunicipalityStats`
- ✅ Constantes: VR (centro, código IBGE), config do mapa, metadados das camadas
- ✅ Cliente IBGE: município + agregações (população, área, densidade) com tolerância a falha parcial
- ✅ Loader genérico de GeoJSON com validação de estrutura
- ✅ 4 GeoJSONs mock (áreas verdes, hidrografia, impacto, POIs) + README de dados
- ✅ Store Zustand para visibilidade de camadas + feature selecionada

### Sprint 3 — Map & UI Features
> *Objetivo: o produto em si — mapa interativo + painéis funcionais.*

- ✅ `MapView` + `useMap` (OpenLayers): tiles OSM, vector layers a partir dos GeoJSONs, controles (zoom + escala)
- ✅ `layerStyles`: estilos por tipo de geometria (polígono, linha, ponto) + estado selecionado
- ✅ Clique no mapa → highlight visual + atualiza store
- ✅ `LayerPanel`: toggle individual + ações em massa (Tudo / Nada)
- ✅ `IbgeCard`: dados oficiais com loading, erro e fallback parcial
- ✅ `FeatureCard`: detalhes da feature selecionada com escala visual de severidade
- ✅ `Sidebar`: composição responsiva (vira bottom em < 768px)

### Sprint 4 — Documentação & Histórico
> *Objetivo: projeto pronto pra portfólio público.*

- ✅ README com sprints, arquitetura, metodologia
- ✅ Aviso explícito sobre dados mock em `public/data/README.md`
- ✅ Histórico Git limpo, com commits separados em padrão Conventional Commits

---

## Metodologia (Spec-Driven Development)

O projeto foi desenvolvido seguindo **Spec-Driven Development**: a especificação
funcional e arquitetural é definida **antes** de qualquer código, e cada incremento
de implementação é validado contra essa especificação.

Fluxo aplicado em cada sprint:

1. **Spec** — definição clara do escopo (escopo funcional, contratos de tipos, dependências, critérios de aceitação)
2. **Design** — decisões arquiteturais explícitas (estrutura de pastas, tokens, padrões de componente)
3. **Implementation** — código orientado pela spec; quando havia dúvida, a spec era atualizada antes do código
4. **Validation** — `tsc -b` (type-check), `vite build` (build de produção) e teste manual no dev server a cada incremento
5. **Commit** — commits pequenos e atômicos com Conventional Commits, contando a história da spec

Refatorações foram feitas no escopo de cada sprint (ex: `Card` precisou de `Omit<HTMLAttributes, 'title'>`
quando descobriu-se conflito com `title: ReactNode`; `useMap` foi reescrito quando a colisão entre
`Map` (OL) e `Map` (global) virou um type-cast feio). Refator é parte do ciclo, não uma fase à parte.

---

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

App em **http://localhost:5173**.

### Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_IBGE_API_URL` | `https://servicodados.ibge.gov.br/api/v1` | Endpoint base da API do IBGE |
| `VITE_IBGE_VR_CODE` | `3306305` | Código do município de Volta Redonda |

---

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Dev server com HMR |
| `npm run build` | Type-check + build de produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm run type-check` | `tsc --noEmit` |

---

## Dados das camadas

> ⚠️ **Os GeoJSONs em `public/data/` são DADOS ILUSTRATIVOS / MOCK.**
> Coordenadas, nomes e categorias **não correspondem à realidade cartográfica** de Volta Redonda.
> Existem apenas para que a aplicação tenha algo a renderizar durante o desenvolvimento.
>
> Veja [`public/data/README.md`](public/data/README.md) para o schema esperado e as fontes recomendadas
> (OpenStreetMap, MapBiomas, ANA, IBAMA, INEA) ao substituir por dados reais.

Os dados estatísticos do município (população, área, densidade) **são reais**,
consumidos diretamente da [API IBGE](https://servicodados.ibge.gov.br/api/docs).

---

## Sobre os commits

O histórico Git deste repositório foi gerado de forma incremental usando o
**[Claude Code](https://claude.com/claude-code)** (Anthropic) como par de programação,
seguindo a metodologia Spec-Driven descrita acima.

- Toda a **autoria, refatorações e validações** (type-check, build, smoke test no dev server) foram conduzidas pelo agente.
- Os commits seguem o padrão **[Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/)** (`feat`, `fix`, `chore`, `docs`, `refactor`…), agrupados por sprint e por área de impacto.
- Cada commit é atômico — descreve uma única intenção e mantém o type-check verde.
- Mensagens em inglês para alinhamento com a convenção; descrições e código em português onde fizer sentido para o domínio.

Para inspecionar a evolução:

```bash
git log --oneline --graph
```

---

## Licença

MIT
