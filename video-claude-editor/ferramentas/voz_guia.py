"""Gera a voz-guia de uma cena com o Kokoro (voz sintética gratuita, roda no computador)
e mede o tempo de cada palavra com o Whisper.

Uso: python3 ferramentas/voz_guia.py <pasta_dos_modelos> <numero_da_cena> [voz]
Lê a narração de cenas.json e grava em audio/: cenaNN_guia.wav e cenaNN_palavras.json
"""
import json, sys, re
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro
from faster_whisper import WhisperModel

modelos, cena = sys.argv[1], int(sys.argv[2])
voz = sys.argv[3] if len(sys.argv) > 3 else 'pm_alex'
texto = next(c['narracao'] for c in json.load(open('cenas.json')) if c['numero'] == cena)
frases = [f.strip() for f in re.split(r'(?<=[.!?:])\s+', texto) if f.strip()]

k = Kokoro(f'{modelos}/kokoro.onnx', f'{modelos}/voices.bin')
partes, sr, tempos, pos = [], 24000, [], 0
for f in frases:
    audio, sr = k.create(f.replace('"', ''), voice=voz, speed=1.08, lang='pt-br')
    # tira o silêncio das pontas e põe uma pausa curta entre as frases
    forte = np.where(np.abs(audio) > 0.01)[0]
    if len(forte):
        audio = audio[max(0, forte[0] - 600): forte[-1] + 1800]
    tempos.append({'txt': f, 'ini': round(pos / sr, 2), 'fim': round((pos + len(audio)) / sr, 2)})
    partes += [audio, np.zeros(int(sr * 0.22), dtype=audio.dtype)]
    pos += len(audio) + int(sr * 0.22)
tudo = np.concatenate(partes)
saida = f'audio/cena{cena:02d}_guia.wav'
sf.write(saida, tudo, sr)

w = WhisperModel('small', device='cpu', compute_type='int8')
# o áudio vai para o Whisper já em 16 kHz, sem depender de outra biblioteca para abrir o arquivo
n16 = int(len(tudo) * 16000 / sr)
em16 = np.interp(np.linspace(0, len(tudo) - 1, n16), np.arange(len(tudo)), tudo).astype(np.float32)
segs, _ = w.transcribe(em16, language='pt', word_timestamps=True)
palavras = [{'ini': round(p.start, 2), 'fim': round(p.end, 2), 'txt': p.word.strip()} for s in segs for p in s.words]
json.dump({'voz': voz, 'duracao': round(len(tudo) / sr, 2), 'frases': tempos, 'palavras': palavras}, open(f'audio/cena{cena:02d}_palavras.json', 'w'), ensure_ascii=False, indent=1)
print('duração', round(len(tudo) / sr, 2), 's;', len(palavras), 'palavras ouvidas;', len(texto.split()), 'no roteiro')
print(' '.join(p['txt'] for p in palavras))
