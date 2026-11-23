import React from 'react';
import {Composition} from 'remotion';
import {Teste} from './Teste';

export const Root: React.FC = () => (
  <>
    <Composition id="Teste" component={Teste} durationInFrames={150} fps={30} width={1920} height={1080} />
  </>
);
