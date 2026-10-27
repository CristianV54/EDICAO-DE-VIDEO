import React from "react";
import { P05Portfolio } from "./P05Portfolio";
import { P06Instagram } from "./P06Instagram";
import { P07Proposta } from "./P07Proposta";
import { P08Contrato } from "./P08Contrato";
import { P09Sinal } from "./P09Sinal";
import { P10Backup } from "./P10Backup";
import { P11Galeria } from "./P11Galeria";
import { P12Depoimento } from "./P12Depoimento";
import { P13Indicacao } from "./P13Indicacao";
import type { PecaProps } from "./tipos";

// pecas do ato 2, pelo numero da peca (as pecas 1 a 4 ficam na camera do fotografo)
export const PECAS_ATO2: Record<number, React.FC<PecaProps>> = {
  5: P05Portfolio, 6: P06Instagram, 7: P07Proposta, 8: P08Contrato, 9: P09Sinal,
  10: P10Backup, 11: P11Galeria, 12: P12Depoimento, 13: P13Indicacao,
};
