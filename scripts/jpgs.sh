#!/usr/bin/env bash
# jpgs.sh PREFIXO -> out/jpg/PREFIXO_sheet.jpg com todos os stills verificacao/PREFIXO_*.png lado a lado (540 px de largura cada)
p=$1; cd "$(dirname "$0")/.."; mkdir -p out/jpg
fs=(verificacao/${p}_*.png); n=${#fs[@]}; args=(); fc=""
for k in "${!fs[@]}"; do args+=(-i "${fs[$k]}"); fc+="[$k]scale=432:-1[v$k];"; done
for k in "${!fs[@]}"; do fc+="[v$k]"; done
ffmpeg -y -loglevel error "${args[@]}" -filter_complex "${fc}hstack=$n" -q:v 3 out/jpg/${p}_sheet.jpg
