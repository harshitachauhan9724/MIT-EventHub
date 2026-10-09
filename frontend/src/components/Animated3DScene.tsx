import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, ContactShadows } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';

function FloatingBlob({
  position,
  color,
  scale,
  speed,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
}) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * (0.18 * speed);
    ref.current.rotation.y = state.clock.elapsedTime * (0.22 * speed) + position[0];
    ref.current.position.x += Math.sin(state.clock.elapsedTime * speed + position[1]) * 0.003;
    ref.current.position.y += Math.cos(state.clock.elapsedTime * speed + position[2]) * 0.0025;
  });

  return (
    <Float speed={speed} rotationIntensity={0.7} floatIntensity={1.3}>
      <group ref={ref} position={position} scale={scale}>
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[1.15, 2]} />
          <MeshDistortMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.28}
            roughness={0.28}
            metalness={0.28}
            distort={0.4}
            speed={speed}
            transparent
            opacity={0.86}
          />
        </mesh>
      </group>
    </Float>
  );
}

function SceneContent() {
  const group = useRef<Group>(null);

  const blobs = useMemo(
    () => [
      { position: [-2.4, 0.7, 0.5] as [number, number, number], color: '#DA7B93', scale: 1.2, speed: 1.2 },
      { position: [2.1, 1.4, -0.8] as [number, number, number], color: '#376E6F', scale: 1.5, speed: 1.6 },
      { position: [0.2, -1.6, 0.3] as [number, number, number], color: '#F5F1EE', scale: 1.1, speed: 1.1 },
      { position: [-0.8, 2.1, -0.2] as [number, number, number], color: '#2E151B', scale: 0.9, speed: 1.4 },
    ],
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    const parallaxX = state.pointer.x * 0.8;
    const parallaxY = state.pointer.y * 0.6;
    group.current.rotation.y = parallaxX * 0.6;
    group.current.rotation.x = parallaxY * 0.5;
    group.current.position.x = parallaxX * 0.8;
    group.current.position.y = parallaxY * 0.5;
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 3, 4]} intensity={1.6} color="#F5F1EE" />
      <pointLight position={[-3, -2, 2]} intensity={18} color="#DA7B93" />
      <pointLight position={[3, 1, 2]} intensity={14} color="#376E6F" />
      {blobs.map((blob) => (
        <FloatingBlob key={`${blob.color}-${blob.position.join('-')}`} {...blob} />
      ))}
      <mesh rotation-x={-Math.PI / 2} position={[0, -2.6, 0]} receiveShadow>
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial color="#203846" transparent opacity={0.72} />
      </mesh>
      <ContactShadows position={[0, -2.45, 0]} opacity={0.75} scale={7} blur={2.5} far={4.5} />
    </group>
  );
}

export default function Animated3DScene() {
  return (
    <div className="hero-three-scene" aria-label="3D floating abstract background">
      <Canvas camera={{ position: [0, 0, 8], fov: 42 }} dpr={[1, 1.75]}>
        <SceneContent />
      </Canvas>
    </div>
  );
}
