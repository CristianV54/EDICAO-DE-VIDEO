# Checklist da V3 (prévia sem áudio, tempos provisórios)

Vídeo: `previa/previa-v3.mp4` (540x960, 119 s, 3576 quadros). Folhas de 1 quadro por segundo: `previa/folha_00.jpg` a `folha_11.jpg`.

## O que foi verificado e como
- Assisti os 119 quadros (1 por segundo) da versão final e transições a 5 quadros por segundo em s05 para s06 e s08 para s10. Antes disso, abri os stills de cada segmento (s00 a s14) um a um.
- Logs medidos por plano (`scripts/verificar-enquadramento.ts`): 56 planos dentro dos mínimos; legenda não cobre cabeça, plaquinha nem placa de foto; título sem colisão em 13 de 13 segmentos; raycast de visibilidade com 85% ou mais da peça, da plaquinha e da placa em todos os planos cena; câmera da mão x tronco: 0 interseções em 3576 quadros.
- Travessão: `LC_ALL=C grep -rnP "\xE2\x80\x94|\xE2\x80\x93" src public` sem nenhuma ocorrência (o mesmo grep acha o travessão de um arquivo de teste).
- Revisor independente (subagente que só viu as imagens): rodou uma vez, na versão anterior, nota 5/10 para "parece do mesmo vídeo da referência". Corrigi o que ele apontou (abertura e final parados, etiquetas/contador/card pequenos, luz do flash caótica, personagens sobrepostos, balão da madrinha cortado). NÃO rodei o revisor de novo na versão final.

## Contagem (por segmento, 15 segmentos)
- ok: 11 (s00, s01, s02, s03, s04, s05, s06, s08, s10, s11, s12)
- parcial: 4
  - s07: 4 s seguidos de plano fechado no casal antes de a lente cair (a lente só cai na âncora "cinquenta", como pede o prompt); "foto escura" fica pouco escura (luz a 55%, como no prompt).
  - s09: luz colorida da festa ainda forte; a peça flash só aparece na âncora "flash".
  - s13/s14: o final é plano aberto (tabuleiro ocupa ~60% da largura); está parecido com o final da referência mas menor.
  - s02: no close do álbum a amiga de amarelo aparece cortada na borda.
- falha: 0 nos logs medidos
- não verificado: sincronia da legenda e das cenas com o áudio (não há narracao.mp3); texto pequeno do card e das etiquetas lido só em quadros de 1 por segundo.

## Respostas 5 e 6 (resumo por segmento)
- s00: "pareceria da referência?" sim no tamanho (fotógrafo a 55% da altura), mas fica 7 s em close por causa do tempo provisório. Sem som se entende só "primeiro casamento?" pela etiqueta.
- s01 a s03: sim (peças grandes, placa de foto grande nos cortes). Sem som: auto cinza vs manual laranja é claro; portfólio e Instagram dependem das plaquinhas.
- s04 a s06: sim; proposta voando até a noiva, caneta assinando, calendário translúcido são legíveis; "visualizou" só se entende pela noiva de costas e pela etiqueta.
- s07 a s09: parcial (ver acima); cartão vermelho com X e verde são claros nos cortes de detalhe.
- s10 a s13: sim; HD soltando fumaça, galeria acendendo, balão amarelo com estrelas, balão da madrinha legível.

## Decisões minhas e números que mudei do prompt
- Posições dentro da casa: o prompt V3 original e a sua correção mandavam fotógrafo x−0,6 / cliente x−0,15 / noivo x+0,3 (mais atrás). Usei: cliente x−1,2, z+0,55 (era x−0,15, z+0,3), casal x−0,95 e x−0,35 (noivo estava em x+0,3), para a peça ficar visível pelo raycast e não cobrir o fotógrafo.
- Placa de foto: moldura 1,1 x 0,75 num cavalete alto (centro a 1,8 m) e plano próprio nos momentos em que a foto muda.
- Janela útil: y 520 a 1560 (prompt: 470 a 1540), cena pode cortar 90 px nas laterais; cena exige personagem a 40% da altura (768 px), caminhada 50% (960 px), close da peça 70% da largura (era 55%) por causa da referência.
- Elevação 38 graus (máximo do prompt) e azimute +30 em close e cena; planos abertos a 56-58 graus.
- Título entra entre 0,4 s e 5,7 s depois do início do segmento (em s08 5,7 s e só 0,8 s) para nunca cobrir cabeça, plaquinha nem placa de foto.
- Etiquetas 40 px, contador 46 px, card 46 px (maiores que no prompt, como na referência).
- A regra de tamanho mínimo tirou da lista: peca12 no plano cena de s12 (o balão tem plano próprio no depoimento).
- Distância mínima entre objetos: ficou acima de 0,9 só entre objetos; entre personagens vizinhos é menor (layout pedido).
