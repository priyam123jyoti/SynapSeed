"use client";

import { Suspense, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Preload } from '@react-three/drei';
import BackgroundAIModel from './BackgroundAIModel';

const Gateway3D = () => {
  return (
    <div className="fixed inset-0 z-0 bg-[#020617]">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]} // Performance optimization for high-res screens
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#10b981" />
        <Suspense fallback={null}>
          <BackgroundAIModel />
          <Environment preset="city" />
          <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
          <Preload all />
        </Suspense>
      </Canvas>
      {/* Optimized Gradient Overlay - uses transform-z to stay on top of WebGL */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#020617]/40 via-transparent to-[#020617] pointer-events-none transform-gpu" />
    </div>
  );
};

export default memo(Gateway3D);