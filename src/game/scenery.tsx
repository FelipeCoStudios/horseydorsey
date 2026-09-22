import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  BUSHES,
  FENCE_POSTS,
  FENCE_RAILS,
  GRASS,
  ROCKS,
  TREES,
  WORLD_HALF,
  heightAt,
} from "./world";
import { sim } from "./sim";

const trunkMat = new THREE.MeshStandardMaterial({ color: "#4a3728", roughness: 0.9, flatShading: true });
const leafMat = new THREE.MeshStandardMaterial({ color: "#4f7344", roughness: 0.85, flatShading: true });
const leafMat2 = new THREE.MeshStandardMaterial({ color: "#6a8a4e", roughness: 0.85, flatShading: true });
const rockMat = new THREE.MeshStandardMaterial({ color: "#7a7368", roughness: 0.95, flatShading: true });
const bushMat = new THREE.MeshStandardMaterial({ color: "#3f5c34", roughness: 0.88, flatShading: true });
const woodMat = new THREE.MeshStandardMaterial({ color: "#6b4a32", roughness: 0.86, flatShading: true });
const woodDark = new THREE.MeshStandardMaterial({ color: "#4a3122", roughness: 0.88, flatShading: true });
const roofMat = new THREE.MeshStandardMaterial({ color: "#6e3d32", roughness: 0.8, flatShading: true });
const hayMat = new THREE.MeshStandardMaterial({ color: "#c6b06a", roughness: 0.9, flatShading: true });
const grassMat = new THREE.MeshStandardMaterial({ color: "#5d7a42", roughness: 0.9, flatShading: true });
const cloudMat = new THREE.MeshStandardMaterial({
  color: "#f3efe6",
  roughness: 1,
  flatShading: true,
  transparent: true,
  opacity: 0.88,
});
const waterMat = new THREE.MeshStandardMaterial({
  color: "#6a8f8a",
  roughness: 0.18,
  metalness: 0.12,
  transparent: true,
  opacity: 0.78,
});

const _dir = new THREE.Vector3();
const _axisX = new THREE.Vector3(1, 0, 0);

export function Terrain() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, 72, 72);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const grass = new THREE.Color("#6d8c4f");
    const grass2 = new THREE.Color("#557844");
    const dry = new THREE.Color("#a39462");
    const dirt = new THREE.Color("#7a6246");
    const pad = new THREE.Color("#8b7354");
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = heightAt(x, z);
      pos.setY(i, y);
      const d = Math.hypot(x, z);
      const n = Math.sin(x * 0.4) * Math.cos(z * 0.35);
      if (d < 12) tmp.copy(pad).lerp(dirt, Math.min(1, d / 12));
      else if (y < -0.2) tmp.copy(dirt);
      else tmp.copy(grass).lerp(n > 0.15 ? grass2 : dry, 0.28);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshLambertMaterial vertexColors />
    </mesh>
  );
}

export function SkyDome() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[110, 24, 16]} />
        <meshBasicMaterial color="#c9d6e0" side={THREE.BackSide} />
      </mesh>
      <mesh position={[36, 46, 22]}>
        <sphereGeometry args={[3.4, 12, 12]} />
        <meshBasicMaterial color="#fff3cc" />
      </mesh>
    </group>
  );
}

export function Clouds() {
  const group = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => new THREE.SphereGeometry(1, 8, 6), []);
  const blobs = useMemo(
    () =>
      [
        [12, 18.5, -22, 5.2],
        [-20, 16.8, 10, 4.1],
        [30, 20.5, 14, 5.6],
        [-6, 17.4, -30, 4.4],
        [8, 19.2, 32, 3.6],
        [-28, 18, -8, 4.8],
      ] as const,
    [],
  );

  useFrame(() => {
    if (group.current) group.current.rotation.y = sim.time * 0.012;
  });

  return (
    <group ref={group}>
      <instancedMesh
        args={[geo, cloudMat, blobs.length]}
        frustumCulled={false}
        ref={(mesh) => {
          if (!mesh) return;
          blobs.forEach((c, i) => {
            dummy.position.set(c[0], c[1], c[2]);
            dummy.scale.set(c[3], c[3] * 0.36, c[3] * 0.72);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
          });
          mesh.instanceMatrix.needsUpdate = true;
        }}
      />
    </group>
  );
}

export function Trees() {
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.18, 0.26, 1.6, 6), []);
  const leafGeo = useMemo(() => new THREE.ConeGeometry(1.1, 2.2, 7), []);
  const leafHi = useMemo(() => new THREE.ConeGeometry(0.72, 1.5, 7), []);

  const place = (mesh: THREE.InstancedMesh | null, yOff: number, sMul = 1) => {
    if (!mesh) return;
    TREES.forEach((t, i) => {
      const y = heightAt(t.x, t.z);
      dummy.position.set(t.x, y + yOff * t.s, t.z);
      dummy.rotation.set(0, t.rot, 0);
      dummy.scale.set(t.s * sMul, t.s, t.s * sMul);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  return (
    <group>
      <instancedMesh
        args={[trunkGeo, trunkMat, TREES.length]}
        castShadow
        receiveShadow
        ref={(m) => place(m, 0.8)}
      />
      <instancedMesh args={[leafGeo, leafMat, TREES.length]} castShadow ref={(m) => place(m, 2.15)} />
      <instancedMesh args={[leafHi, leafMat2, TREES.length]} castShadow ref={(m) => place(m, 3.05, 0.92)} />
    </group>
  );
}

export function RocksAndBushes() {
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const rockGeo = useMemo(() => new THREE.DodecahedronGeometry(0.55, 0), []);
  const bushGeo = useMemo(() => new THREE.SphereGeometry(0.55, 6, 5), []);
  const extraLeaf = useMemo(() => new THREE.SphereGeometry(0.7, 6, 5), []);

  return (
    <group>
      <instancedMesh
        args={[rockGeo, rockMat, ROCKS.length]}
        castShadow
        receiveShadow
        ref={(mesh) => {
          if (!mesh) return;
          ROCKS.forEach((t, i) => {
            dummy.position.set(t.x, heightAt(t.x, t.z) + 0.15 * t.s, t.z);
            dummy.rotation.set(0.2, t.rot, 0.1);
            dummy.scale.set(t.s * 1.2, t.s * 0.7, t.s);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
          });
          mesh.instanceMatrix.needsUpdate = true;
        }}
      />
      <instancedMesh
        args={[bushGeo, bushMat, BUSHES.length]}
        castShadow
        ref={(mesh) => {
          if (!mesh) return;
          BUSHES.forEach((t, i) => {
            dummy.position.set(t.x, heightAt(t.x, t.z) + 0.35 * t.s, t.z);
            dummy.rotation.set(0, t.rot, 0);
            dummy.scale.set(t.s, t.s * 0.8, t.s);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
          });
          mesh.instanceMatrix.needsUpdate = true;
        }}
      />
      <instancedMesh
        args={[extraLeaf, leafMat2, 12]}
        ref={(mesh) => {
          if (!mesh) return;
          TREES.slice(0, 12).forEach((t, i) => {
            dummy.position.set(t.x + 0.4, heightAt(t.x, t.z) + 2.4 * t.s, t.z - 0.2);
            dummy.scale.setScalar(0.55 * t.s);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
          });
          mesh.instanceMatrix.needsUpdate = true;
        }}
      />
    </group>
  );
}

export function GrassTufts() {
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => new THREE.ConeGeometry(0.18, 0.55, 5), []);
  return (
    <instancedMesh
      args={[geo, grassMat, GRASS.length]}
      ref={(mesh) => {
        if (!mesh) return;
        GRASS.forEach((t, i) => {
          dummy.position.set(t.x, heightAt(t.x, t.z) + 0.22 * t.s, t.z);
          dummy.rotation.set(0, t.rot, 0);
          dummy.scale.set(t.s, t.s, t.s);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
      }}
    />
  );
}

export function Pond() {
  const y = heightAt(-22, 10) + 0.38;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-22, y, 10]} receiveShadow>
        <circleGeometry args={[5.2, 28]} />
        <primitive object={waterMat} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-22, y - 0.04, 10]}>
        <ringGeometry args={[4.6, 5.5, 28]} />
        <meshLambertMaterial color="#7a6246" />
      </mesh>
    </group>
  );
}

export function Barn() {
  return (
    <group>
      <mesh position={[0, 2.2, -1]} castShadow receiveShadow>
        <boxGeometry args={[8.4, 4.4, 7.2]} />
        <primitive object={woodMat} attach="material" />
      </mesh>
      <mesh position={[-2.35, 5.42, -1]} rotation={[0, 0, Math.PI / 5.1]} castShadow>
        <boxGeometry args={[5.6, 0.26, 7.8]} />
        <primitive object={roofMat} attach="material" />
      </mesh>
      <mesh position={[2.35, 5.42, -1]} rotation={[0, 0, -Math.PI / 5.1]} castShadow>
        <boxGeometry args={[5.6, 0.26, 7.8]} />
        <primitive object={roofMat} attach="material" />
      </mesh>
      <mesh position={[0, 6.48, -1]} castShadow>
        <boxGeometry args={[0.55, 0.28, 8]} />
        <primitive object={woodDark} attach="material" />
      </mesh>
      <mesh position={[0, 1.5, 2.55]} receiveShadow>
        <boxGeometry args={[2.6, 3.1, 0.2]} />
        <primitive object={woodDark} attach="material" />
      </mesh>
      <mesh position={[-1.5, 1.5, 2.62]} castShadow>
        <boxGeometry args={[0.28, 3.1, 0.18]} />
        <primitive object={woodDark} attach="material" />
      </mesh>
      <mesh position={[1.5, 1.5, 2.62]} castShadow>
        <boxGeometry args={[0.28, 3.1, 0.18]} />
        <primitive object={woodDark} attach="material" />
      </mesh>
      <mesh position={[0, 3.55, 2.66]} castShadow>
        <boxGeometry args={[1.1, 1.1, 0.12]} />
        <meshStandardMaterial color="#2a2118" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-3.2, 0.45, 3.4]} rotation={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.8, 0.8]} />
        <primitive object={hayMat} attach="material" />
      </mesh>
      <mesh position={[3.4, 0.4, 3.1]} rotation={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[1.1, 0.7, 0.75]} />
        <primitive object={hayMat} attach="material" />
      </mesh>
      <mesh position={[0, 3.95, 2.72]} castShadow>
        <boxGeometry args={[1.8, 0.32, 0.12]} />
        <primitive object={woodDark} attach="material" />
      </mesh>
    </group>
  );
}

export function PaddockFence() {
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const postGeo = useMemo(() => new THREE.CylinderGeometry(0.09, 0.11, 1.22, 6), []);
  const railGeo = useMemo(() => new THREE.BoxGeometry(1, 0.07, 0.055), []);

  const placeRails = (mesh: THREE.InstancedMesh | null, yOff: number) => {
    if (!mesh) return;
    FENCE_RAILS.forEach((r, i) => {
      const y0 = heightAt(r.ax, r.az) + yOff;
      const y1 = heightAt(r.bx, r.bz) + yOff;
      const dx = r.bx - r.ax;
      const dz = r.bz - r.az;
      const dist = Math.hypot(dx, dz) || 1;
      dummy.position.set((r.ax + r.bx) / 2, (y0 + y1) / 2, (r.az + r.bz) / 2);
      _dir.set(dx, 0, dz).normalize();
      dummy.quaternion.setFromUnitVectors(_axisX, _dir);
      dummy.scale.set(dist, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  return (
    <group>
      <instancedMesh
        args={[postGeo, woodDark, FENCE_POSTS.length]}
        castShadow
        ref={(mesh) => {
          if (!mesh) return;
          FENCE_POSTS.forEach((p, i) => {
            dummy.position.set(p.x, heightAt(p.x, p.z) + 0.58, p.z);
            dummy.quaternion.identity();
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
          });
          mesh.instanceMatrix.needsUpdate = true;
        }}
      />
      <instancedMesh args={[railGeo, woodMat, FENCE_RAILS.length]} ref={(m) => placeRails(m, 0.92)} />
      <instancedMesh args={[railGeo, woodMat, FENCE_RAILS.length]} ref={(m) => placeRails(m, 0.52)} />
    </group>
  );
}

export function GroundBlob({ radius = 0.55 }: { radius?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} renderOrder={1}>
      <circleGeometry args={[radius, 14]} />
      <meshBasicMaterial color="#1a1612" transparent opacity={0.22} depthWrite={false} />
    </mesh>
  );
}
