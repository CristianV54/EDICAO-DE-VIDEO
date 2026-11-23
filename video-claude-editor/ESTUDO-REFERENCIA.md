# Estudo: vídeo de referência sobre edição com o Claude Code

O Cristian enviou em 23/11/2026 um estudo com folhas de quadros e a transcrição de um vídeo de outro criador sobre o mesmo assunto. O material bruto (imagens e transcrição) é de terceiros e não foi copiado para este repositório. Aqui ficam só as minhas anotações.

## O que o vídeo faz

- **Estrutura:** a pessoa fala para a câmera, e as animações entram por cima ou em tela cheia nos momentos de explicação.
- **Fundo das animações:** quase preto, com um brilho suave na cor de destaque, riscos de luz e pontinhos.
- **Peças:** janelas de vidro escuro com barra de título, linha do tempo com onda de áudio, fileira de etapas numeradas, cartões com números grandes, etiquetas pequenas em letra de máquina.
- **Texto:** poucas palavras, brancas, com uma em cor de destaque. Entram quando são ditas.
- **Cor:** uma cor de destaque só. Vermelho aparece apenas para erro.
- **Profundidade:** vem de desfoque, brilho e de uma inclinação leve em alguns momentos. Quase não há objeto 3D.
- **Roteiro:** abre dizendo que o vídeo foi editado pelo Claude, promete um processo em etapas e uma entrega gratuita no final, e avisa que não é "prompt mágico".

## O que levei para o nosso vídeo

| Da referência | No nosso vídeo |
|---|---|
| Base plana, com profundidade por brilho e desfoque | 2D como base e 3D só em momentos, conforme PLANO-3D.md |
| Uma cor de destaque | Laranja do Claude sobre quase preto |
| Janelas, etiquetas e texto com uma palavra colorida | Peças-base em `src/dois/base.tsx` e `src/motor/` |
| Palavras entrando na fala | As animações são amarradas ao tempo de cada frase e palavra da voz |
| Linha fina se desenhando | A cena da palavra "animação", no gancho |

## O que é diferente de propósito

- O nosso vídeo não tem ninguém na câmera: é todo animado.
- A cor, as cenas, o personagem e o roteiro são nossos. A referência serve para medir o jeito de montar e de mover, não para copiar o desenho.
