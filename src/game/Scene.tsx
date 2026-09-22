import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HORSES } from "./data";
import { HorseMesh, PepolaMesh, ValentinaMesh } from "./characters";
import {
  Barn,
  Clouds,
  GrassTufts,
  PaddockFence,
  Pond,
  RocksAndBushes,
  SkyDome,
  Terrain,
  Trees,
} from "./scenery";
import { installControlsProbe, sim, tick } from "./sim";
import { useGame } from "./store";
import { heightAt } from "./world";

const _desired = new THREE.Vector3();
const _look = new THREE.Vector3();
const _cam = new THREE.Vector3(0, 9, 22);

function CameraRig() {
  const { camera } = useThree();
  const phase = useGame((s) => s.phase);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    if (phase === "title") {
      const t = sim.time * 0.12;
      camera.position.set(Math.sin(t) * 22, 8.8, Math.cos(t) * 22);
      camera.lookAt(0, 1.8, 0);
      return;
    }
    const p = sim.player;
    const fx = -Math.sin(p.yaw);
    const fz = -Math.cos(p.yaw);
    const py = heightAt(p.x, p.z);
    _desired.set(p.x + fx * -8.4, py + 4.15, p.z + fz * -8.4);
    const k = 1 - Math.exp(-4.6 * dt);
    _cam.x += (_desired.x - _cam.x) * k;
    _cam.y += (_desired.y - _cam.y) * k;
    _cam.z += (_desired.z - _cam.z) * k;
    camera.position.copy(_cam);
    _look.set(p.x + fx * 1.6, py + 1.45, p.z + fz * 1.6);
    camera.lookAt(_look);
  });
  return null;
}

function Loop() {
  const started = useRef(false);
  useFrame((_, delta) => {
    if (!started.current) {
      started.current = true;
      installControlsProbe();
    }
    tick(delta);
  });
  return null;
}

function Horses() {
  return (
    <>
      {HORSES.map((def) => (
        <HorseMesh key={def.id} def={def} />
      ))}
    </>
  );
}

function Particles() {
  const meshes = useRef<THREE.Mesh[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    sim.particles.forEach((p, i) => {
      const m = meshes.current[i];
      if (!m) return;
      dummy.position.set(p.x, p.y, p.z);
      const s = p.size * Math.max(0.1, p.life / 0.8);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      m.visible = true;
      m.position.copy(dummy.position);
      m.scale.copy(dummy.scale);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.color.set(p.color);
      mat.opacity = Math.max(0, p.life);
    });
    for (let i = sim.particles.length; i < meshes.current.length; i++) {
      if (meshes.current[i]) meshes.current[i]!.visible = false;
    }
  });
  return (
    <group>
      {Array.from({ length: 36 }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshes.current[i] = el;
          }}
          visible={false}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial transparent opacity={1} />
        </mesh>
      ))}
    </group>
  );
}

function Lights() {
  return (
    <>
      <hemisphereLight args={["#dce6f0", "#6d5a44", 0.78]} />
      <directionalLight
        castShadow
        position={[26, 34, 16]}
        intensity={1.55}
        color="#fff3dc"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={2}
        shadow-camera-far={90}
        shadow-camera-left={-38}
        shadow-camera-right={38}
        shadow-camera-top={38}
        shadow-camera-bottom={-38}
        shadow-bias={-0.0004}
      />
      <ambientLight intensity={0.2} color="#c9c0b0" />
    </>
  );
}


function RaceCourse() {
  const phase = useGame((s) => s.phase); const checkpoint = useGame((s) => s.raceCheckpoint);
  if (phase !== "race") return null;
  const points = [[0,16],[16,16],[16,-16],[-16,-16],[-16,16],[0,16]] as const;
  const hurdles = [{x:8,z:16,yaw:0},{x:16,z:-4,yaw:Math.PI/2},{x:-4,z:-16,yaw:0}];
  return <group>{points.slice(1).map(([x,z],i)=><mesh key={i} position={[x,heightAt(x,z)+.08,z]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[i+1===checkpoint?2.7:2.2,i+1===checkpoint?3.05:2.45,24]}/><meshBasicMaterial transparent opacity={i+1===checkpoint?.8:.22} color={i+1===checkpoint?"#d7b56d":"#ffffff"}/></mesh>)}{hurdles.map((h,i)=><group key={i} position={[h.x,heightAt(h.x,h.z)+.65,h.z]} rotation={[0,h.yaw,0]}><mesh><boxGeometry args={[2.8,.14,.12]}/><meshStandardMaterial color="#f0e3c7"/></mesh><mesh position={[-1.2,-.35,0]}><boxGeometry args={[.12,.7,.12]}/><meshStandardMaterial color="#6b4c38"/></mesh><mesh position={[1.2,-.35,0]}><boxGeometry args={[.12,.7,.12]}/><meshStandardMaterial color="#6b4c38"/></mesh></group>)}</group>;
}

export function GameCanvas() {
  return (
    <Canvas
      className="h-full w-full touch-none"
      shadows
      dpr={[1, 1.75]}
      camera={{ fov: 48, near: 0.12, far: 160, position: [0, 9, 22] }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFShadowMap;
      }}
    >
      <color attach="background" args={["#c9d6e0"]} />
      <fog attach="fog" args={["#c7d0c6", 36, 92]} />
      <SkyDome />
      <Clouds />
      <Lights />
      <Loop />
      <CameraRig />
      <Terrain />
      <GrassTufts />
      <Pond />
      <Trees />
      <RocksAndBushes />
      <Barn />
      <PaddockFence />
      <RaceCourse />
      <ValentinaMesh />
      <PepolaMesh />
      <Horses />
      <Particles />
    </Canvas>
  );
}
