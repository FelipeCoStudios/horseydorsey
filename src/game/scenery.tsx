import { useMemo } from "react";
import * as THREE from "three";
import { BUSHES, FENCE_POSTS, ROCKS, TREES, WORLD_HALF, heightAt } from "./world";

const trunkMat = new THREE.MeshStandardMaterial({ color: "#4a3728", roughness: 0.9, flatShading: true });
const leafMat = new THREE.MeshStandardMaterial({ color: "#4f7344", roughness: 0.85, flatShading: true });
const leafMat2 = new THREE.MeshStandardMaterial({ color: "#6a8a4e", roughness: 0.85, flatShading: true });
const rockMat = new THREE.MeshStandardMaterial({ color: "#7a7368", roughness: 0.95, flatShading: true });
const bushMat = new THREE.MeshStandardMaterial({ color: "#3f5c34", roughness: 0.88, flatShading: true });
const woodMat = new THREE.MeshStandardMaterial({ color: "#6b4a32", roughness: 0.86, flatShading: true });
const woodDark = new THREE.MeshStandardMaterial({ color: "#4a3122", roughness: 0.88, flatShading: true });
const roofMat = new THREE.MeshStandardMaterial({ color: "#6e3d32", roughness: 0.8, flatShading: true });
const hayMat = new THREE.MeshStandardMaterial({ color: "#c6b06a", roughness: 0.9, flatShading: true });
const waterMat = new THREE.MeshStandardMaterial({
  color: "#6a8f8a",
  roughness: 0.18,
  metalness: 0.12,
  transparent: true,
  opacity: 0.72,
});

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

export function Trees() {
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.18, 0.26, 1.6, 6), []);
  const leafGeo = useMemo(() => new THREE.ConeGeometry(1.1, 2.2, 7), []);

  const trunkRef = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    TREES.forEach((t, i) => {
      const y = heightAt(t.x, t.z);
      dummy.position.set(t.x, y + 0.8 * t.s, t.z);
      dummy.rotation.set(0, t.rot, 0);
      dummy.scale.set(t.s, t.s, t.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  const leafRef = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    TREES.forEach((t, i) => {
      const y = heightAt(t.x, t.z);
      dummy.position.set(t.x, y + 2.15 * t.s, t.z);
      dummy.rotation.set(0, t.rot, 0);
      dummy.scale.set(t.s, t.s, t.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[trunkGeo, trunkMat, TREES.length]} castShadow receiveShadow />
      <instancedMesh ref={leafRef} args={[leafGeo, leafMat, TREES.length]} castShadow />
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

export function Pond() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-22, 0.02, 10]} receiveShadow>
      <circleGeometry args={[5.2, 24]} />
      <primitive object={waterMat} attach="material" />
    </mesh>
  );
}

export function Barn() {
  return (
    <group>
      <mesh position={[0, 2.2, -1]} castShadow receiveShadow>
        <boxGeometry args={[8.4, 4.4, 7.2]} />
        <primitive object={woodMat} attach="material" />
      </mesh>
      <mesh position={[0, 5.1, -1]} rotation={[0, 0, Math.PI / 4.6]} castShadow>
        <boxGeometry args={[6.4, 0.28, 7.6]} />
        <primitive object={roofMat} attach="material" />
      </mesh>
      <mesh position={[0, 5.1, -1]} rotation={[0, 0, -Math.PI / 4.6]} castShadow>
        <boxGeometry args={[6.4, 0.28, 7.6]} />
        <primitive object={roofMat} attach="material" />
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
      <mesh position={[-3.2, 0.45, 3.4]} rotation={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.8, 0.8]} />
        <primitive object={hayMat} attach="material" />
      </mesh>
      <mesh position={[3.4, 0.4, 3.1]} rotation={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[1.1, 0.7, 0.75]} />
        <primitive object={hayMat} attach="material" />
      </mesh>
      <mesh position={[0, 3.7, 2.7]} castShadow>
        <boxGeometry args={[1.6, 0.35, 0.12]} />
        <primitive object={woodDark} attach="material" />
      </mesh>
    </group>
  );
}

export function PaddockFence() {
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const postGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.1, 1.15, 6), []);
  const railGeo = useMemo(() => new THREE.BoxGeometry(2.2, 0.08, 0.06), []);

  return (
    <group>
      <instancedMesh
        args={[postGeo, woodDark, FENCE_POSTS.length]}
        castShadow
        ref={(mesh) => {
          if (!mesh) return;
          FENCE_POSTS.forEach((p, i) => {
            dummy.position.set(p.x, heightAt(p.x, p.z) + 0.55, p.z);
            dummy.rotation.set(0, 0, 0);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
          });
          mesh.instanceMatrix.needsUpdate = true;
        }}
      />
      <instancedMesh
        args={[railGeo, woodMat, FENCE_POSTS.length]}
        ref={(mesh) => {
          if (!mesh) return;
          FENCE_POSTS.forEach((p, i) => {
            const next = FENCE_POSTS[(i + 1) % FENCE_POSTS.length];
            dummy.position.set(p.x, heightAt(p.x, p.z) + 0.7, p.z);
            dummy.lookAt(next.x, heightAt(p.x, p.z) + 0.7, next.z);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
          });
          mesh.instanceMatrix.needsUpdate = true;
        }}
      />
    </group>
  );
}
