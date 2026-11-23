import React from 'react';

// Monitor com um programa de edição genérico, desenhado em HTML.
// Não imita nenhum programa específico.
const faixa = (cor: string, clipes: [number, number][], onda = false) => (
  <div style={{position: 'relative', height: 26, marginBottom: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 4}}>
    {clipes.map(([x, w], i) => (
      <div key={i} style={{position: 'absolute', left: `${x}%`, width: `${w}%`, top: 2, bottom: 2, background: cor, borderRadius: 4, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 2, padding: '0 3px'}}>
        {onda
          ? Array.from({length: 60}).map((_, k) => <div key={k} style={{width: 2, flexShrink: 0, height: 4 + Math.abs(Math.sin(k * 1.7 + i * 3 + x)) * 16, background: 'rgba(0,0,0,0.45)'}} />)
          : null}
      </div>
    ))}
  </div>
);

export const TelaEditor: React.FC<{
  larg: number;
  alt: number;
  estilo?: React.CSSProperties;
  impacto?: [number, number]; // ponto da rachadura, em % da tela
}> = ({larg, alt, estilo, impacto}) => {
  const miniaturas = ['#2dd4bf', '#f472b6', '#818cf8', '#fbbf24', '#34d399', '#fb7185', '#60a5fa', '#a78bfa', '#f97316'];
  return (
    <div style={{position: 'absolute', width: larg, height: alt, ...estilo}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#0b0f12',
          borderRadius: 18,
          border: '10px solid #1a1f24',
          boxShadow: '0 0 90px rgba(45,212,191,0.55), 0 30px 60px rgba(0,0,0,0.7)',
          overflow: 'hidden',
        }}
      >
        <div style={{height: '6%', background: '#151a1f', display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12}}>
          {['#fb7185', '#fbbf24', '#34d399'].map((c) => (
            <div key={c} style={{width: 9, height: 9, borderRadius: 5, background: c}} />
          ))}
        </div>
        <div style={{display: 'flex', height: '52%', gap: 8, padding: 8}}>
          <div style={{width: '36%', background: '#11161a', borderRadius: 6, padding: 7, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, alignContent: 'start'}}>
            {miniaturas.map((c, i) => (
              <div key={i} style={{aspectRatio: '16 / 10', borderRadius: 4, background: `linear-gradient(135deg, ${c}, #0b0f12 140%)`}} />
            ))}
          </div>
          <div style={{flex: 1, borderRadius: 6, background: 'linear-gradient(160deg, #134e4a 0%, #0e7490 45%, #f97316 130%)', position: 'relative', overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, marginLeft: -12, marginTop: -18, borderLeft: '30px solid rgba(255,255,255,0.85)', borderTop: '18px solid transparent', borderBottom: '18px solid transparent'}} />
          </div>
        </div>
        <div style={{height: '42%', padding: '4px 8px', position: 'relative'}}>
          {faixa('#2dd4bf', [[2, 22], [25, 14], [41, 30], [73, 24]])}
          {faixa('#818cf8', [[8, 30], [40, 18], [60, 34]])}
          {faixa('#f472b6', [[2, 12], [30, 26], [58, 16], [78, 18]])}
          {faixa('#34d399', [[2, 96]], true)}
          {faixa('#22d3ee', [[2, 60], [64, 34]], true)}
          <div style={{position: 'absolute', left: '47%', top: 0, bottom: 0, width: 3, background: '#fff', boxShadow: '0 0 12px #fff'}} />
        </div>
        {impacto ? (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
            {Array.from({length: 13}).map((_, i) => {
              let a = (i / 13) * Math.PI * 2 + 0.3;
              let [x, y] = impacto;
              let d = `M ${x} ${y}`;
              for (let k = 0; k < 7; k++) {
                a += Math.sin(i * 4.3 + k * 2.1) * 0.5;
                x += Math.cos(a) * 11;
                y += Math.sin(a) * 15;
                d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
              }
              return <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.85)" vectorEffect="non-scaling-stroke" style={{strokeWidth: 3}} />;
            })}
          </svg>
        ) : null}
      </div>
    </div>
  );
};

// Fundo de estúdio desfocado: monitores e luzes ao longe.
export const FundoEstudio: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 45%, #0f3d3a 0%, #071615 55%, #040908 100%)', overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: -40, filter: 'blur(22px)'}}>
      <div style={{position: 'absolute', left: 60, top: 120, width: 300, height: 190, background: 'linear-gradient(160deg, #2dd4bf, #0e7490)', borderRadius: 10, opacity: 0.55}} />
      <div style={{position: 'absolute', left: 1010, top: 90, width: 330, height: 210, background: 'linear-gradient(200deg, #22d3ee, #134e4a)', borderRadius: 10, opacity: 0.5}} />
      <div style={{position: 'absolute', left: 520, top: 30, width: 240, height: 12, background: '#5eead4', opacity: 0.8}} />
      <div style={{position: 'absolute', left: 880, top: 420, width: 14, height: 300, background: '#2dd4bf', opacity: 0.7}} />
      {[[180, 520, 26], [420, 80, 18], [760, 600, 30], [1180, 520, 22], [960, 60, 16], [80, 380, 14]].map(([x, y, r], i) => (
        <div key={i} style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, borderRadius: '50%', background: i % 2 ? '#fb923c' : '#5eead4', opacity: 0.55}} />
      ))}
    </div>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)'}} />
  </div>
);
