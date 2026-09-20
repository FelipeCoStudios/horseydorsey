import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HORSES } from "./data";
import { HorseMesh, PepolaMesh, ValentinaMesh } from "./characters";
import { Barn, PaddockFence, Pond, RocksAndBushes, Terrain, Trees } from "./scenery";
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
      camera.position.set(Math.sin(t) * 20, 8.4, Math.cos(t) * 20);
      camera.lookAt(0, 1.4, 0);
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
      <hemisphereLight args={["#d7e2ee", "#6d5a44", 0.72]} />
      <directionalLight
        castShadow
        position={[26, 34, 16]}
        intensity={1.45}
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
      <ambientLight intensity={0.18} color="#c9c0b0" />
    </>
  );
}

export function GameCanvas() {
  return (
    <Canvas
      className="h-full w-full touch-none"
      shadows
      dpr={[1, 1.75]}
      camera={{ fov: 48, near: 0.12, far: 140, position: [0, 9, 22] }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <color attach="background" args={["#c5d0c4"]} />
      <fog attach="fog" args={["#c5d0c4", 32, 78]} />
      <Lights />
      <Loop />
      <CameraRig />
      <Terrain />
      <Pond />
      <Trees />
      <RocksAndBushes />
      <Barn />
      <PaddockFence />
      <ValentinaMesh />
      <PepolaMesh />
      <Horses />
      <Particles />
    </Canvas>
  );
}
