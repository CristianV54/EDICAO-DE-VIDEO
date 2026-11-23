import React from 'react';
import {Composition, Still} from 'remotion';
import {Teste} from './Teste';
import {CapaA, CapaB, CapaC} from './Capa';
import {Vitrine} from './Vitrine';
import {Gancho3D, DURACAO_GANCHO_3D} from './cenas/Gancho3D';
import {CENAS, caudaDe, fazerCena} from './cenas/roteiro';
import {duracaoCena} from './motor/motor';

export const Root: React.FC = () => (
  <>
    {Object.keys(CENAS).map((k) => {
      const n = Number(k);
      return <Composition key={n} id={`Cena${String(n).padStart(2, '0')}`} component={fazerCena(n)} durationInFrames={duracaoCena(n, CENAS[n].abertura?.dur ?? 0, caudaDe(n))} fps={30} width={1920} height={1080} />;
    })}
    <Composition id="Gancho3D" component={Gancho3D} durationInFrames={DURACAO_GANCHO_3D} fps={30} width={1920} height={1080} />
    <Composition id="Teste" component={Teste} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Still id="CapaA" component={CapaA} width={1280} height={720} />
    <Still id="CapaB" component={CapaB} width={1280} height={720} />
    <Still id="CapaC" component={CapaC} width={1280} height={720} />
    <Still id="Vitrine" component={Vitrine} width={1920} height={1080} />
  </>
);
