"use client";
// Bola partikel 3D yang "bernapas" dan bereaksi terhadap mouse / sentuhan.
// Setiap titik ditaruh di permukaan bola (Fibonacci sphere), lalu digeser di vertex shader.
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uPointer;   // posisi pointer di ruang 3D
  uniform float uSize;
  attribute float aRandom;
  varying float vMix;
  varying float vGlow;

  void main() {
    vec3 p = position;
    // gelombang lembut di permukaan bola
    float wave = sin(p.y * 3.0 + uTime * 1.2) * 0.06 + sin(p.x * 4.0 + uTime) * 0.04;
    p += normalize(p) * (wave + aRandom * 0.05);

    vec4 world = modelMatrix * vec4(p, 1.0);
    // titik di dekat pointer terdorong keluar
    float d = distance(world.xyz, uPointer);
    float push = smoothstep(0.9, 0.0, d);
    world.xyz += normalize(world.xyz) * push * 0.35;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (1.0 + aRandom + push * 2.0) / -mv.z;

    vMix = (p.y + 1.0) * 0.5;
    vGlow = push;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying float vMix;
  varying float vGlow;

  void main() {
    // titik bulat dengan tepi lembut
    float r = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, r);
    vec3 color = mix(uColorA, uColorB, vMix);
    color = mix(color, uColorC, vGlow);
    gl_FragColor = vec4(color, alpha);
  }
`;

function Particles({ count, light }: { count: number; light: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const { pointer, viewport } = useThree();

  // Posisi titik dihitung sekali saja
  const [positions, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pos.set([Math.cos(theta) * radius, y, Math.sin(theta) * radius], i * 3);
      rnd[i] = Math.random();
    }
    return [pos, rnd];
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector3(99, 99, 99) },
      uSize: { value: count > 3000 ? 9 : 18 },
      uColorA: { value: new THREE.Color("#8B5CF6") },
      uColorB: { value: new THREE.Color("#22D3EE") },
      uColorC: { value: new THREE.Color("#F472B6") },
    }),
    [count],
  );

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts) return;
    uniforms.uTime.value = state.clock.elapsedTime;
    // Bola berputar pelan, dan miring mengikuti pointer
    pts.rotation.y += delta * 0.12;
    pts.rotation.x = THREE.MathUtils.lerp(pts.rotation.x, pointer.y * 0.4, 0.05);
    pts.rotation.z = THREE.MathUtils.lerp(pts.rotation.z, -pointer.x * 0.2, 0.05);
    // Pointer (layar) → titik di depan bola (ruang 3D)
    uniforms.uPointer.value.lerp(
      new THREE.Vector3((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0.8),
      0.15,
    );
  });

  return (
    // Di layar sempit (HP) bola diperkecil agar muat
    <points ref={ref} scale={Math.min(1.6, viewport.width * 0.42)}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleSphere({ quality, light }: { quality: "high" | "low"; light: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={quality === "high" ? [1, 2] : [1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <Particles count={quality === "high" ? 6000 : 2500} light={light} />
    </Canvas>
  );
}
