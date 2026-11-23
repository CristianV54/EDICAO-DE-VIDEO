#!/bin/bash
# Exporta as dez cenas, uma por vez, com voz e efeitos (a música entra depois, em ferramentas/montar.py).
# Uso: bash ferramentas/exportar_tudo.sh [cenas...]   (sem argumentos, exporta todas)
cd "$(dirname "$0")/.."
B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
mkdir -p out/cenas
CENAS=${@:-"Cena01 Cena02 Cena03 Cena04 Cena05 Cena06 Cena07 Cena08"}
for c in $CENAS; do
  ini=$(date +%s)
  npx remotion render src/index.ts $c out/cenas/$c.mp4 --browser-executable=$B --gl=swangle --concurrency=4 --crf=17 --log=error 2>&1 | tail -3
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/cenas/$c.mp4 2>/dev/null)
  echo "$c: ${d}s de vídeo em $(( $(date +%s) - ini ))s"
done
echo FIM
