"use client";

import { useLayoutEffect, useRef } from 'react';
import { useGLTF, useAnimations, Float } from '@react-three/drei';

export default function BackgroundAIModel() {
  const group = useRef<any>(null);
  
  // Next.js looks inside the /public folder automatically for '/' paths
  const { scene, animations } = useGLTF('/AI-Animation-3D.glb');
  const { actions, names } = useAnimations(animations, group);

  useLayoutEffect(() => {
    if (names.length > 0) {
      // Play the first animation found in the GLB file
      actions[names[0]]?.reset().fadeIn(0.5).play();
    }
    
    // Optional: cleanup animations on unmount
    return () => {
      actions[names[0]]?.fadeOut(0.5);
    };
  }, [actions, names]);

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <primitive 
        ref={group} 
        object={scene} 
        scale={2.5} 
        position={[0, -1.5, 0]} 
      />
    </Float>
  );
}

// Preload for performance (Next.js will fetch this early)
useGLTF.preload('/AI-Animation-3D.glb');