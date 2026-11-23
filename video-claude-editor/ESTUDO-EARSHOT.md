# Estudo: earshot

Repositório indicado pelo Cristian em 23/11/2026: https://github.com/Leonxlnx/earshot. Versão estudada: 1.0.0.

## O que é

Uma ferramenta que faz efeitos sonoros para um agente de código, que não consegue ouvir. O agente pede o som em palavras e recebe um arquivo novo, junto com os números que substituem o ouvido: duração, instante do pico e volume.

- **Catálogo:** 922 desenhos de som em 384 famílias. 309 são aprendidos de 692 gravações de domínio público: passos, portas, interruptores, teclados, vidro, água e outros.
- **Sem arquivo pronto:** nenhum áudio vem no repositório. Cada som é gerado por código na hora do pedido, e cada pedido pode render vários takes diferentes.
- **Conjuntos prontos:** para interface, jogo, fliperama e filme. O de filme tem 17 sons medidos em vídeos profissionais.
- **O que não faz:** música (só três bases curtas), fala e melodia.
- **Ouvidos:** um módulo extra descreve um arquivo de áudio com dois modelos abertos. Exige baixar cerca de 1,1 GB. Não instalei nesta sessão.

## As regras de som que vieram com ele

A skill `real-sound` do repositório traz normas medidas em vídeos profissionais. As que mudaram o nosso vídeo:

| Regra | O que eu fazia | O que passou a valer |
|---|---|---|
| Whoosh é raro: cerca de dois por filme, nunca em todo corte | Um whoosh em toda troca de trecho | Whoosh só nas aberturas em 3D e em poucos movimentos grandes |
| Cerca de 85% dos cortes não têm som próprio | Som em quase tudo | A maioria das trocas é muda |
| Ação repetida usa um conjunto de 4 ou mais takes, sem repetir o mesmo seguido | O mesmo arquivo sempre | Cada tipo de som tem de 2 a 6 takes, alternados |
| Cada tipo de som tem um nível próprio, constante | Volumes diferentes sem critério | Um alvo de volume por tipo, calculado pelo volume medido de cada arquivo |
| O pico do whoosh cai no quadro do movimento, e o impacto cai no quadro do contato | Som começando no quadro | O som é adiantado pelo tempo até o pico |
| A maior parte da digitação em tela é muda | Uma tecla por letra | Poucas teclas por pedido |
| Volume final em -14 LUFS | -21,7 LUFS | -14 LUFS na montagem final |

## Como está sendo usado

- `ferramentas/sons.py` pede 22 tipos de som ao earshot e grava 73 arquivos em `public/som/fx/`, com o manifesto de duração, pico e volume.
- `src/motor/motor.tsx` lê o manifesto, alterna os takes, alinha o pico e nivela cada som pelo alvo do seu tipo.
- A música vem de outra fonte, registrada em `CREDITOS.md`.

## Limites que eu continuo tendo

Eu meço, mas não ouço. Se um som combina com a imagem, se a música agrada e se o equilíbrio está bom, quem decide é o Cristian.
