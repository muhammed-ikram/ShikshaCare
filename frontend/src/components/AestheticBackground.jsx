import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = ({ count = 40 }) => {
    const points = useMemo(() => {
        const p = new Array(count).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10
            ],
            speed: Math.random() * 0.01,
            size: Math.random() * 0.5 + 0.1
        }));
        return p;
    }, [count]);

    return (
        <group>
            {points.map((point, i) => (
                <Float
                    key={i}
                    speed={2}
                    rotationIntensity={2}
                    floatIntensity={2}
                    position={point.position}
                >
                    <Sphere args={[point.size, 16, 16]}>
                        <meshStandardMaterial
                            color={i % 2 === 0 ? "#6366f1" : "#a855f7"}
                            emissive={i % 2 === 0 ? "#4338ca" : "#7e22ce"}
                            emissiveIntensity={0.5}
                            transparent
                            opacity={0.3}
                        />
                    </Sphere>
                </Float>
            ))}
        </group>
    );
};

const Blob = ({ position, color, speed, distort }) => {
    const mesh = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mesh.current.position.y += Math.sin(t * speed) * 0.002;
    });

    return (
        <mesh ref={mesh} position={position}>
            <Sphere args={[1, 64, 64]}>
                <MeshDistortMaterial
                    color={color}
                    speed={speed}
                    distort={distort}
                    radius={1}
                />
            </Sphere>
        </mesh>
    );
};

const AestheticBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 bg-slate-50">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, -10, -10]} color="#a855f7" intensity={1} />

                <ParticleField count={30} />

                <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
                    <Blob
                        position={[-4, 2, -2]}
                        color="#818cf8"
                        speed={2}
                        distort={0.4}
                    />
                </Float>

                <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                    <Blob
                        position={[5, -3, -1]}
                        color="#c084fc"
                        speed={1.5}
                        distort={0.5}
                    />
                </Float>

                <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
                    <Blob
                        position={[0, 0, -5]}
                        color="#f472b6"
                        speed={1}
                        distort={0.3}
                    />
                </Float>
            </Canvas>

            {/* Overlay for additional texture */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[100px]" />
        </div>
    );
};

export default AestheticBackground;
