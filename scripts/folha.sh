#!/usr/bin/env bash
# folha.sh DIR GRUPO...  -> monta DIR/sheets/GRUPO.png com os 3 stills do grupo lado a lado (so para conferencia rapida)
d=$1; shift; mkdir -p "$d/sheets"
for s in "$@"; do
  if [ "$s" = final ]; then set -- final_a_para_1.8s final_b_comenta_0.5s final_c_ultimo_frame; a=$1;b=$2;c=$3; else a=${s}_a_momento;b=${s}_b_problema;c=${s}_c_solucao; fi
  ffmpeg -y -loglevel error -i "$d/$a.png" -i "$d/$b.png" -i "$d/$c.png" -filter_complex "[0]scale=540:-1[a];[1]scale=540:-1[b];[2]scale=540:-1[c];[a][b][c]hstack=3" "$d/sheets/$s.png"
done
