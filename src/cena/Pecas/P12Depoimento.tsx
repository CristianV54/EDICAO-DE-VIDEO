import React from "react";
import { B, geoEstrela } from "../primitivas";
import { PecaProps } from "./tipos";

export const P12Depoimento: React.FC<PecaProps> = ({ fs }) => (
  <group rotation={[0, 0.1, 0]}>
    <B p={[0, 0.6, 0]} s={[1.4, 0.82, 0.14]} c="#F5C542" r={0.12} />
    <B p={[-0.4, 0.14, 0]} s={[0.28, 0.28, 0.14]} c="#F5C542" r={0.04} rot={[0, 0, Math.PI / 4]} />
    {[0, 1, 2, 3, 4].map((i) => {
      const ligada = fs - i * 3 >= 0;
      return (
        <mesh key={i} position={[-0.52 + i * 0.26, 0.6, 0.1]} scale={[0.1, 0.1, 0.12]} geometry={geoEstrela()} castShadow>
          <meshStandardMaterial color={ligada ? "#FFFFFF" : "#9A9588"} emissive={ligada ? "#FFE9A3" : "#000000"} emissiveIntensity={ligada ? 0.6 : 0} roughness={0.5} />
        </mesh>
      );
    })}
  </group>
);
