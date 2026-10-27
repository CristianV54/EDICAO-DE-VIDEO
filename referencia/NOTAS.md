# Notas sobre o vídeo de referência (720x1280, 30 fps, 145 s)

Estudado em 73 quadros (1 a cada 2 s, em `referencia/quadros/`). Números aproximados, medidos nos quadros 360x640.
A régua é a linguagem visual (ângulos, proporções, cores, rótulos, cabos, encenação), nunca o conteúdo.

## Câmera
- **Altura e inclinação:** olha de cima para baixo, por volta de 35° a 45° acima da mesa. Nunca é vista de topo e nunca é rente à mesa. Nos closes a câmera fica a uns 3 a 4 m da peça principal (em unidades em que a peça tem ~1,2 de largura).
- **Peça principal no close:** ocupa de 45% a 70% da largura da tela e fica no terço central, um pouco acima do meio (centro em y ≈ 40% a 50% da altura). O "APP" azul chega a encher 60% da largura.
- **Planos de contexto:** mostram a plataforma inteira inclinada na diagonal (canto mais próximo embaixo à esquerda), mais o fotógrafo no fundo, ocupando ~35% a 50% da largura. A câmera gira devagar em volta (alguns graus por plano) e as transições entre planos são suaves.
- **Final:** plano alto e aberto, com a plataforma inteira no terço inferior, o personagem no fundo e o chão de madeira em volta; sobre ele entram os textos finais.

## O que aparece em volta
- **Chão de madeira** é sempre visível: 30% a 55% do quadro, quase sempre o quarto inferior inteiro. Tábuas largas (~1 m) em bege-alaranjado `#E0B27A` com frestas mais escuras, em diagonal por causa do ângulo.
- **Tapete** verde-água `#14B5A0` com borda mais clara forma uma moldura de ~0,5 m em volta da plataforma.
- **Quarto:** parede bege, quadros, estante com livros, planta, mesa de trabalho com monitor, cadeira e o personagem sentado (de costas). Quase todo plano de contexto mostra um pedaço desse fundo no topo do quadro.
- **No final** a ilha toda (chão + tapete) flutua sobre um fundo azul-céu (as bordas do chão aparecem).

## Peças
- **Blocos grossos**, quase cubos, com cantos bem arredondados (raio ~15% do lado), levemente inclinados em relação à mesa.
- **Cores chapadas e saturadas:** azul `#2E9BF0` (APP), roxo `#7B4DEB` (API), amarelo `#F2C230` (cilindro DB), verde `#3DD07A` (maquininha), cinza escuro (cofre).
- **Rótulo:** plaquinha branca/creme `#EDE8DC` colada na frente, com texto preto em negrito (APP, API, DB), sempre legível.
- **Sombras:** suaves e curtas, que "assentam" a peça na plataforma.
- **Plataforma:** escura, quase preta azulada `#15171F`, com uma faixa de LEDs verdes tracejados na frente e um pequeno painel de LEDs no canto.
- **Peças pequenas** (A, B, 14h) são cubinhos coloridos que aparecem em cima das peças grandes.

## Cabos
- Tubo preto grosso (raio ~0,06 a 0,08, "linguiça") em arco de ~0,5 a 0,8 acima da mesa.
- **Esferas azuis** `#3B9EF0` nas duas pontas (raio ~0,15) e outras no meio do arco; uma bolinha de outra cor (verde ou amarelo) corre pelo cabo.
- O cabo é desenhado progressivamente, da peça de origem até a de destino, em menos de 1 s.

## Iluminação e cor
- Luz quente e alta, sombras suaves e bem visíveis no chão, cores muito saturadas, quase sem preto puro nos objetos (só a plataforma e o monitor).
- Nas cenas de problema grave (vazamento, queda) a luz esfria/avermelha por alguns segundos e depois volta.

## Personagem no fundo
- O programador (suéter verde-água, cabelo castanho, fone laranja) fica sentado de costas na mesa, **visível no fundo em quase todo plano de contexto**, no canto superior direito, pequeno (~15% a 25% da largura).
- Nos closes de peça ele quase some; nos planos de abertura e de fechamento ele ocupa o centro e é o foco.
- No final ele levanta os braços comemorando, com confete (bolinhas pequenas) em volta.

## Como os problemas são encenados (nunca só em texto)
- **Catraca:** duas colunas brancas com uma barra vermelha e cadeado dourado; o cliente (suéter azul) e a cliente (suéter rosa) ficam parados na frente com a etiqueta "ESQUECI A SENHA". A barra e o cadeado são objetos 3D.
- **Pessoas** de pé, com o corpo todo visível, de frente para a peça, em escala um pouco maior que a peça.
- **Fumaça:** esferas cinza de low-poly subindo da peça (incêndio) com a cena avermelhada e luz vermelha piscando.
- **Nuvem do GitHub:** nuvem preta grande com plaquinha "GITHUB" e uma chave dourada caindo; sobe sobre a cadeira do personagem.
- **Cofre** (cinza escuro com tranca dourada) e **chave** dourada como objetos 3D.
- **Etiqueta** pequena ("SÓ NO SEU PC", "LIGADO 24H", "BLOQUEADO", "VAZOU") com bolinha vermelha ou verde acompanha cada problema/solução; títulos amarelos em itálico aparecem no início de cada peça.

## HUD sobre a cena
- Pílula branca "PEÇAS N/13" no canto superior direito (o N em laranja).
- Card escuro de terminal com 3 bolinhas, digitando o comando em fonte mono.
- Legenda de uma palavra por vez, branca com contorno preto, no terço inferior (palavras importantes em amarelo).
- Texto final em 3 linhas centralizadas sobre o plano alto, mais o @ em pílula escura na parte inferior.
