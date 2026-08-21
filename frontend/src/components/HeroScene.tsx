import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Sculpture() {
    const group = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        const g = group.current;
        if (!g) return;
        g.rotation.y += delta * 0.07;
        g.rotation.x = THREE.MathUtils.lerp(
            g.rotation.x,
            state.pointer.y * 0.25 + 0.2,
            0.04,
        );
        g.rotation.z = THREE.MathUtils.lerp(
            g.rotation.z,
            state.pointer.x * 0.12,
            0.04,
        );
        g.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.18;
    });

    return (
        <group ref={group} position={[1.4, 0, 0]}>
            <mesh>
                <torusKnotGeometry args={[1.5, 0.42, 260, 36]} />
                <meshStandardMaterial
                    color="#101010"
                    metalness={0.95}
                    roughness={0.22}
                />
            </mesh>
            <mesh scale={1.002}>
                <torusKnotGeometry args={[1.5, 0.42, 120, 18]} />
                <meshBasicMaterial
                    color="#ffffff"
                    wireframe
                    transparent
                    opacity={0.045}
                />
            </mesh>
            <mesh position={[-3.6, -1.4, -2]} rotation={[0.6, 0.2, 0.4]}>
                <icosahedronGeometry args={[0.7, 0]} />
                <meshStandardMaterial
                    color="#0c0c0c"
                    metalness={0.9}
                    roughness={0.3}
                />
            </mesh>
            <mesh position={[-2.4, 1.8, -3]} rotation={[0.2, 0.8, 0]}>
                <octahedronGeometry args={[0.45, 0]} />
                <meshBasicMaterial
                    color="#ffffff"
                    wireframe
                    transparent
                    opacity={0.12}
                />
            </mesh>
        </group>
    );
}

export function HeroScene() {
    return (
        <div
            aria-hidden
            className="absolute inset-0 z-0 hidden md:block"
            data-testid="hero-3d-scene"
        >
            <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 6.5], fov: 42 }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.12} />
                <directionalLight position={[5, 6, 4]} intensity={2.4} />
                <directionalLight position={[-6, -3, -2]} intensity={0.5} />
                <pointLight position={[0, 3, 3]} intensity={6} distance={12} />
                <fog attach="fog" args={["#050505", 7, 13]} />
                <Sculpture />
            </Canvas>
        </div>
    );
}
