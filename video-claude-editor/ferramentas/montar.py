"""Junta as cenas exportadas, coloca a música (trocando de faixa ao longo do vídeo) e acerta o volume final.

Uso: python3 ferramentas/montar.py [nome_de_saida]
Lê out/cenas/*.mp4 e public/som/musica/*.mp3. Grava out/<nome>.mp4 e out/<nome>_capitulos.txt
"""
import json, subprocess, sys, os
import numpy as np
import soundfile as sf

SR = 48000
ORDEM = [f'Cena{n:02d}' for n in range(1, 11)]
NOMES = ['Abertura', 'Passo 1: Preparar', 'Passo 2: Entender', 'Passo 3: Cortar', 'Passo 4: Animar', 'Passo 5: Finalizar', 'Na prática: cortes', 'Na prática: vídeo inteiro', 'Quanto custa e o que não funciona', 'Fechamento']
# cada bloco do vídeo tem a sua faixa: [faixa, cenas do bloco, segundo da faixa em que começa]
BLOCOS = [
    ['screen_saver', ['Cena01', 'Cena02'], 0.0],
    ['jerry_five', ['Cena03', 'Cena04'], 2.0],
    ['pamgaea', ['Cena05', 'Cena06'], 0.0],
    ['newer_wave', ['Cena07', 'Cena08'], 0.0],
    ['hypnothis', ['Cena09', 'Cena10'], 8.0],
]
VOZ_LUFS = -22.6      # volume medido da voz-guia
MUSICA_ABAIXO = 19.0  # a música fica este tanto de dB abaixo da voz
saida = sys.argv[1] if len(sys.argv) > 1 else 'video_final'

def roda(*cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-800:]); sys.exit(1)
    return r

def ler(caminho):
    tmp = '/tmp/_montar.wav'
    roda('ffmpeg', '-v', 'error', '-y', '-i', caminho, '-vn', '-ac', '2', '-ar', str(SR), tmp)
    x, _ = sf.read(tmp, dtype='float32')
    return x

def lufs(caminho):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', caminho, '-af', 'loudnorm=print_format=json', '-vn', '-f', 'null', '-'], capture_output=True, text=True)
    return float(json.loads(r.stderr[r.stderr.rindex('{'):])['input_i'])

# 1. duração exata de cada cena (pelo número de quadros do vídeo)
dur = {}
for c in ORDEM:
    r = roda('ffprobe', '-v', 'error', '-select_streams', 'v:0', '-count_packets', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', f'out/cenas/{c}.mp4')
    dur[c] = int(r.stdout.strip().split(',')[0]) / 30
inicio, t = {}, 0.0
for c in ORDEM:
    inicio[c] = t; t += dur[c]
total = t
print('total', round(total, 2), 's =', f'{int(total // 60)}:{int(total % 60):02d}')

# 2. voz e efeitos, cena por cena, no tempo exato
mix = np.zeros((int(total * SR) + SR, 2), dtype=np.float32)
for c in ORDEM:
    x = ler(f'out/cenas/{c}.mp4')
    a = int(inicio[c] * SR); n = min(len(x), int(dur[c] * SR))
    mix[a:a + n] += x[:n]

# 3. música: uma faixa por bloco, com entrada e saída suaves e as faixas se cruzando na troca
CRUZA = 1.6
for k, (faixa, cenas, pulo) in enumerate(BLOCOS):
    a = inicio[cenas[0]] - (CRUZA / 2 if k else 0)
    b = inicio[cenas[-1]] + dur[cenas[-1]] + (CRUZA / 2 if k < len(BLOCOS) - 1 else 0)
    arq = f'public/som/musica/{faixa}.mp3'
    x = ler(arq)
    ganho = 10 ** ((VOZ_LUFS - MUSICA_ABAIXO - lufs(arq)) / 20)
    n = int((b - a) * SR); p = int(pulo * SR)
    if p + n > len(x):  # faixa mais curta que o bloco: repete
        x = np.concatenate([x] * (1 + (p + n) // len(x)))
    y = x[p:p + n] * ganho
    sobe = int((1.2 if k == 0 else CRUZA) * SR); desce = int((3.0 if k == len(BLOCOS) - 1 else CRUZA) * SR)
    y[:sobe] *= np.linspace(0, 1, sobe)[:, None] ** 1.5
    y[-desce:] *= np.linspace(1, 0, desce)[:, None] ** 1.5
    ia = int(a * SR)
    mix[ia:ia + n] += y
    print(f'  {faixa:14s} de {a:7.2f} a {b:7.2f} s, ganho {20 * np.log10(ganho):.1f} dB')
mix = mix[:int(total * SR)]
sf.write('out/_mix.wav', mix, SR)

# 4. vídeo: junta as cenas sem recomprimir a imagem
with open('out/_lista.txt', 'w') as f:
    for c in ORDEM: f.write(f"file 'cenas/{c}.mp4'\n")
roda('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'out/_lista.txt', '-an', '-c:v', 'copy', 'out/_video.mp4')

# 5. volume final em -14 LUFS, com teto de pico, e junta som e imagem
roda('ffmpeg', '-v', 'error', '-y', '-i', 'out/_video.mp4', '-i', 'out/_mix.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', f'out/{saida}.mp4')
print('volume final', lufs(f'out/{saida}.mp4'), 'LUFS')

with open(f'out/{saida}_capitulos.txt', 'w') as f:
    for c, nome in zip(ORDEM, NOMES):
        s = int(inicio[c]); f.write(f'{s // 60}:{s % 60:02d} {nome}\n')
print(open(f'out/{saida}_capitulos.txt').read())
for tmp in ['out/_mix.wav', 'out/_video.mp4', 'out/_lista.txt']:
    os.remove(tmp)
