# GeoAmbiental VR — Material de portfólio

> Documento curto pra te ajudar a apresentar o projeto em LinkedIn, currículo e entrevista.
> Ajusta os textos com sua voz antes de publicar.

---

## 🎯 Pitch (1 frase)

> Mapa interativo de Volta Redonda construído em React 19 + TypeScript + OpenLayers,
> com dados oficiais do IBGE e um editor visual de posicionamento que existe **só em modo dev**.

## 🧠 Pitch (3-5 linhas, pra LinkedIn / currículo)

GeoAmbiental VR é uma aplicação web frontend que permite explorar visualmente
dados ambientais e geoespaciais de Volta Redonda / RJ. Combina mapa interativo
(OpenLayers + OpenStreetMap), camadas temáticas controladas pelo usuário
(áreas verdes, hidrografia, impacto ambiental, POIs) e dados estatísticos
do IBGE consumidos via API. Inclui um editor visual de posicionamento das
features que só fica disponível em modo desenvolvimento — em produção o
endpoint de escrita não existe (Vite plugin com `apply: 'serve'`).

---

## ✨ Features que vale destacar

- **Mapa interativo** com OpenLayers 10 + OpenStreetMap, projeções EPSG:4326 → EPSG:3857
- **4 camadas vetoriais** controladas individualmente (toggle + ações em massa)
- **Sidebar dark** com escopo CSS isolado (não polui o resto do app)
- **Cards de detalhes** com tint da cor da camada selecionada
- **Dados IBGE reais** (população, área, densidade) com tolerância a falhas parciais
- **Editor visual de posicionamento** apenas em dev: arrasta features, salva direto em disco
- **Dev/prod cleanly split**: build de produção tem **zero código** do editor (verificado via grep no bundle)
- **Design system** em CSS Variables com bridge para Tailwind — trocar paleta = um arquivo só
- **Conventional Commits** + **Spec-Driven Development** ao longo de todas as sprints

---

## 🧱 Stack

| Camada | Tecnologia |
|---|---|
| UI | React 19, TypeScript strict |
| Build | Vite 6 (com Vite plugin custom para o editor dev) |
| Mapa / GIS | OpenLayers 10, OpenStreetMap |
| Estado | Zustand 5 |
| Estilo | Tailwind 3 + CSS Modules + CSS Variables (bridge) |
| Dados | API IBGE v1/v3, GeoJSON estático |

---

## 📝 Template — post LinkedIn

```
🌍 Acabei de subir o GeoAmbiental VR — um mapa interativo de Volta Redonda
que combina visualização geoespacial com dados oficiais do IBGE.

Stack: React 19 + TypeScript strict + Vite 6 + OpenLayers 10 + Zustand.

Diferenciais técnicos:
✅ Arquitetura por features (shared / features / services)
✅ Design system com bridge CSS Variables ↔ Tailwind
✅ Editor visual de posicionamento de features — disponível APENAS em
   modo desenvolvimento (Vite plugin com apply: 'serve'). Em produção o
   endpoint nem existe e o código é tree-shaken do bundle.
✅ Cliente IBGE com tolerância a falhas parciais (3 chamadas em paralelo)
✅ Spec-Driven Development com commits atômicos em Conventional Commits

Dados ambientais reais (com posicionamento aproximado a ser refinado),
sidebar com tema dark isolado para criar contraste com o mapa, e UX
pensada pra exploração visual.

Repositório aberto: <link do GitHub>
Demo: <link da Vercel/Netlify>

#React #TypeScript #OpenLayers #GIS #FrontendDev
```

---

## 📝 Template — entrada no currículo

**GeoAmbiental VR** — Mapa Ambiental Interativo de Volta Redonda
*Projeto pessoal • [Repositório] • [Demo]*

- Frontend em **React 19 + TypeScript strict + Vite 6**, arquitetura por features
- Mapa GIS com **OpenLayers 10**, 4 camadas vetoriais carregadas de GeoJSON estático
- Integração com **API IBGE** (3 chamadas paralelas, tolerância a falha parcial)
- **Editor visual** de posicionamento (drag + salvar) ativo apenas em dev — Vite plugin
  custom expõe POST `/api/dev/save-layer` com `apply: 'serve'`, **excluído do bundle de
  produção** (tree-shaken e validado via grep)
- **Design system** com CSS Variables + Tailwind bridge; sidebar dark com escopo CSS
  isolado
- Histórico Git em **Conventional Commits**, metodologia **Spec-Driven Development**

---

## 💬 Talking points (entrevista técnica)

Use esses pra puxar conversa quando perguntarem sobre o projeto:

1. **Por que OpenLayers e não Leaflet?**
   OL é mais robusto pra GIS sério: projeções nativas (EPSG:4326 ↔ EPSG:3857
   automaticamente), GeoJSON pesado sem perder performance, suporte a edição
   (Translate + Modify) que usei no editor dev.

2. **Por que Zustand e não Context / Redux?**
   Zustand é ~3 KB, sem boilerplate, e permite acesso fora de componentes
   (`useStore.getState()`) — necessário pro hook `useMap` registrar refs
   sem virar component.

3. **Por que CSS Variables + Tailwind ao invés de só um?**
   Tailwind cobre layout/spacing/responsive de forma rápida no JSX. CSS Vars
   fazem o design system ser trocável em um arquivo. A bridge no
   `tailwind.config.ts` aponta as escalas (forest, water, ink) para vars CSS.

4. **Como o editor dev-only funciona?**
   Vite tem `apply: 'serve'` em plugin definitions, que faz o plugin existir
   só em `vite dev`. O middleware expõe POST `/api/dev/save-layer` que valida
   layerId em whitelist, valida o GeoJSON, escreve atomicamente (tmp + rename).
   Em build de produção o middleware nem é referenciado.

5. **Como você garantiu que o editor é tree-shaken da produção?**
   Renderizo `{import.meta.env.DEV && <EditorPanel />}` na Sidebar. Em build,
   `import.meta.env.DEV` vira `false` literal, o JSX vira `false && ...`,
   e o Rollup tree-shaka o import e suas dependências (Translate, Modify, etc).
   Validei via `grep -c "EditorPanel\|api/dev" dist/assets/*.js` → 0.

6. **Como funciona o "dark scope" da sidebar?**
   A sidebar redefine os tokens semânticos (`--color-bg-surface`,
   `--color-text-primary`, etc) dentro do seu seletor CSS. Como CSS variables
   herdam por DOM, todos os componentes filhos (Card, Toggle, Button)
   automaticamente usam os tokens dark sem precisar de variants ou props.

7. **Tolerância a falha parcial no cliente IBGE — por quê?**
   `getMunicipalityStats` faz 3 chamadas paralelas (população, área,
   densidade). Cada uma tem `.catch(() => null)`. Se uma falha, o campo
   vem `undefined` e o `formatInteger` exibe `—`. UX continua funcional
   mesmo com endpoint flaky.

---

## 🚀 Antes de publicar

- [ ] Validar/corrigir as posições dos landmarks com o editor dev
- [ ] Subir build na Vercel/Netlify e atualizar links no README
- [ ] Adicionar screenshot ou GIF curto do app no README
- [ ] Atualizar `APP.repo` em `src/shared/constants.ts`
- [ ] Conferir que a [`README`](../README.md) não tem placeholders soltos
