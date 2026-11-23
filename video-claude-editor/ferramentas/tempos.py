"""Copia a voz-guia para public/som e monta src/motor/tempos.json (frases e palavras em quadros, a 30 por segundo).
Uso: python3 ferramentas/tempos.py"""
import json, glob, shutil, os, re
T = {}
for old in glob.glob('public/som/cena*_guia.wav'): os.remove(old)
for p in sorted(glob.glob('audio/cena*_palavras.json')):
    n = int(re.search(r'cena(\d+)', p).group(1))
    d = json.load(open(p))
    shutil.copy(f'audio/cena{n:02d}_guia.wav', f'public/som/cena{n:02d}_guia.wav')
    T[str(n)] = {'duracao': d['duracao'], 'frases': [[round(f['ini'] * 30), round(f['fim'] * 30)] for f in d['frases']], 'palavras': [[round(w['ini'] * 30), w['txt']] for w in d['palavras']]}
json.dump(T, open('src/motor/tempos.json', 'w'), ensure_ascii=False)
print({k: v['duracao'] for k, v in T.items()})
