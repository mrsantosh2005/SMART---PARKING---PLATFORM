import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Float, 
  Box, 
  Sphere,
  Cylinder,
  Torus,
  Plane,
  Stars
} from '@react-three/drei';
import * as THREE from 'three';

// Rotating Car Model Component (Simplified)
function RotatingCar({ position, color, speed = 0.01 }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed;
      meshRef.current.position.x = Math.sin(Date.now() * 0.001) * 1.5;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Car Body */}
      <Box args={[1.2, 0.4, 0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Box>
      {/* Car Roof */}
      <Box args={[0.6, 0.3, 0.6]} position={[0, 0.35, 0]}>
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </Box>
      {/* Windshield */}
      <Box args={[0.5, 0.2, 0.1]} position={[0, 0.25, 0.35]}>
        <meshStandardMaterial color="#87CEEB" metalness={0.9} roughness={0.1} />
      </Box>
      {/* Wheels */}
      <Sphere args={[0.15, 32, 32]} position={[-0.5, -0.2, 0.5]}>
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
      </Sphere>
      <Sphere args={[0.15, 32, 32]} position={[0.5, -0.2, 0.5]}>
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
      </Sphere>
      <Sphere args={[0.15, 32, 32]} position={[-0.5, -0.2, -0.5]}>
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
      </Sphere>
      <Sphere args={[0.15, 32, 32]} position={[0.5, -0.2, -0.5]}>
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
      </Sphere>
      {/* Headlights */}
      <Box args={[0.1, 0.1, 0.1]} position={[0.6, 0.1, 0.4]}>
        <meshStandardMaterial color="#ffaa00" emissive="#ff4400" emissiveIntensity={0.8} />
      </Box>
      <Box args={[0.1, 0.1, 0.1]} position={[0.6, 0.1, -0.4]}>
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </Box>
    </group>
  );
}

// Floating Parking Sign (Simplified - No Text)
function ParkingSign({ position }) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Pole */}
      <Cylinder args={[0.1, 0.15, 2, 8]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#c0c0c0" metalness={0.7} roughness={0.3} />
      </Cylinder>
      {/* Sign Board */}
      <Box args={[1.2, 0.6, 0.1]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#2563eb" metalness={0.3} roughness={0.5} />
      </Box>
      {/* P Letter (Using Boxes instead of Text) */}
      <Box args={[0.15, 0.4, 0.05]} position={[-0.3, 0.15, 0.06]}>
        <meshStandardMaterial color="white" />
      </Box>
      <Box args={[0.2, 0.15, 0.05]} position={[-0.15, 0.3, 0.06]}>
        <meshStandardMaterial color="white" />
      </Box>
      <Box args={[0.15, 0.15, 0.05]} position={[-0.15, 0.15, 0.06]}>
        <meshStandardMaterial color="white" />
      </Box>
    </group>
  );
}

// Rotating Parking Slot
function ParkingSlot({ position, rotation }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.003;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Base */}
      <Box args={[1.5, 0.05, 2.5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4ade80" transparent opacity={0.6} emissive="#22c55e" emissiveIntensity={0.2} />
      </Box>
      {/* Slot lines */}
      <Box args={[1.4, 0.1, 0.05]} position={[0, 0.05, 1.2]}>
        <meshStandardMaterial color="#fff" />
      </Box>
      <Box args={[1.4, 0.1, 0.05]} position={[0, 0.05, -1.2]}>
        <meshStandardMaterial color="#fff" />
      </Box>
      <Box args={[0.05, 0.1, 2.4]} position={[0.7, 0.05, 0]}>
        <meshStandardMaterial color="#fff" />
      </Box>
      <Box args={[0.05, 0.1, 2.4]} position={[-0.7, 0.05, 0]}>
        <meshStandardMaterial color="#fff" />
      </Box>
    </group>
  );
}

// Floating Particles
function FloatingParticles({ count = 200 }) {
  const particlesRef = useRef();
  
  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.002;
      particlesRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
    }
  });

  const particles = [];
  for (let i = 0; i < count; i++) {
    const position = [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 15 - 5
    ];
    particles.push(
      <Sphere key={i} args={[0.05, 8, 8]} position={position}>
        <meshStandardMaterial 
          color={`hsl(${Math.random() * 60 + 200}, 70%, 60%)`} 
          emissive={`hsl(${Math.random() * 60 + 200}, 70%, 50%)`}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </Sphere>
    );
  }

  return <group ref={particlesRef}>{particles}</group>;
}

// Rotating Platform
function RotatingPlatform() {
  const platformRef = useRef();

  useFrame(() => {
    if (platformRef.current) {
      platformRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={platformRef}>
      <Cylinder args={[6, 6, 0.2, 32]} position={[0, -2, 0]}>
        <meshStandardMaterial color="#1e3a8a" metalness={0.8} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[6.2, 6.2, 0.1, 32]} position={[0, -2.1, 0]}>
        <meshStandardMaterial color="#2563eb" metalness={0.9} roughness={0.2} />
      </Cylinder>
      {/* Glowing ring */}
      <Torus args={[6, 0.1, 32, 200]} position={[0, -1.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
      </Torus>
    </group>
  );
}

// Light Beams
function LightBeams() {
  const beamsRef = useRef();
  
  useFrame(() => {
    if (beamsRef.current) {
      beamsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={beamsRef}>
      {[...Array(8)].map((_, i) => (
        <Cylinder
          key={i}
          args={[0.05, 0.2, 3, 8]}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 4,
            -1,
            Math.sin((i / 8) * Math.PI * 2) * 4
          ]}
          rotation={[0, (i / 8) * Math.PI * 2, 0]}
        >
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} transparent opacity={0.6} />
        </Cylinder>
      ))}
    </group>
  );
}

// Main 3D Scene
export function ThreeDBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas
        camera={{ position: [0, 3, 10], fov: 50 }}
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)' }}
      >
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#3b82f6" />
        <spotLight position={[5, 5, 5]} angle={0.3} intensity={0.8} castShadow />
        
        {/* Main Elements */}
        <RotatingPlatform />
        <LightBeams />
        
        {/* Cars */}
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <RotatingCar position={[-2.5, -1, 2.5]} color="#ef4444" speed={0.01} />
        </Float>
        
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
          <RotatingCar position={[2.5, -1, -1.5]} color="#3b82f6" speed={0.015} />
        </Float>
        
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
          <RotatingCar position={[0, -1, -3.5]} color="#10b981" speed={0.008} />
        </Float>
        
        {/* Parking Signs */}
        <ParkingSign position={[-3.5, -0.5, 3.5]} />
        <ParkingSign position={[3.5, -0.5, 3.5]} />
        <ParkingSign position={[0, -0.5, 4.5]} />
        <ParkingSign position={[-4, -0.5, -2]} />
        <ParkingSign position={[4, -0.5, -2]} />
        
        {/* Parking Slots */}
        <ParkingSlot position={[-2.5, -1.8, 1.5]} rotation={[0, 0, 0]} />
        <ParkingSlot position={[0, -1.8, 1.5]} rotation={[0, 0, 0]} />
        <ParkingSlot position={[2.5, -1.8, 1.5]} rotation={[0, 0, 0]} />
        <ParkingSlot position={[-2.5, -1.8, -1]} rotation={[0, Math.PI / 4, 0]} />
        <ParkingSlot position={[2.5, -1.8, -1]} rotation={[0, -Math.PI / 4, 0]} />
        <ParkingSlot position={[0, -1.8, -2.5]} rotation={[0, 0, 0]} />
        
        {/* Stars Background */}
        <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        
        {/* Particles */}
        <FloatingParticles count={300} />
        
        {/* Environment */}
        <Environment preset="city" />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}