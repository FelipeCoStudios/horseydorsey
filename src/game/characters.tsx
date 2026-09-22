import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { HorseDef } from "./data";
import { GroundBlob } from "./scenery";
import { sim } from "./sim";
import { useGame } from "./store";
import { heightAt } from "./world";

const std = (color: string, opts?: { roughness?: number }) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: opts?.roughness ?? 0.72,
    metalness: 0.02,
    flatShading: true,
  });

const geo = {
  sphere: new THREE.SphereGeometry(1, 8, 6),
  sphereHi: new THREE.SphereGeometry(1, 10, 8),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 8),
  cone: new THREE.ConeGeometry(1, 1, 8),
  box: new THREE.BoxGeometry(1, 1, 1),
};

function MeshStd({
  geometry,
  color,
  position,
  rotation,
  scale,
  cast = true,
  receive = true,
  roughness,
}: {
  geometry: THREE.BufferGeometry;
  color: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  cast?: boolean;
  receive?: boolean;
  roughness?: number;
}) {
  const material = useMemo(() => std(color, { roughness }), [color, roughness]);
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow={cast}
      receiveShadow={receive}
    />
  );
}

/**
 * Force pure yaw only. Zero pitch/roll every frame so characters stay upright.
 * Models face +Z; sim forward is (-sin(yaw), -cos(yaw)) → add PI.
 */
function orientUpright(g: THREE.Object3D, yaw: number) {
  g.rotation.order = "YXZ";
  g.rotation.set(0, yaw + Math.PI, 0);
  g.quaternion.setFromEuler(g.rotation);
  g.updateMatrix();
}

export function HorseMesh({ def }: { def: HorseDef }) {
  const root = useRef<THREE.Group>(null);
  const lf = useRef<THREE.Group>(null);
  const rf = useRef<THREE.Group>(null);
  const lb = useRef<THREE.Group>(null);
  const rb = useRef<THREE.Group>(null);
  const neck = useRef<THREE.Group>(null);

  useFrame(() => {
    const horse = sim.horses.find((h) => h.id === def.id);
    const g = root.current;
    if (!g || !horse) return;
    const race = useGame.getState().phase === "race";
    if (race && horse.id !== sim.raceHorseId) { g.visible = false; return; }
    g.visible = true;
    const y = heightAt(horse.x, horse.z);
    g.position.set(horse.x, y, horse.z);
    orientUpright(g, horse.yaw);
    const swing = Math.sin(horse.walkPhase) * 0.42 * Math.min(1, horse.speed / 2);
    if (lf.current) lf.current.rotation.x = swing;
    if (rb.current) rb.current.rotation.x = swing;
    if (rf.current) rf.current.rotation.x = -swing;
    if (lb.current) lb.current.rotation.x = -swing;
    if (neck.current) {
      neck.current.rotation.x = -0.55 + Math.sin(sim.time * 1.4 + horse.walkPhase) * 0.04;
    }
  });

  const s = def.scale;
  const coat = def.coat;
  const mane = def.mane;
  const hoof = "#2a221c";
  const sock = def.socks ? "#f0e6d4" : coat;

  return (
    <group ref={root} scale={s}>
      <GroundBlob radius={0.72} />
      <MeshStd geometry={geo.sphereHi} color={coat} position={[0, 1.08, 0]} scale={[0.42, 0.5, 0.78]} />
      <MeshStd geometry={geo.sphere} color={coat} position={[0, 1.02, 0.52]} scale={[0.4, 0.46, 0.38]} />
      <MeshStd geometry={geo.sphere} color={coat} position={[0, 1.1, -0.52]} scale={[0.44, 0.5, 0.42]} />
      <MeshStd geometry={geo.sphere} color="#4a372c" position={[0, 0.92, 0.08]} scale={[0.32, 0.22, 0.58]} roughness={0.85} />

      <group ref={neck} position={[0, 1.28, 0.5]}>
        <MeshStd geometry={geo.cyl} color={coat} position={[0, 0.28, 0.18]} rotation={[0.9, 0, 0]} scale={[0.16, 0.62, 0.16]} />
        <MeshStd geometry={geo.sphere} color={mane} position={[0, 0.34, 0.02]} scale={[0.1, 0.28, 0.22]} />
      </group>

      <group position={[0, 1.72, 1.02]}>
        <MeshStd geometry={geo.sphere} color={coat} scale={[0.22, 0.2, 0.28]} />
        <MeshStd geometry={geo.sphere} color={coat} position={[0, -0.04, 0.22]} scale={[0.16, 0.13, 0.22]} />
        <MeshStd geometry={geo.sphere} color="#1a1410" position={[0, -0.02, 0.4]} scale={[0.09, 0.07, 0.08]} />
        <MeshStd geometry={geo.cone} color={coat} position={[0.1, 0.22, 0.02]} rotation={[0.15, 0, 0.4]} scale={[0.055, 0.18, 0.045]} />
        <MeshStd geometry={geo.cone} color={coat} position={[-0.1, 0.22, 0.02]} rotation={[0.15, 0, -0.4]} scale={[0.055, 0.18, 0.045]} />
        {def.blaze ? (
          <MeshStd geometry={geo.box} color="#f4eee4" position={[0, 0.02, 0.18]} scale={[0.05, 0.14, 0.28]} />
        ) : null}
        <MeshStd geometry={geo.sphere} color="#16120f" position={[0.12, 0.06, 0.16]} scale={[0.04, 0.045, 0.03]} />
        <MeshStd geometry={geo.sphere} color="#16120f" position={[-0.12, 0.06, 0.16]} scale={[0.04, 0.045, 0.03]} />
        <MeshStd geometry={geo.sphere} color={mane} position={[0, 0.16, -0.08]} scale={[0.14, 0.12, 0.16]} />
      </group>

      <MeshStd geometry={geo.cone} color={mane} position={[0, 1.05, -0.92]} rotation={[-1.15, 0, 0]} scale={[0.08, 0.55, 0.08]} />
      <MeshStd geometry={geo.sphere} color={mane} position={[0, 1.12, -1.18]} scale={[0.07, 0.08, 0.12]} />

      {def.spots
        ? [0, 1, 2, 3, 4, 5].map((i) => (
            <MeshStd
              key={i}
              geometry={geo.sphere}
              color="#2c241c"
              position={[i % 2 === 0 ? 0.28 : -0.28, 1.15 + (i % 3) * 0.08, -0.35 + i * 0.14]}
              scale={[0.07, 0.05, 0.09]}
              cast={false}
            />
          ))
        : null}

      <group ref={lf} position={[0.2, 0.7, 0.38]}>
        <MeshStd geometry={geo.cyl} color={coat} position={[0, -0.18, 0]} scale={[0.07, 0.42, 0.07]} />
        <MeshStd geometry={geo.cyl} color={sock} position={[0, -0.52, 0]} scale={[0.065, 0.28, 0.065]} />
        <MeshStd geometry={geo.sphere} color={hoof} position={[0, -0.68, 0.02]} scale={[0.08, 0.05, 0.1]} />
      </group>
      <group ref={rf} position={[-0.2, 0.7, 0.38]}>
        <MeshStd geometry={geo.cyl} color={coat} position={[0, -0.18, 0]} scale={[0.07, 0.42, 0.07]} />
        <MeshStd geometry={geo.cyl} color={sock} position={[0, -0.52, 0]} scale={[0.065, 0.28, 0.065]} />
        <MeshStd geometry={geo.sphere} color={hoof} position={[0, -0.68, 0.02]} scale={[0.08, 0.05, 0.1]} />
      </group>
      <group ref={lb} position={[0.22, 0.74, -0.42]}>
        <MeshStd geometry={geo.cyl} color={coat} position={[0, -0.2, 0]} scale={[0.08, 0.46, 0.08]} />
        <MeshStd geometry={geo.cyl} color={sock} position={[0, -0.56, 0]} scale={[0.07, 0.28, 0.07]} />
        <MeshStd geometry={geo.sphere} color={hoof} position={[0, -0.72, 0.02]} scale={[0.085, 0.05, 0.1]} />
      </group>
      <group ref={rb} position={[-0.22, 0.74, -0.42]}>
        <MeshStd geometry={geo.cyl} color={coat} position={[0, -0.2, 0]} scale={[0.08, 0.46, 0.08]} />
        <MeshStd geometry={geo.cyl} color={sock} position={[0, -0.56, 0]} scale={[0.07, 0.28, 0.07]} />
        <MeshStd geometry={geo.sphere} color={hoof} position={[0, -0.72, 0.02]} scale={[0.085, 0.05, 0.1]} />
      </group>
    </group>
  );
}

export function ValentinaMesh() {
  const root = useRef<THREE.Group>(null);
  const ll = useRef<THREE.Group>(null);
  const rl = useRef<THREE.Group>(null);
  const la = useRef<THREE.Group>(null);
  const ra = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = sim.player;
    const g = root.current;
    if (!g) return;
    if (useGame.getState().phase === "race") { g.visible = false; return; }
    g.visible = true;
    const y = heightAt(p.x, p.z);
    g.position.set(p.x, y, p.z);
    orientUpright(g, p.yaw);
    const swing = Math.sin(p.walkPhase) * 0.55 * Math.min(1, Math.abs(p.speed) / 3);
    if (ll.current) ll.current.rotation.x = swing;
    if (rl.current) rl.current.rotation.x = -swing;
    if (la.current) la.current.rotation.x = -swing * 0.8;
    if (ra.current) ra.current.rotation.x = swing * 0.8;
  });

  const skin = "#d4a07a";
  const hair = "#3a2418";
  const shirt = "#ead9c4";
  const vest = "#a45a40";
  const pants = "#5c4638";
  const boot = "#2a1f18";
  const hat = "#c4a36a";

  return (
    <group ref={root}>
      <GroundBlob radius={0.38} />
      <MeshStd geometry={geo.cyl} color={shirt} position={[0, 1.14, 0]} scale={[0.18, 0.4, 0.14]} />
      <MeshStd geometry={geo.box} color={vest} position={[0, 1.16, 0.03]} scale={[0.32, 0.36, 0.16]} />
      <MeshStd geometry={geo.cyl} color="#8a4a36" position={[0, 0.94, 0]} scale={[0.19, 0.05, 0.15]} />
      <MeshStd geometry={geo.sphereHi} color={skin} position={[0, 1.54, 0.02]} scale={[0.15, 0.17, 0.15]} />
      <MeshStd geometry={geo.sphere} color={hair} position={[0, 1.62, -0.02]} scale={[0.17, 0.13, 0.17]} />
      <MeshStd geometry={geo.sphere} color={hair} position={[0.01, 1.4, -0.12]} scale={[0.07, 0.14, 0.07]} />
      <MeshStd geometry={geo.sphere} color={hair} position={[0.01, 1.24, -0.13]} scale={[0.055, 0.09, 0.055]} />
      <MeshStd geometry={geo.cyl} color={hat} position={[0, 1.72, 0]} scale={[0.18, 0.08, 0.18]} />
      <MeshStd geometry={geo.cyl} color={hat} position={[0, 1.68, 0]} scale={[0.28, 0.028, 0.28]} />
      <MeshStd geometry={geo.sphere} color="#2a1810" position={[0.055, 1.56, 0.12]} scale={[0.024, 0.024, 0.018]} />
      <MeshStd geometry={geo.sphere} color="#2a1810" position={[-0.055, 1.56, 0.12]} scale={[0.024, 0.024, 0.018]} />
      <MeshStd geometry={geo.sphere} color="#c47a6a" position={[0, 1.48, 0.13]} scale={[0.04, 0.02, 0.02]} />

      <group ref={la} position={[0.22, 1.24, 0]}>
        <MeshStd geometry={geo.cyl} color={shirt} position={[0, -0.16, 0]} scale={[0.05, 0.34, 0.05]} />
        <MeshStd geometry={geo.sphere} color={skin} position={[0, -0.34, 0]} scale={[0.05, 0.05, 0.05]} />
      </group>
      <group ref={ra} position={[-0.22, 1.24, 0]}>
        <MeshStd geometry={geo.cyl} color={shirt} position={[0, -0.16, 0]} scale={[0.05, 0.34, 0.05]} />
        <MeshStd geometry={geo.sphere} color={skin} position={[0, -0.34, 0]} scale={[0.05, 0.05, 0.05]} />
      </group>
      <group ref={ll} position={[0.09, 0.88, 0]}>
        <MeshStd geometry={geo.cyl} color={pants} position={[0, -0.2, 0]} scale={[0.065, 0.42, 0.065]} />
        <MeshStd geometry={geo.cyl} color={boot} position={[0, -0.46, 0.03]} scale={[0.07, 0.16, 0.09]} />
      </group>
      <group ref={rl} position={[-0.09, 0.88, 0]}>
        <MeshStd geometry={geo.cyl} color={pants} position={[0, -0.2, 0]} scale={[0.065, 0.42, 0.065]} />
        <MeshStd geometry={geo.cyl} color={boot} position={[0, -0.46, 0.03]} scale={[0.07, 0.16, 0.09]} />
      </group>
    </group>
  );
}

export function PepolaMesh() {
  const root = useRef<THREE.Group>(null);
  const pos = { x: 2.6, z: 5.4 };

  useFrame(() => {
    const g = root.current;
    if (!g) return;
    const y = heightAt(pos.x, pos.z);
    const t = sim.player;
    const dx = t.x - pos.x;
    const dz = t.z - pos.z;
    g.position.set(pos.x, y + Math.sin(sim.time * 1.5) * 0.02, pos.z);
    orientUpright(g, Math.atan2(-dx, -dz));
  });

  const skin = "#c9926a";
  const hair = "#2b2118";
  const shirt = "#4d5c58";
  const pants = "#3c3228";
  const hat = "#c4a36a";

  return (
    <group ref={root}>
      <GroundBlob radius={0.42} />
      <MeshStd geometry={geo.cyl} color={shirt} position={[0, 1.2, 0]} scale={[0.2, 0.46, 0.16]} />
      <MeshStd geometry={geo.cyl} color="#6a4a32" position={[0, 0.96, 0]} scale={[0.21, 0.05, 0.17]} />
      <MeshStd geometry={geo.sphereHi} color={skin} position={[0, 1.64, 0.02]} scale={[0.16, 0.18, 0.16]} />
      <MeshStd geometry={geo.sphere} color={hair} position={[0, 1.72, -0.02]} scale={[0.17, 0.1, 0.16]} />
      <MeshStd geometry={geo.cyl} color={hat} position={[0, 1.84, 0]} scale={[0.19, 0.12, 0.19]} />
      <MeshStd geometry={geo.cyl} color={hat} position={[0, 1.78, 0]} scale={[0.32, 0.032, 0.32]} />
      <MeshStd geometry={geo.sphere} color="#2a1810" position={[0.055, 1.66, 0.13]} scale={[0.024, 0.024, 0.018]} />
      <MeshStd geometry={geo.sphere} color="#2a1810" position={[-0.055, 1.66, 0.13]} scale={[0.024, 0.024, 0.018]} />
      <MeshStd geometry={geo.sphere} color="#7a4a38" position={[0, 1.56, 0.14]} scale={[0.05, 0.03, 0.03]} />
      <MeshStd geometry={geo.cyl} color={shirt} position={[0.24, 1.08, 0]} scale={[0.05, 0.38, 0.05]} />
      <MeshStd geometry={geo.cyl} color={shirt} position={[-0.24, 1.08, 0]} scale={[0.05, 0.38, 0.05]} />
      <MeshStd geometry={geo.cyl} color={pants} position={[0.09, 0.55, 0]} scale={[0.07, 0.5, 0.07]} />
      <MeshStd geometry={geo.cyl} color={pants} position={[-0.09, 0.55, 0]} scale={[0.07, 0.5, 0.07]} />
      <MeshStd geometry={geo.box} color="#2a1f18" position={[0.09, 0.26, 0.05]} scale={[0.12, 0.1, 0.2]} />
      <MeshStd geometry={geo.box} color="#2a1f18" position={[-0.09, 0.26, 0.05]} scale={[0.12, 0.1, 0.2]} />
    </group>
  );
}
