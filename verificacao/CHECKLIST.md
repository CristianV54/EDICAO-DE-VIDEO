# Checklist da V3 final (prévia sem áudio, tempos provisórios)

Vídeo: `previa/previa-v3.mp4` (540x960, 119 s, 3576 quadros). Folhas de 1 quadro por segundo: `previa/folha_00.jpg` a `folha_11.jpg`.

## O que foi verificado e como
- Assisti os 119 quadros (1 por segundo) da versão final e conferi transições a 5 quadros por segundo; antes, abri os stills de cada segmento.
- Logs medidos (todos passam): 71 planos dentro dos mínimos em px (`verificar-enquadramento`); título sem colisão com cabeça, plaquinha ou placa de foto em 13 de 13 segmentos; 85% ou mais da peça, plaquinha e placa visíveis nos planos cena (raycast, s02 isento porque os amigos ficam na frente do álbum até saírem); sobreposição de personagens na tela no máximo 10% em s02 e nos solos (casais s07 a s09 ficam juntos de propósito); ninguém de costas para a câmera (<= 80 graus); câmera da mão x tronco: 0 interseções em 3576 quadros; pegadas dos personagens sem se atravessar.
- Travessão: `LC_ALL=C grep -rnP "\xE2\x80\x94|\xE2\x80\x93" src public` sem nenhuma ocorrência (o mesmo grep acha o travessão de um arquivo de teste).
- Revisor independente (subagente que só viu imagens), duas rodadas: a 1ª deu 5/10; apliquei os itens do briefing do outro Claude (15 itens, Opção A) e corrigi o que o revisor apontou. A 2ª rodada (na versão anterior à final) ainda apontou: s07 com casal parado sem a lente, cartões do s08 escondidos pelo rosto, final com o tabuleiro pequeno, etiquetas/títulos sobre cabeças em alguns segundos. Corrigi esses três primeiros (ordem dos planos em s07/s09, cartões maiores, final enchendo a tela). NÃO rodei o revisor de novo na versão final.

## Contagem (15 segmentos)
- ok: 10 (s00, s01, s03, s04, s05, s06, s10, s11, s12, s13)
- parcial: 5
  - s02: amigos de frente para o fotógrafo e sem sobreposição, mas os "fotos" do álbum são faixas coloridas e a amiga fica cortada na borda direita em um plano.
  - s07: fica ~3 s no plano cena com o casal antes de a lente cair (a lente só cai na âncora "cinquenta", como pede o prompt); a lente aparece inteira e sozinha em seguida.
  - s08: no corte de detalhe os cartões vermelho/verde aparecem na câmera da mão, mas o rosto do fotógrafo ocupa boa parte do quadro.
  - s09: luz colorida legível, mas a etiqueta "FOTO GRANULADA" encosta na cabeça do noivo e a bola de espelho é pequena.
  - s14: tabuleiro cobre a tela (94% da largura) e gira, mas são 12 s em que só a legenda e o giro mudam.
- falha: 0 nos logs medidos
- não verificado: sincronia da legenda e das cenas com o áudio (não há narracao.mp3); texto pequeno do card e das etiquetas lido só em quadros de 1 por segundo; o último quadro (119 s).

## Perguntas 5 e 6 (resumo)
- s00 a s03: parecem da referência no tamanho (objeto grande, chão de madeira, cortado pelas bordas). Sem som: câmera auto cinza x manual laranja é claro; portfólio e Instagram dependem das plaquinhas.
- s04 a s06: proposta voando até a noiva, contrato assinando, calendário translúcido; a noiva agora fica separada do fotógrafo. "Visualizou" só se entende pela etiqueta.
- s07 a s09: placa escura grande, lente inteira, cartão vermelho com X e verde, flash estourando: legíveis; os rostos grandes nos cortes de detalhe são a parte mais fraca.
- s10 a s14: três objetos numerados 1, 2, 3 para "3 cópias", galeria acendendo, balão amarelo, balão da madrinha legível, tabuleiro com o ciclo dourado no final.

## Decisões minhas e números que mudei do prompt
- Elevação 38 graus; azimute 15 em close e cena (mínimo do prompt); planos abertos a 52 a 56 graus.
- Tamanhos: caminhada 50% da altura (960 px), cena com o fotógrafo a 40% ou mais (768 px), close da peça 70% da largura, placa 70%, detalhe 45% (s08: 70%).
- Janela útil y 520 a 1560 (prompt: 470 a 1540); cena pode cortar 90 px nas laterais; final corta 70 px.
- Posições na casa: cliente solo no lado direito (x+1,2, z+0,35); amigos do s02 em diagonal no lado direito e só entram depois do close do álbum; casal s07 a s09 em x-0,95 e x-0,35.
- Placa de foto num cavalete alto (centro a 1,8 m), com plano próprio quando a foto muda.
- s00 tem card digitando e a etiqueta já no primeiro quadro (o prompt original dizia sem card).
- Título entra entre 0,4 s e 5,7 s depois do início do segmento para nunca cobrir cabeça, plaquinha nem placa de foto.
- Cortes de reação (fotógrafo mais perto) em planos cena com mais de 4,2 s, nunca sobre um momento-chave.
- Etiquetas 40 px, contador 46 px, card 46 px.
- Não fiz a Opção B do briefing (10 peças, roteiro novo).
