#!/usr/bin/env bash
# Renderiza a previa (meia resolucao) em blocos de 900 frames e junta no fim.
# Blocos ja prontos em out/partes sao pulados, entao da para retomar depois de uma interrupcao.
set -e
cd "$(dirname "$0")/.."
TOTAL=$(node -e "const t=require('./src/dados/tempos.json');console.log(Math.ceil((t.duracaoAudio+2.5)*30))")
mkdir -p out/partes
: > out/partes/lista.txt
i=0; ini=0
while [ $ini -lt $TOTAL ]; do
  fim=$((ini+899)); [ $fim -ge $TOTAL ] && fim=$((TOTAL-1))
  arq=out/partes/p$(printf '%02d' $i).mp4
  if [ ! -s "$arq" ]; then
    npx remotion render PecasFotografo "$arq" --gl=swangle --scale=0.5 --crf=26 --concurrency=4 --frames=$ini-$fim
  fi
  echo "file 'p$(printf '%02d' $i).mp4'" >> out/partes/lista.txt
  ini=$((fim+1)); i=$((i+1))
done
npx remotion ffmpeg -y -f concat -safe 0 -i out/partes/lista.txt -c copy "${SAIDA:-out/previa-v4.mp4}"
echo PRONTO
