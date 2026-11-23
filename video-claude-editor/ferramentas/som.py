"""Gera efeitos sonoros e uma base musical simples, tudo por síntese (sem usar gravação de ninguém).
Uso: python3 ferramentas/som.py   -> grava em public/som/
"""
import numpy as np
import soundfile as sf

SR = 44100
rng = np.random.default_rng(7)

def t(seg): return np.arange(int(SR * seg)) / SR
def env(n, ataque, queda):
    x = np.arange(n) / SR
    return np.minimum(1, x / max(ataque, 1e-4)) * np.exp(-np.maximum(0, x - ataque) / queda)
def passa_baixa(x, k):
    y = np.zeros_like(x); a = 0.0
    for i in range(len(x)):
        a += k * (x[i] - a); y[i] = a
    return y
def passa_baixa_var(x, ks):
    y = np.zeros_like(x); a = 0.0
    for i in range(len(x)):
        a += ks[i] * (x[i] - a); y[i] = a
    return y
def norm(x, pico=0.8): return x / (np.max(np.abs(x)) + 1e-9) * pico
def grava(nome, x, pico=0.8):
    x = norm(x, pico)
    n = int(SR * 0.004); x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    sf.write(f'public/som/{nome}.wav', np.stack([x, x], 1).astype(np.float32), SR)

# whoosh: ruído com filtro que abre e fecha; o pico fica em ~55% da duração
def whoosh(dur=0.55, grave=False):
    x = t(dur); n = len(x)
    forma = np.sin(np.pi * np.clip(x / dur, 0, 1) ** 0.8) ** 2.2
    ks = (0.01 if grave else 0.03) + forma * (0.12 if grave else 0.4)
    return passa_baixa_var(rng.standard_normal(n), ks) * forma
grava('whoosh', whoosh(), 0.7)
grava('whoosh_grave', whoosh(0.8, True), 0.8)

# corte: estalo seco e agudo, como lâmina
x = t(0.16); n = len(x)
grava('corte', rng.standard_normal(n) * env(n, 0.001, 0.018) * 0.7 + np.sin(2 * np.pi * (2600 - 9000 * x) * x) * env(n, 0.001, 0.03), 0.75)

# pop: elemento entrando
x = t(0.12); n = len(x)
grava('pop', np.sin(2 * np.pi * np.cumsum(620 * np.exp(-x * 22) + 180) / SR) * env(n, 0.002, 0.035), 0.6)

# clique do cursor
x = t(0.07); n = len(x)
grava('clique', rng.standard_normal(n) * env(n, 0.0005, 0.004) + np.sin(2 * np.pi * 1700 * x) * env(n, 0.0005, 0.012) * 0.6, 0.6)

# tecla: digitação
x = t(0.035); n = len(x)
grava('tecla', passa_baixa(rng.standard_normal(n), 0.5) * env(n, 0.0005, 0.006), 0.35)

# ding: aprovação
x = t(0.9); n = len(x)
grava('ding', (np.sin(2 * np.pi * 1318.5 * x) + 0.6 * np.sin(2 * np.pi * 1975.5 * x) + 0.3 * np.sin(2 * np.pi * 2637 * x)) * env(n, 0.003, 0.22), 0.55)

# impacto: grave com transiente
x = t(0.6); n = len(x)
grava('impacto', np.sin(2 * np.pi * np.cumsum(95 * np.exp(-x * 9) + 38) / SR) * env(n, 0.002, 0.16) + passa_baixa(rng.standard_normal(n), 0.2) * env(n, 0.001, 0.02) * 0.5, 0.9)

# subida: tensão antes de um impacto
x = t(1.1); n = len(x)
grava('subida', (passa_baixa_var(rng.standard_normal(n), 0.01 + (x / 1.1) ** 2 * 0.3) * 0.6 + np.sin(2 * np.pi * np.cumsum(200 + 900 * (x / 1.1) ** 2) / SR) * 0.25) * (x / 1.1) ** 1.6, 0.6)

# passo: o mascote pousando num degrau, com nota que sobe a cada degrau
for i, f0 in enumerate([261.6, 293.7, 329.6, 392.0, 440.0]):
    x = t(0.35); n = len(x)
    grava(f'degrau{i + 1}', np.sin(2 * np.pi * f0 * x) * env(n, 0.002, 0.09) + 0.4 * np.sin(2 * np.pi * f0 * 2 * x) * env(n, 0.002, 0.05) + np.sin(2 * np.pi * np.cumsum(120 * np.exp(-x * 30) + 50) / SR) * env(n, 0.001, 0.04) * 0.7, 0.6)

# apagar: programa sendo fechado
x = t(0.3); n = len(x)
grava('apagar', np.sin(2 * np.pi * np.cumsum(500 * np.exp(-x * 8) + 70) / SR) * env(n, 0.002, 0.09), 0.55)

# ---- base musical: 4 acordes em Lá menor, 96 bpm, calma, para ficar por baixo da voz ----
def musica(seg=64.0, bpm=96):
    n = int(SR * seg); x = np.arange(n) / SR
    batida = 60 / bpm
    acordes = [[220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [130.8, 196.0, 261.6, 329.6], [196.0, 246.9, 293.7]]
    m = np.zeros(n)
    comp = batida * 4
    for k in range(int(seg / comp) + 1):
        ini = int(k * comp * SR); fim = min(n, int((k + 1) * comp * SR))
        if ini >= n: break
        xx = np.arange(fim - ini) / SR
        e = np.minimum(1, xx / 0.5) * np.minimum(1, (comp - xx) / 0.6).clip(0)
        for f0 in acordes[k % 4]:
            for des in (-0.6, 0.6):
                m[ini:fim] += np.sin(2 * np.pi * (f0 + des) * xx + rng.uniform(0, 6)) * e * 0.12
            m[ini:fim] += np.sin(2 * np.pi * f0 * 2 * xx) * e * 0.03
        m[ini:fim] += np.sin(2 * np.pi * acordes[k % 4][0] / 2 * xx) * e * 0.22
        # arpejo suave em colcheias
        notas = acordes[k % 4] + [acordes[k % 4][1] * 2]
        for j in range(8):
            a = ini + int(j * batida / 2 * SR); b = min(n, a + int(0.4 * SR))
            if a >= n: break
            yy = np.arange(b - a) / SR
            m[a:b] += np.sin(2 * np.pi * notas[(j * 3) % len(notas)] * 2 * yy) * np.exp(-yy / 0.12) * 0.06
    # bumbo e chimbal discretos
    for k in range(int(seg / batida)):
        a = int(k * batida * SR)
        if k % 2 == 0:
            b = min(n, a + int(0.25 * SR)); yy = np.arange(b - a) / SR
            m[a:b] += np.sin(2 * np.pi * np.cumsum(90 * np.exp(-yy * 20) + 42) / SR) * np.exp(-yy / 0.09) * 0.3
        h = a + int(batida / 2 * SR); b = min(n, h + int(0.04 * SR))
        if h < n: m[h:b] += rng.standard_normal(b - h) * np.exp(-np.arange(b - h) / SR / 0.008) * 0.035
    m = passa_baixa(m, 0.35)
    return m
mus = musica()
grava('musica', mus, 0.5)
print('ok')
