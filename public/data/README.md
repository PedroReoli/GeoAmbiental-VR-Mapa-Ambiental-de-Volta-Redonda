# Dados das Camadas — IMPORTANTE

> ⚠️ **Os GeoJSONs deste diretório são dados ILUSTRATIVOS / MOCK.**
>
> Coordenadas, nomes e categorias **não correspondem à realidade cartográfica**
> de Volta Redonda. Foram inseridos apenas para que a aplicação tenha algo a
> renderizar durante o desenvolvimento da UI/UX.

## Para usar dados reais

Substitua os arquivos abaixo mantendo o mesmo schema de `properties`:

| Arquivo | Camada | Schema de properties |
|---|---|---|
| `green-areas.geojson` | Áreas verdes | `id`, `name`, `layer: "green-areas"`, `category`, `description` |
| `water.geojson` | Hidrografia | `id`, `name`, `layer: "water"`, `category`, `description` |
| `impact.geojson` | Impacto ambiental | `id`, `name`, `layer: "impact"`, `category`, `severity` (1–5), `description` |
| `poi.geojson` | Pontos de interesse | `id`, `name`, `layer: "poi"`, `category`, `description` |

Os schemas estão tipados em [`src/shared/types/index.ts`](../../src/shared/types/index.ts).

## Fontes recomendadas para substituição

- **OpenStreetMap** (extração via Overpass Turbo, JOSM ou QGIS)
- **GeoSampa / dados abertos municipais**
- **MapBiomas** (cobertura vegetal)
- **ANA — Agência Nacional de Águas** (hidrografia)
- **IBAMA / INEA** (impactos ambientais oficiais)

## Projeção

Todos os arquivos devem estar em **EPSG:4326** (lat/lon). A reprojeção para
Web Mercator (EPSG:3857) é feita automaticamente pelo OpenLayers no carregamento.
