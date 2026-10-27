# Próximos passos: quando o áudio chegar

O projeto já está pronto com tempos provisórios (`src/dados/tempos.json` com `"origem": "provisorio"`).
Nenhum componente precisa ser editado: só o JSON de tempos muda.

## 1. Colocar o áudio

```bash
cp /caminho/da/narracao.mp3 public/narracao.mp3
```

Sem esse arquivo, a composição renderiza sem som. Com ele, o `Audio` entra sozinho (checado com `getStaticFiles()`).

## 2. Gerar os tempos reais

```bash
node scripts/gerar-tempos.mjs
```

O script faz: `ffprobe` (duração) → WAV 16 kHz mono em `out/narracao.wav` → whisper (`whisper.cpp` pelo `@remotion/install-whisper-cpp`,
modelo `small`, `language: 'pt'`; se `github.com` falhar, tenta `faster-whisper` pelo pip, modelo vindo do huggingface.co) →
alinha as palavras com o roteiro → grava `src/dados/tempos.json` com `"origem": "audio"`.

Confira a tabela impressa no terminal: cada âncora mostra `[whisper]` (achada na fala) ou `[fracao]` (usou a fração de reserva).
Se o whisper falhar por completo, o script grava `"origem": "audio-fallback"` (proporcional por caracteres, na duração real do áudio).

Opcional, para testar o alinhamento sem áudio: `node scripts/testar-alinhamento.mjs`.

## 3. Conferir de novo (stills)

```bash
npx tsc --noEmit
node scripts/gerar-stills.mjs            # regrava verificacao/*.png (48 stills)
```

Os stills pegam os frames efetivos do projeto: início + 1,5 s, problema + 0,3 s e solução + 0,3 s de cada segmento,
mais "para" + 1,8 s, "comenta" + 0,5 s e o último frame. Para ver 3 stills lado a lado: `scripts/folha.sh verificacao s03 s08 final`.
Para um segmento só: `node scripts/gerar-stills.mjs s05`.

Checklist de cada still: peça visível e no centro, legenda/título/card/contador sem sobreposição, etiqueta perto da peça certa,
contador com o número certo, personagem com a câmera na mão, sem travessão, acentos corretos, textos finais legíveis.

## 4. Render final (1080x1920)

```bash
npx remotion render PecasFotografo out/pecas-fotografo.mp4 --gl=swangle --codec=h264 --crf=20
```

Render lento? Em blocos de 900 frames e junção:

```bash
npx remotion render PecasFotografo out/p1.mp4 --gl=swangle --codec=h264 --crf=20 --frames=0-899
npx remotion render PecasFotografo out/p2.mp4 --gl=swangle --codec=h264 --crf=20 --frames=900-1799
# ... até o último frame (duração em frames = ceil((duracaoAudio + 2.5) * 30), ver tempos.json)
printf "file 'p1.mp4'\nfile 'p2.mp4'\n" > out/lista.txt     # uma linha por bloco, em ordem
npx remotion ffmpeg -f concat -safe 0 -i out/lista.txt -c copy out/pecas-fotografo.mp4
```

Confira o resultado (1080x1920, 30 fps, áudio presente, duração = `duracaoAudio + 2,5 s`):

```bash
npx remotion ffprobe out/pecas-fotografo.mp4
```

Se o arquivo passar de 95 MB, renderize de novo com `--crf=24`.

## 5. Entregar

```bash
git add -f out/pecas-fotografo.mp4 src/dados/tempos.json public/narracao.mp3 verificacao
git commit -m "Video final com narracao"
git push -u origin claude/kind-gauss-yh14s5
```

(`out/` está no `.gitignore`; por isso o `-f` para o MP4 final.)
