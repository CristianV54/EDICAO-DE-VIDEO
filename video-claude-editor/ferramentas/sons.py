"""Gera a biblioteca de efeitos sonoros do vídeo com o earshot e grava um manifesto
com o que não dá para ouvir: duração, instante do pico e volume de cada arquivo.

Uso: python3 ferramentas/sons.py   -> grava em public/som/fx/ e public/som/fx/manifesto.json
Cada grupo tem vários takes, para o mesmo som nunca tocar duas vezes seguidas.
"""
import json, re, subprocess, sys

PEDIDOS = [
    # grupo, pedido em palavras (em inglês, que é a língua que o earshot entende), quantos takes
    ('estalo', 'a soft pop when a card appears', 5),
    ('estalo_madeira', 'a wood block tap', 4),
    ('tique', 'a short tick', 4),
    ('clique', 'a mouse click', 1),
    ('tecla', 'a mechanical keyboard key press', 6),
    ('corte', '@delete/snip', 4),
    ('deslize', 'a page sliding', 4),
    ('whoosh', 'a fast whoosh', 4),
    ('whoosh_longo', 'a sweeping whoosh', 3),
    ('whoosh_grave', 'a much bigger, darker whoosh', 3),
    ('batida', 'a heavy bag dropped under a title', 3),
    ('impacto', 'an impact hit', 3),
    ('queda', 'something dropped on the floor', 3),
    ('subida', 'a riser, a breath of air rising', 2),
    ('subida_forte', 'a swell into a hit', 2),
    ('brilho', 'a glint, a shine', 3),
    ('sucesso', 'a soft success sound', 3),
    ('revela', 'a reveal sting', 2),
    ('desliga', 'a light switch turned off', 4),
    ('passo', 'a footstep on wood', 6),
    ('gaveta', 'a drawer closing', 2),
    ('camera', 'a camera shutter', 2),
]
LINHA = re.compile(r'^(\S+\.wav): (\S+) \(([\d.]+) s, peak at ([\d.]+) s, (?:[A-G]#?\d, )?(-?[\d.]+) LUFS, ([^)]*)\)')
manifesto = {}
for grupo, pedido, n in PEDIDOS:
    cmd = ['earshot', 'make'] + (['--sound', pedido[1:]] if pedido.startswith('@') else [pedido]) + ['-o', f'public/som/fx/{grupo}.wav', '--n', str(n)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    takes = []
    for linha in (r.stdout + r.stderr).splitlines():
        m = LINHA.match(linha.strip())
        if m:
            takes.append({'arquivo': m.group(1).split('/')[-1], 'desenho': m.group(2), 'dur': float(m.group(3)), 'pico': float(m.group(4)), 'lufs': float(m.group(5)), 'estado': m.group(6)})
    if not takes:
        print('FALHOU', grupo, (r.stdout + r.stderr)[-300:], file=sys.stderr)
        continue
    manifesto[grupo] = {'pedido': pedido, 'takes': takes}
    print(f"{grupo:16s} {len(takes)} takes  {takes[0]['desenho']:22s} dur {takes[0]['dur']:.2f}  pico {takes[0]['pico']:.2f}  {takes[0]['lufs']:.0f} LUFS  {takes[0]['estado']}")
json.dump(manifesto, open('public/som/fx/manifesto.json', 'w'), ensure_ascii=False, indent=1)
print(sum(len(g['takes']) for g in manifesto.values()), 'arquivos em', len(manifesto), 'grupos')
