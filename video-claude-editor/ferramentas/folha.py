"""Monta uma folha de contato com as imagens de uma pasta. Uso: python3 ferramentas/folha.py <pasta> <saida.jpg> [colunas]"""
import sys, glob, os
from PIL import Image, ImageDraw
pasta, saida = sys.argv[1], sys.argv[2]
col = int(sys.argv[3]) if len(sys.argv) > 3 else 6
arqs = sorted(a for a in glob.glob(pasta + '/*.png') + glob.glob(pasta + '/*.jpg') if 'folha' not in a)
ims = [Image.open(a).convert('RGB') for a in arqs]
w, h = ims[0].size
lin = (len(ims) + col - 1) // col
f = Image.new('RGB', (col * (w + 6), lin * (h + 6)), (30, 30, 30))
d = ImageDraw.Draw(f)
for i, im in enumerate(ims):
    x, y = (i % col) * (w + 6), (i // col) * (h + 6)
    f.paste(im, (x, y))
    d.text((x + 6, y + 4), os.path.basename(arqs[i]).split('.')[0], fill=(255, 255, 0))
f.save(saida, quality=88)
print(saida, f.size)
