# Verificação v2 (seção 12), tempos provisórios

Stills em `verificacao/*.png` (1080x1920), gerados por `node scripts/gerar-stills.mjs`: `_a_momento` (momento da peça + 0,3 s), `_b_problema` (problema + 0,3 s), `_c_solucao` (solução + 0,3 s).
Em s00 o `_a` é início + 1,5 s; em s14 também. O final tem "para" + 1,8 s, "comenta" + 0,5 s e o último frame.
Comparações lado a lado com quadros da referência em `out/comparacao/` (versionadas com `git add -f`). Folhas de contato em `verificacao/sheets/`.
Distância mínima entre objetos por segmento: `verificacao/distancias.txt` (menor valor 1,08, mínimo exigido 0,9).

Itens: (1) peça visível, sem corte por borda/card/legenda; (2) chão e tapete aparecem em volta; (3) fotógrafo com câmera na mão nos planos de contexto;
(4) telão no estado certo no ato 1; (5) problema encenado na cena; (6) legenda, título, card, contador e etiquetas sem sobreposição;
(7) contador certo, sem travessão, acentos corretos; (8) distância mínima 0,9.

| Seg | momento | problema | solução | Observação |
|---|---|---|---|---|
| s00 | ok | ok | ok | Fotógrafo clica (flash e etiqueta), recua em "treze" com 0/13 |
| s01 | ok | ok | ok | Câmera pulsa; telão `auto` e depois `manual`; seletor AUTO vira M |
| s02 | ok | ok | ok | Lente do kit pisca, telão `escura`, 50mm rosqueia, telão `cinquenta` |
| s03 | ok | ok | ok | Cartões no slot; cartão esquerdo vermelho com X; telão `corrompida` e `restaurada` |
| s04 | ok | ok | ok | Festa com globo e luzes, luzes a 25%, flash estoura, telão `festa_granulada` e `festa_flash` |
| s05 | ok | ok | ok | Álbum abre; cabo do telão ao álbum; casal de amigos acena e sai |
| s06 | ok | ok | ok | Celular, cabo, grade preenchendo, casal cliente entra |
| s07 | ok | ok | ok | Casal fora da linha da câmera; etiquetas cinza e verde sobre o casal |
| s08 | ok | ok | ok | Casal vira de costas em "desmarca"; assinatura e carimbo |
| s09 | ok | ok | ok | R$ vira 30%, círculo verde no calendário |
| s10 | ok | ok | ok | Fumaça e luz vermelha no HD 1; HD 2 e nuvem verdes; cabos da câmera |
| s11 | ok | ok | ok | Celular pixelado some, tablet acende, cadeado pula |
| s12 | ok | ok | ok | Estrelas acendem, estrela dourada voa até o Instagram |
| s13 | ok | ok | ok | Casal indicado entra caminhando, coração dourado, bolinha percorre os cabos |
| s14 | ok | ok | ok | Card sai, textos finais, @ e confete |
| final | ok | ok | ok | Plano alto com a plataforma inteira |

## Limitações conhecidas

- O lado esquerdo da plataforma fica vazio no plano final (o ato 1 só tem o telão), e o grupo de peças fica à direita.
- Nos closes sobra plataforma escura embaixo, no espaço da legenda; o chão de madeira aparece mais nos planos de contexto.
- As posições do roteiro deixam o casal cliente e o fotógrafo muito juntos a partir de s11 (distância 1,08).

## Ajustes nos planos de câmera (em relação à tabela da seção 9)

- Distâncias: close x 1,3 e contexto x 1,45, mais 8 graus de elevação (máximo 42): com FOV vertical 45 em tela 9:16 a tabela cortava as peças. Planos de plataforma inteira (s00 contexto, s13 contexto, s14) usam FOV 70 e alvo deslocado para x = 0,8 a 1,2, onde ficam as peças.
- s07 close: azimute 20 para 50 (o casal tapava a proposta). s10 close: distância 3,2 para 3,8 (a nuvem cortava a peça).
- O momento da peça em s02 e s04 é a própria âncora da solução (50mm rosqueia, flash estoura), e em s13 é a chegada do casal indicado.
- O problema só dispara 0,8 s depois do momento da peça (antes disso o texto ficava na frente do objeto caindo).
