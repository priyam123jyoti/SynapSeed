"use client";

import { useLayoutEffect, useRef, memo } from 'react';
import { useGLTF, useAnimations, Float } from '@react-three/drei';
import * as THREE from 'three';

const BackgroundAIModel = () => {
  const group = useRef<THREE.Group>(null);
  
  // 1. Load the model
  const { scene, animations } = useGLTF('/AI-Animation-3D.glb');
  const { actions, names } = useAnimations(animations, group);

  // 2. Optimized Animation Loop
  useLayoutEffect(() => {
    if (names.length > 0) {
      const action = actions[names[0]];
      action?.reset().fadeIn(0.5).play();
      
      // Keep the animation running even if the tab is inactive for a bit
      action!.paused = false; 
    }
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
        // Optimization: Don't render if the camera isn't looking at it
        frustumCulled={true}
      />
    </Float>
  );
};

// PREVENT RERENDERS: memo is the secret to smoothness
export default memo(BackgroundAIModel);

useGLTF.preload('/AI-Animation-3D.glb');