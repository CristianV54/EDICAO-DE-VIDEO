# As 13 peças do fotógrafo

Vídeo vertical (1080x1920, 30 fps) animado em 3D com Remotion + React Three Fiber.
Composição: `PecasFotografo`. Conceito: o negócio de um fotógrafo é montado peça por peça, e cada peça que falta vira um problema.

## Como funciona a sincronia

Nenhum componente tem tempo fixo. Tudo sai de `src/dados/tempos.json`, gerado por `scripts/gerar-tempos.mjs`:

- **sem `public/narracao.mp3`**: modo provisório (`"origem": "provisorio"`), ritmo de 15 caracteres por segundo, mais 0,35 s por ponto e 0,15 s por vírgula.
- **com `public/narracao.mp3`**: ffprobe + whisper (`"origem": "audio"`). O `Audio` entra na composição sozinho (checado com `getStaticFiles()`), e a duração do vídeo passa a ser `duracaoAudio + 2,5 s`.

Ver `PROXIMOS-PASSOS.md` para os comandos quando o áudio chegar.

## Estrutura

```
src/dados/segmentos.json   textos da narração e âncoras (palavras que disparam cada beat)
src/dados/roteiro.ts       cartões, títulos, etiquetas e câmeras por segmento
src/dados/tempos.json      GERADO pelo script de tempos
src/util/tempo.ts          linha do tempo de cada segmento (frames)
src/cena/                  cena 3D (câmera, ambiente, personagens, peças, cabos, confete)
src/overlay/               camadas 2D (contador, card, título, etiquetas, legenda, textos finais)
scripts/gerar-tempos.mjs   tempos (provisório ou áudio + whisper)
scripts/gerar-stills.mjs   stills de verificação em verificacao/
```

`src/cena/cameraPorFrame.ts` é a única fonte da verdade da câmera: a cena 3D e as etiquetas 2D usam a mesma função, por isso as etiquetas ficam grudadas nas peças.

## Comandos

```bash
npm install
node scripts/gerar-tempos.mjs     # tempos.json
npx tsc --noEmit                  # tipos
node scripts/gerar-stills.mjs     # stills de verificação (verificacao/)
npm run previa                    # prévia em meia resolução
npm run render                    # render final (1080x1920)
npm run dev                       # Remotion Studio
```

Todo o render usa `--gl=swangle` (WebGL por software).
