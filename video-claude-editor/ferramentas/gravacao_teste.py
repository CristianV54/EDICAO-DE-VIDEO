"""Fase 0: cria uma gravação de teste com erros e silêncios de propósito, e roda nela as ferramentas de verdade
(Whisper, auto-editor e FFmpeg). Grava teste/ e src/motor/real.json, que o vídeo usa para mostrar dados reais.
Uso: python3 ferramentas/gravacao_teste.py <pasta_dos_modelos>"""
import json, subprocess, sys, re
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from faster_whisper import WhisperModel
M = sys.argv[1]
# (fala, silêncio depois em segundos, tipo do silêncio)
FALAS = [
 ('Então hoje eu vou te mostrar como... não, peraí.', 2.4, 'a pausa para pensar'),
 ('Então hoje eu vou te mostrar como editar um vídeo sem abrir nenhum programa.', 3.1, 'a respiração'),
 ('A ideia é simples: você grava, e o corte acontece sozinho.', 4.2, 'o tempo morto'),
 ('Sem arrastar nada. Editar deixou de ser a parte chata.', 0.6, ''),
]
k = Kokoro(f'{M}/kokoro.onnx', f'{M}/voices.bin')
rng = np.random.default_rng(7)
partes, sr = [], 24000
for txt, sil, _ in FALAS:
    a, sr = k.create(txt, voice='pm_alex', speed=1.0, lang='pt-br')
    forte = np.where(np.abs(a) > 0.01)[0]
    a = a[max(0, forte[0] - 600): forte[-1] + 1200]
    partes += [a, (rng.standard_normal(int(sr * sil)) * 0.0015).astype(a.dtype)]
audio = np.concatenate(partes)
sf.write('teste/gravacao.wav', audio, sr)
def roda(*c):
    r = subprocess.run(c, capture_output=True, text=True)
    return r
roda('ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=0x202428:s=1280x720:r=30', '-i', 'teste/gravacao.wav', '-shortest', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', 'teste/gravacao.mp4')
dur = len(audio) / sr
# Whisper de verdade: tempo de cada palavra
x16 = np.interp(np.arange(0, len(audio), sr / 16000), np.arange(len(audio)), audio).astype(np.float32)
segs, _ = WhisperModel('small', compute_type='int8').transcribe(x16, language='pt', word_timestamps=True)
palavras = [{'txt': w.word.strip(), 'ini': round(w.start, 2), 'fim': round(w.end, 2)} for s in segs for w in s.words]
# auto-editor de verdade
cmd_ae = ['auto-editor', 'teste/gravacao.mp4', '--margin', '0.2sec', '--no-open', '-o', 'teste/sem_silencio.mp4']
r = roda(*cmd_ae)
print('auto-editor:', r.returncode, (r.stdout + r.stderr)[-300:])
def duracao(p):
    return float(roda('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p).stdout or 0)
depois = duracao('teste/sem_silencio.mp4')
# FFmpeg de verdade: corta o primeiro take (o erro), junta e vira para a vertical
fim_erro = next(p['fim'] for p in palavras if 'pera' in p['txt'].lower()) + 0.3 if any('pera' in p['txt'].lower() for p in palavras) else 4.0
cmds = [
 ['ffmpeg', '-v', 'error', '-y', '-i', 'teste/sem_silencio.mp4', '-ss', f'{fim_erro:.2f}', '-c:v', 'libx264', '-c:a', 'aac', 'teste/corte_01.mp4'],
 ['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'teste/lista.txt', '-c', 'copy', 'teste/video.mp4'],
 ['ffmpeg', '-v', 'error', '-y', '-i', 'teste/video.mp4', '-vf', 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920', '-c:a', 'copy', 'teste/vertical.mp4'],
]
open('teste/lista.txt', 'w').write("file 'corte_01.mp4'\n")
ok = [roda(*c).returncode for c in cmds]
print('ffmpeg:', ok)
# onda (envelope) e silêncios medidos pelo volume
n = 400
passo = len(audio) // n
onda = [round(float(np.abs(audio[i * passo:(i + 1) * passo]).max()), 3) for i in range(n)]
jan = int(sr * 0.05)
vol = np.array([np.abs(audio[i:i + jan]).max() for i in range(0, len(audio) - jan, jan)])
mudo = vol < 0.04
sil, i = [], 0
while i < len(mudo):
    if mudo[i]:
        j = i
        while j < len(mudo) and mudo[j]: j += 1
        if (j - i) * 0.05 >= 1.0: sil.append([round(i * 0.05, 2), round(j * 0.05, 2)])
        i = j
    else: i += 1
nomes = [f[2] for f in FALAS if f[2]]
real = {
 'duracao': round(dur, 2), 'depois': round(depois, 2), 'final': round(duracao('teste/video.mp4'), 2),
 'vertical': roda('ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', 'teste/vertical.mp4').stdout.strip(),
 'onda': onda, 'silencios': [{'ini': a, 'fim': b, 'nome': nomes[i] if i < len(nomes) else ''} for i, (a, b) in enumerate(sil)],
 'palavras': palavras, 'fimErro': round(fim_erro, 2),
 'comandos': [' '.join(cmd_ae).replace('teste/', '')] + [' '.join(c).replace('teste/', '').replace('-v error -y ', '') for c in cmds],
}
json.dump(real, open('src/motor/real.json', 'w'), ensure_ascii=False)
print({k2: v for k2, v in real.items() if k2 not in ('onda', 'palavras')})
print(' '.join(p['txt'] for p in palavras))
