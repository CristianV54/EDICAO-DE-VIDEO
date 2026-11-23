"""Confere se as palavras usadas como gatilho em src/cenas/roteiro.tsx (sons "p:..." e pontos de câmera)
foram mesmo ditas dentro do plano. Uso: python3 ferramentas/conferir_palavras.py"""
import json, re, unicodedata
T = json.load(open('src/motor/tempos.json'))
AP = {'claude': ['cloud', 'claud', 'clod'], 'corte': ['curte'], 'ia': ['dia'], 'exporte': ['esporte'], 'cinquenta': ['50'], 'doze': ['12'], 'vinte': ['20'], 'dezessete': ['17'], 'olha': ['olhe'], 'cria': ['crie'], 'corto': ['cordo', 'curto'], 'dez': ['10', 'descortes'], 'tres': ['3'], 'instala': ['installa']}
def limpar(x):
    x = unicodedata.normalize('NFD', x.lower())
    return re.sub('[^a-z0-9]', '', x)
src = open('src/cenas/roteiro.tsx').read()
faltas = 0
for m in re.finditer(r'const C(\d+): Plano\[\] = \[(.*?)\n\];', src, re.S):
    n = m.group(1); fr = T[n]['frases']; pal = T[n]['palavras']
    for linha in m.group(2).split('\n'):
        f = re.search(r'frases: \[(\d+), (\d+)\]', linha)
        if not f: continue
        a, b = int(f.group(1)), int(f.group(2))
        ini, fim = fr[a][0] - 7, fr[b][1] + 20
        usadas = set(re.findall(r"'p:([^'#+-]+)", linha))
        cam = re.search(r'cam: \[(.*?)\]\]', linha)
        if cam: usadas |= set(re.findall(r"\['([^']+)',", cam.group(1)))
        for w in usadas:
            formas = [limpar(w)] + AP.get(limpar(w), [])
            if not any(ini <= q <= fim and any(limpar(t).startswith(fo) for fo in formas) for q, t in pal):
                faltas += 1
                perto = [t for q, t in pal if ini <= q <= fim]
                print(f'cena {n} frases {a}-{b}: "{w}" não achada. Ditas: {" ".join(perto)[:150]}')
print('faltas:', faltas)
