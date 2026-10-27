import React from "react";
import { P01Camera } from "./P01Camera";
import { P02Lente } from "./P02Lente";
import { P03Cartao } from "./P03Cartao";
import { P04Flash } from "./P04Flash";
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

export const PECAS: React.FC<PecaProps>[] = [
  P01Camera, P02Lente, P03Cartao, P04Flash, P05Portfolio, P06Instagram, P07Proposta,
  P08Contrato, P09Sinal, P10Backup, P11Galeria, P12Depoimento, P13Indicacao,
];
