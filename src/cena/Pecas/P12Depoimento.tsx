import React from "react";
import { B, geoEstrela } from "../primitivas";
import { Plaquinha } from "./Plaquinha";
import { PecaProps, prog } from "./tipos";

// balao de fala amarelo com 5 estrelas, flutuando acima do casal cliente
export const P12Depoimento: React.FC<PecaProps> = ({ fs }) => {
  const voo = fs >= 14 ? prog(fs - 14, 22) : 0;
  return (
    <group rotation={[0, 0.1, 0]}>
      <B s={[1.2, 0.7, 0.14]} c="#F5C542" r={0.12} />
      <B p={[-0.4, -0.42, 0]} s={[0.26, 0.26, 0.14]} c="#F5C542" r={0.04} rot={[0, 0, Math.PI / 4]} />
      <Plaquinha tex="plq_depoimento" p={[0, -0.5, 0.1]} w={0.5} rot={[-0.3, 0, 0]} />
      {[0, 1, 2, 3, 4].map((i) => {
        const ligada = fs - i * 3 >= 0;
        return (
          <mesh key={i} position={[-0.46 + i * 0.23, 0.0, 0.1]} scale={[0.09, 0.09, 0.12]} geometry={geoEstrela()} castShadow>
            <meshStandardMaterial color={ligada ? "#FFFFFF" : "#9A9588"} emissive={ligada ? "#FFE9A3" : "#000000"} emissiveIntensity={ligada ? 0.6 : 0} roughness={0.5} />
          </mesh>
        );
      })}
      {/* estrela dourada pequena voa ate o celular do Instagram */}
      {voo > 0 && voo < 1 && (
        <mesh position={[0.46 + (1.1 - 0.46) * voo * 0 + (2.7 - 1.6) * voo, -(2.9 - 1.1) * voo + Math.sin(voo * Math.PI) * 0.8, -(0.6 + 2.3) * voo]} scale={[0.07, 0.07, 0.09]} geometry={geoEstrela()}>
          <meshStandardMaterial color="#FFD25A" emissive="#FFD25A" emissiveIntensity={1.2} />
        </mesh>
      )}
    </group>
  );
};
