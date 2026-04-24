# Dados das Camadas

> ⚠️ As coordenadas atuais são **aproximadas**, baseadas em conhecimento geral
> dos landmarks de Volta Redonda. **Devem ser validadas e corrigidas** —
> use o editor visual descrito abaixo.

## Editor Visual (apenas em modo desenvolvimento)

A aplicação inclui um editor de posicionamento que **só fica disponível em
`npm run dev`**. Em build de produção o editor não é incluído.

### Como usar

1. Rode o dev server: `npm run dev`
2. No painel lateral, ative **"Modo edição"**
3. **Arraste qualquer feature** (ponto, linha, polígono) para a posição correta
4. As mudanças aparecem como pendentes na lista (uma camada pode ter várias)
5. Clique em **"Salvar tudo"** — o backend dev escreve direto em `public/data/<layer>.geojson`
6. Commit normalmente: `git add public/data/ && git commit -m "data: corrige posicao de X"`

### Como achar a posição correta

Algumas estratégias práticas:

- **Google Maps** — clica direito → "O que há aqui?" mostra latitude/longitude
- **OpenStreetMap** — `https://www.openstreetmap.org/?mlat=<LAT>&mlon=<LON>`
- **Cruzar referências** — endereço do landmark + busca no Google + comparar com OSM
- **Imagens de satélite** — confirma forma do parque/área pelo contorno visível

Para landmarks oficiais:
- **Prefeitura de VR** — site oficial pode ter geolocalização
- **OpenStreetMap (Overpass Turbo)** — extrair features oficiais por tipo
- **MapBiomas** — cobertura vegetal e desmatamento
- **ANA / SNIRH** — hidrografia oficial
- **IBAMA / INEA** — dados de impacto ambiental

### Sistema de coordenadas

Todos os arquivos devem estar em **EPSG:4326** (lat/lon decimal).
Formato GeoJSON usa `[longitude, latitude]` (lon primeiro, **não** lat).
O OpenLayers reprojeta automaticamente para EPSG:3857 (Web Mercator) ao carregar.

### Schema obrigatório por feature

```jsonc
{
  "type": "Feature",
  "properties": {
    "id": "<unique-id>",        // obrigatório
    "name": "<display name>",   // obrigatório
    "layer": "<layer-id>",      // obrigatório, deve bater com a camada
    "category": "<categoria>",  // opcional
    "severity": 1-5,            // apenas para layer 'impact'
    "description": "<texto>"    // opcional
  },
  "geometry": { ... }
}
```

Tipos de tipo TypeScript em [`src/shared/types/index.ts`](../../src/shared/types/index.ts).

## Arquivos

| Arquivo | Camada | Geometria | Schema extra |
|---|---|---|---|
| `green-areas.geojson` | Áreas verdes | `Polygon` | — |
| `water.geojson` | Hidrografia | `LineString` | — |
| `impact.geojson` | Impacto ambiental | `Point` | `severity: 1-5` |
| `poi.geojson` | Pontos de interesse | `Point` | — |
