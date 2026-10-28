# Como o vídeo é montado (para quem vai me dar instruções)

## 1. O que isso é (e o que não é)
Não é um editor de vídeo com linha do tempo. É um **programa**: cada frame do vídeo é uma página web 3D desenhada por código (Remotion + React Three Fiber, que usa three.js). Nada é gravado nem desenhado à mão. Tudo é uma **função do número do frame**: dado o frame N, o código calcula onde cada personagem, peça e a câmera estão e desenha. Depois o Remotion junta os frames em MP4 (1080x1920, 30 fps).
Consequência: eu não "arrasto" nada. Para mudar algo eu mudo números ou regras no código, recalculo e renderizo de novo.

## 2. De onde vem cada coisa
| O que | Onde | Exemplo do que se controla |
|---|---|---|
| Roteiro e âncoras | `src/dados/segmentos.json` | texto de cada segmento (s00 a s14) e a palavra que dispara "problema" e "solução" |
| Tempos | `src/dados/tempos.json` (gerado por `scripts/gerar-tempos.mjs`) | quando cada segmento começa/termina. Hoje **provisório** (15 caracteres por segundo); com o áudio, alinha pelas palavras |
| Eventos de cada segmento | `src/util/tempo.ts` | início, chegada do fotógrafo, queda da peça, toque, problema, solução, cena, saída do card |
| Onde tudo fica no tabuleiro | `src/dados/posicoes.ts` | posição das 13 casas, do fotógrafo, da peça, da placa de foto, do cliente |
| Textos de card, título e etiquetas | `src/dados/roteiro.ts` | "aprender o modo manual", "MODO AUTO", etc. |
| Tabuleiro | `src/cena/Tabuleiro.tsx` | base, casas, trilhas de pastilhas, seta do ciclo |
| Personagens | `src/cena/Personagem.tsx` | corpo de caixas, braços por IK, olhos, expressões |
| Quem está onde em cada frame | `src/cena/estadoElenco.ts` + `Elenco.tsx` | caminhada, noiva/noivo/amigos/madrinha entrando e saindo, câmera da mão |
| As 13 peças e seus efeitos | `src/cena/Estacoes.tsx` (E01 a E13) | câmera gigante, álbum, celular, folha, contrato, maquininha, lente, cartões, flash, backup, galeria, balão, madrinha |
| Placa de foto | `src/cena/PlacaFoto.tsx` | qual foto aparece (auto, manual, escura, cinquenta, corrompida, restaurada, festa) |
| Luz | `src/cena/luz.ts`, `Cena3D.tsx` | luz global (55% no s07, 35%/75% no s09) e luzes de festa |
| Câmera | `src/cena/enquadramento.ts` + `cameraPorFrame.ts` | ver seção 4 |
| Camadas 2D por cima | `src/overlay/*` | card, contador, título amarelo, etiquetas, legenda, textos finais, flash branco |

## 3. A linha do tempo de cada segmento (o "roteiro de eventos")
Para cada segmento s01 a s13 o código calcula estes instantes:
1. **início**: o fotógrafo começa a andar da casa anterior (0,9 s). O card entra.
2. **chegada**: ele para na casa. A câmera de "caminhada" fica nele.
3. **queda**: a peça começa a cair do alto (depois que o card termina de digitar). **O close da peça só começa aqui.**
4. **toque**: a peça pousa; o contador sobe.
5. **problema**: palavra-âncora (ex.: "automático"); aparece a etiqueta vermelha e a encenação do problema.
6. **solução**: palavra-âncora (ex.: "manual"); etiqueta verde e a encenação da solução.
7. O card sai pouco depois da peça; o segmento termina e o próximo começa.
Exceções: em s07 e s09 a peça cai na própria âncora de solução; em s13 o "momento" é a madrinha chegando.

## 4. Como a câmera é decidida
Cada plano declara: ângulo (azimute), elevação (38°), **uma lista de caixas 3D que precisam aparecer** e uma meta de tamanho. Um solver (busca binária) acha a distância e o ponto de mira. Tipos de plano:
- **caminhada**: o fotógrafo a 50% da altura da tela (960 px), a câmera viaja junto com ele.
- **close**: só a peça e a plaquinha, a peça a 70% da largura (756 px); começa na queda da peça; pode cortar em cima e embaixo.
- **cena**: fotógrafo + peça + personagens da casa; o fotógrafo mede pelo menos 40% da altura (768 px); pode cortar nas laterais.
- **placa**: a moldura da foto a 70% da largura, nos momentos em que a foto muda (s01, s07, s08, s09).
- **detalhe**: câmera da mão a 45% da largura (s07 lente, s08 cartões, s09 flash).
- **aberto**: tabuleiro inteiro (abertura s00 em "treze", "pronto" do s13 e final s14), com giro e aproximação lentos.
Dentro de cada plano a câmera nunca para: gira 5° e se aproxima 6% (nos planos abertos, mais). Cortes duram 0,3 a 0,5 s. A legenda (y 1185 a 1295) e o título nunca podem cobrir cabeça, plaquinha ou placa de foto; o código desloca a mira ou o título para evitar isso.
A mesma função de câmera alimenta as etiquetas: elas são projetadas do ponto 3D para a tela.

## 5. Como uma peça é construída
Cada peça é um componente que desenha formas simples (caixas arredondadas, cilindros, esferas) e lê o frame para animar. Exemplo da câmera (s01): corpo + lente + um seletor no topo que gira quando chega a âncora "manual" e troca o texto AUTO por M; a placa de foto troca de `auto` para `manual` no mesmo instante. Toda peça tem pedestal creme e uma plaquinha branca com o nome, e cai com mola (spring) na hora da queda. Tudo é função de frame, então é determinístico (sem aleatório solto).

## 6. Personagens
Cabeça cúbica de 0,42, corpo curto, 1,7 de altura, feitos de caixas. Os braços usam um cálculo de cotovelo (IK) para segurar a câmera, o celular, o buquê ou cruzar. Olhos são retângulos; "feliz" vira arco; "emoção" tem gotas azuis. A câmera na mão tem 0,34 x 0,24 x 0,18 e há um teste que prova que nunca atravessa o tronco em nenhum dos 3576 frames.

## 7. Camadas 2D por cima (HTML, não 3D)
Card de terminal (topo, digita o comando), contador "PEÇAS n/13", título amarelo, etiquetas (vermelha = problema, verde = solução, cinza = neutro), legenda de uma palavra por vez (y 1240), textos finais e o flash branco dos cliques.

## 8. Como eu verifico
Scripts que medem em pixels: tamanho de cada plano, legenda e título sem colisão, raycast de visibilidade (85% da peça visível), distâncias, câmera x tronco. Depois renderizo stills (imagens de frames escolhidos) e a prévia em meia resolução, e olho 1 frame por segundo. Render por software: ~1 frame/s, uns 50 min o vídeo todo; mudanças locais re-renderizam só 1 bloco de 900 frames (~10 min).

## 9. O que eu enxergo e o que não
- Vejo imagens (stills e frames); **não ouço** o áudio (ainda nem existe `narracao.mp3`; os tempos são estimados por caracteres).
- Em miniatura (1 frame/s) leio mal texto pequeno e não pego movimento fino.
- Não "vejo" o vídeo rodando: infiro movimento por frames próximos e pelas regras do código.

## 10. Como me passar um erro para eu conseguir corrigir
Formato que funciona melhor (um item por linha):
`segmento (sXX) + segundo aproximado + o que se vê + o que deveria ser + quanto`
Vocabulário que mapeia direto para o código: segmento (s00 a s14), **casa**, **peça**, **pedestal**, **plaquinha**, **placa de foto**, **etiqueta**, **card**, **título**, **legenda**, **contador**, e os planos **caminhada / close / cena / placa / detalhe / aberto**.
Para tamanho, use % da largura ou da altura da tela (1080 x 1920): "a peça no close deveria ocupar 80% da largura" é executável; "está pequeno" não é.
Para posição, diga a casa e o lado: "no s05 a noiva fica atrás do fotógrafo, passar para a esquerda dele".
Para tempo, diga a palavra: "a etiqueta VERMELHA deveria aparecer em 'desmarca', hoje aparece depois".
Se a mudança for no estilo (cor, forma, ângulo, chão), mande o frame da referência e aponte o que copiar.
