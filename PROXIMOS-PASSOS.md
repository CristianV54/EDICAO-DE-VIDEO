# Próximos passos

O vídeo está montado com tempos provisórios (`src/dados/tempos.json`, `"origem": "provisorio"`). Quando o áudio chegar:

1. Colocar a narração em `public/narracao.mp3`.
2. `node scripts/gerar-tempos.mjs` (alinha as palavras e as âncoras ao áudio; o `Audio` entra sozinho no vídeo).
3. Conferir: `npx tsc --noEmit` e os scripts de `scripts/` (enquadramento, título, visibilidade, distâncias, câmera x tronco).
4. Render final: `npm run render` (1080x1920, h264, `--gl=swangle`, cerca de 1 hora).
   Prévia em meia resolução, em blocos que dá para retomar: `bash scripts/render-previa-em-partes.sh` (gera `out/previa-v3.mp4`).

## Scripts de verificação (rodar com esbuild)
`npx esbuild scripts/X.ts --bundle --platform=node --format=esm --external:three --outfile=out/X.mjs && node out/X.mjs`
- `verificar-enquadramento`: tamanho em px por plano, mínimos, legenda, regra de tamanho mínimo.
- `verificar-titulo`: o título não cobre cabeça, plaquinha nem placa de foto.
- `verificar-visibilidade 30`: raycast, 85% da peça, da plaquinha e da placa visíveis nos planos cena.
- `checar-distancias` e `checar-camera-tronco` (câmera da mão x tronco em todos os frames).
- Stills: `node scripts/gerar-stills.mjs [s01 s02 ...]` e `scripts/jpgs.sh s01` (folha em `out/jpg`).
