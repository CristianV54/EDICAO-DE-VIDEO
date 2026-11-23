import React from 'react';
import {Composition, Still} from 'remotion';
import {Teste} from './Teste';
import {CapaA, CapaB, CapaC} from './Capa';
import {Vitrine} from './Vitrine';

export const Root: React.FC = () => (
  <>
    <Composition id="Teste" component={Teste} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Still id="CapaA" component={CapaA} width={1280} height={720} />
    <Still id="CapaB" component={CapaB} width={1280} height={720} />
    <Still id="CapaC" component={CapaC} width={1280} height={720} />
    <Still id="Vitrine" component={Vitrine} width={1920} height={1080} />
  </>
);
