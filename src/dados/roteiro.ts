import segmentos from "./segmentos.json";
import { centroCasa, posCelularCasa3, posFot, V3 } from "./posicoes";

export type { V3 };
export type Vec3 = V3;
export type TipoEtiqueta = "problema" | "solucao" | "cinza";

export type Etiqueta = {
  quando: string; // nome de uma ancora do segmento (problema, solucao, segunda, ...)
  texto: string;
  tipo: TipoEtiqueta;
  alvo?: V3; // ponto do mundo onde a etiqueta fica ancorada (padrao: acima da casa do segmento)
  ate?: string;
};

export type ItemRoteiro = {
  id: string;
  texto: string;
  titulo: string | null;
  tarefa: string | null;
  etiquetas: Etiqueta[];
};

export const N_PECAS = 13;

const acimaDaCasa = (n: number): V3 => {
  const c = centroCasa(n);
  return [c[0], 2.95, c[2] + 0.2];
};

const E = (quando: string, texto: string, tipo: TipoEtiqueta, alvo?: V3, ate?: string): Etiqueta => ({ quando, texto, tipo, alvo, ate });

const dados: Omit<ItemRoteiro, "id" | "texto">[] = [
  { titulo: null, tarefa: null, etiquetas: [E("problema", "PRIMEIRO CASAMENTO?", "problema", [posFot(1)[0], 2.55, posFot(1)[2]], "solucao")] },
  { titulo: "CÂMERA", tarefa: "aprender o modo manual", etiquetas: [E("problema", "MODO AUTO", "problema"), E("solucao", "MANUAL", "solucao")] },
  { titulo: "PORTFÓLIO", tarefa: "montar o portfólio", etiquetas: [E("problema", "SEM TRABALHO PRA MOSTRAR", "problema"), E("solucao", "PORTFÓLIO PRONTO", "solucao")] },
  { titulo: "INSTAGRAM", tarefa: "postar no Instagram", etiquetas: [E("problema", "NINGUÉM VÊ", "problema"), E("solucao", "PRIMEIRO DIRECT", "solucao")] },
  { titulo: "PROPOSTA", tarefa: "fazer proposta em PDF", etiquetas: [E("problema", "VISUALIZOU", "cinza"), E("solucao", "QUERO FECHAR", "solucao")] },
  { titulo: "CONTRATO", tarefa: "contrato assinado", etiquetas: [E("problema", "DESMARCOU", "problema"), E("solucao", "TEM O QUE COBRAR", "solucao")] },
  { titulo: "SINAL", tarefa: "cobrar 30% de sinal", etiquetas: [E("problema", "SÓ PROMESSA", "problema"), E("solucao", "DATA RESERVADA", "solucao")] },
  { titulo: "LENTE", tarefa: "trocar a lente do kit", etiquetas: [E("problema", "FOTO ESCURA", "problema"), E("solucao", "ENTRA LUZ", "solucao")] },
  { titulo: "CARTÃO DUPLO", tarefa: "câmera com dois slots", etiquetas: [E("problema", "CARTÃO CORROMPEU", "problema"), E("solucao", "SLOT 2 SALVOU", "solucao")] },
  { titulo: "FLASH", tarefa: "comprar um flash", etiquetas: [E("segunda", "FOTO GRANULADA", "problema"), E("solucao", "O CASAL BRILHA", "solucao")] },
  { titulo: "BACKUP", tarefa: "3 cópias de tudo", etiquetas: [E("problema", "HD QUEIMOU", "problema"), E("solucao", "3 CÓPIAS", "solucao")] },
  { titulo: "GALERIA", tarefa: "entregar em galeria", etiquetas: [E("problema", "TÁ PIXELADO", "problema"), E("solucao", "GALERIA EM ALTA", "solucao")] },
  { titulo: "DEPOIMENTO", tarefa: "pedir depoimento", etiquetas: [E("problema", "NINGUÉM SABE", "problema"), E("solucao", "POSTADO", "solucao", [posCelularCasa3()[0], 2.9, posCelularCasa3()[2] + 0.3])] },
  { titulo: "INDICAÇÃO", tarefa: "pedir indicação", etiquetas: [E("solucao", "PRÓXIMO CASAMENTO", "solucao")] },
  { titulo: null, tarefa: null, etiquetas: [] },
];

export const ROTEIRO: ItemRoteiro[] = segmentos.map((s, i) => ({
  id: s.id,
  texto: s.texto,
  titulo: dados[i].titulo,
  tarefa: dados[i].tarefa,
  etiquetas: dados[i].etiquetas.map((e) => ({ ...e, alvo: e.alvo ?? (i >= 1 && i <= 13 ? acimaDaCasa(i) : undefined) })),
}));
