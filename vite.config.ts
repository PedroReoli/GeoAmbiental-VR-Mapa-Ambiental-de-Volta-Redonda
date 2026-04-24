import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { writeFile, rename } from 'node:fs/promises';
import path from 'node:path';

const ALLOWED_LAYERS = new Set(['green-areas', 'water', 'impact', 'poi']);

/**
 * Plugin de DESENVOLVIMENTO.
 * Expoe POST /api/dev/save-layer para o editor visual escrever GeoJSON
 * em public/data/<layerId>.geojson. Tem `apply: 'serve'` => so existe
 * em `vite dev`, nao entra no bundle de producao.
 */
function devLayerSavePlugin(): Plugin {
  const projectRoot = fileURLToPath(new URL('.', import.meta.url));
  const dataDir = path.join(projectRoot, 'public', 'data');

  return {
    name: 'dev-layer-save',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/dev/save-layer', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Allow', 'POST');
          res.end('Method Not Allowed');
          return;
        }

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const raw = Buffer.concat(chunks).toString('utf-8');

          if (raw.length > 5 * 1024 * 1024) {
            res.statusCode = 413;
            res.end(JSON.stringify({ error: 'Payload too large' }));
            return;
          }

          const body = JSON.parse(raw) as {
            layerId?: string;
            featureCollection?: unknown;
          };

          if (!body.layerId || !ALLOWED_LAYERS.has(body.layerId)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `Invalid or missing layerId. Allowed: ${[...ALLOWED_LAYERS].join(', ')}` }));
            return;
          }

          const fc = body.featureCollection as { type?: string; features?: unknown[] } | undefined;
          if (!fc || fc.type !== 'FeatureCollection' || !Array.isArray(fc.features)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid GeoJSON: must be a FeatureCollection with features array' }));
            return;
          }

          // Path traversal defense — rejoin garantida
          const targetFile = path.join(dataDir, `${body.layerId}.geojson`);
          if (!targetFile.startsWith(dataDir)) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid path' }));
            return;
          }

          // Escrita atomica: tmp + rename
          const tmpFile = `${targetFile}.tmp`;
          const json = JSON.stringify(fc, null, 2) + '\n';
          await writeFile(tmpFile, json, 'utf-8');
          await rename(tmpFile, targetFile);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true, layerId: body.layerId, bytes: json.length }));
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devLayerSavePlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@/features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@/services': fileURLToPath(new URL('./src/services', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
