# Verificação (seção 8) com tempos provisórios

Stills em `verificacao/*.png` (1080x1920), gerados por `node scripts/gerar-stills.mjs`.
Cada segmento tem 3 stills: `_a_inicio` (início + 1,5 s), `_b_problema` (âncora problema + 0,3 s) e `_c_solucao` (âncora solução + 0,3 s).
`verificacao/sheets/*.png` são folhas de contato (3 stills lado a lado) só para conferência rápida.
A âncora só vale depois que a peça pousou (o instante usado é `max(âncora, toque + 3 frames)`).

Itens conferidos em cada still: (1) peça do segmento visível, no centro, sem corte por borda/card/legenda; (2) legenda, título, card e contador sem sobreposição;
(3) etiqueta perto da peça certa e na área segura; (4) personagem com a câmera na mão onde aparece; (5) sem palavra cortada, sem travessão, acentos corretos;
(6) contador com o número certo; (7) final legível e dentro da área segura.

| Segmento | início | problema | solução | Observação |
|---|---|---|---|---|
| s00 gancho | ok | ok | ok | Fotógrafo com câmera na mão; etiqueta FOTÓGRAFO? sobre ele; contador 0/13 aparece em "treze" |
| s01 câmera | ok | ok | ok | Seletor AUTO pisca e gira para M |
| s02 lente | ok | ok | ok | Foto escura e depois clara com círculo nítido |
| s03 cartão duplo | ok | ok | ok | X no cartão esquerdo, direito verde |
| s04 flash | ok | ok | ok | Luzes a 25% em "apagaram"; estouro do flash volta a luz |
| s05 portfólio | ok | ok | ok | Álbum abre |
| s06 instagram | ok | ok | ok | Tela vazia, depois grade preenchendo |
| s07 proposta | ok | ok | ok | Etiqueta cinza VISUALIZOU |
| s08 contrato | ok | ok | ok | Noivos ao lado do contrato, assinatura e carimbo |
| s09 sinal | ok | ok | ok | R$ vira 30%, círculo verde no calendário |
| s10 backup | ok | ok | ok | Fumaça no HD 1, nuvem e HD 2 acendem verde |
| s11 galeria | ok | ok | ok | Celular pixelado some, cadeado pula |
| s12 depoimento | ok | ok | ok | Estrelas acendem uma a uma |
| s13 indicação | ok | ok | ok | Novo cliente entra caminhando |
| s14 final | ok | ok | ok | Textos finais e @ legíveis |
| final | "para" + 1,8 s ok | "comenta" + 0,5 s ok | último frame ok | Plano aberto alto, confete, 3 textos e @ dentro da área segura |

## Desvios conscientes do roteiro (para o enquadramento vertical 9:16)

- **FOV dos closes 54 em vez de 40**: em tela 9:16, FOV vertical 40 mostra só 1,9 m de largura e corta as peças de 1,2 m. Mira 0,17 m acima do centro da peça.
- **s08**: os noivos ficam na plataforma, à direita do contrato (escala 0,5), e não em x = 7, que ficaria fora do quadro do close. Câmera mais aberta.
- **s13**: câmera mais aberta para caber o casal e o novo cliente; o novo cliente anda sobre a plataforma até (5,2, 0,5, 2,5).
- **Etiquetas**: posição projetada com altura própria por peça (0,8 a 1,7 acima do topo da plataforma, em vez de 1,4 fixo) e travada abaixo do card (y ≥ 480).
- **Textos finais e legenda**: tamanho reduzido automaticamente para caber em 840 px (x entre 60 e 960). Com os tamanhos do roteiro, "DESMONTADA" passaria da área segura.
- **Plano final** com FOV 82 (câmera em (-0,6, 10,5, 14,2)) para caber a plataforma e o quarto no vertical.
