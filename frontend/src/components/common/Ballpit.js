import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Ballpit = ({ className = '', followCursor = true, colors = [0x3b82f6, 0x8b5cf6, 0xec4899] }) => {
  const canvasRef = useRef(null);
  const spheresInstanceRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create Ballpit Instance
    const createBallpit = (canvasEl, options = {}) => {
      const config = {
        count: 150,
        colors: options.colors || [0x3b82f6, 0x8b5cf6, 0xec4899],
        ambientColor: 0xffffff,
        ambientIntensity: 0.5,
        lightIntensity: 100,
        materialParams: {
          metalness: 0.3,
          roughness: 0.4,
          clearcoat: 0.8,
          clearcoatRoughness: 0.2
        },
        minSize: 0.3,
        maxSize: 0.8,
        size0: 1,
        gravity: 0.8,
        friction: 0.99,
        wallBounce: 0.95,
        maxVelocity: 0.2,
        maxX: 6,
        maxY: 4,
        maxZ: 3,
        controlSphere0: false,
        followCursor: options.followCursor !== false
      };

      // Three.js Setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.set(0, 0, 15);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true });
      renderer.setSize(canvasEl.parentElement?.clientWidth || window.innerWidth, canvasEl.parentElement?.clientHeight || window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      // Colors setup
      const colorsList = config.colors.map(c => new THREE.Color(c));
      
      // Create spheres
      const spheres = [];
      const positions = [];
      const velocities = [];
      const sizes = [];

      // Initialize spheres
      for (let i = 0; i < config.count; i++) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshStandardMaterial({
          color: colorsList[i % colorsList.length],
          metalness: config.materialParams.metalness,
          roughness: config.materialParams.roughness,
          emissive: colorsList[i % colorsList.length],
          emissiveIntensity: 0.1
        });
        const sphere = new THREE.Mesh(geometry, material);
        
        // Random position
        const pos = {
          x: (Math.random() - 0.5) * config.maxX * 2,
          y: (Math.random() - 0.5) * config.maxY * 1.5,
          z: (Math.random() - 0.5) * config.maxZ * 2
        };
        sphere.position.set(pos.x, pos.y, pos.z);
        
        const size = config.minSize + Math.random() * (config.maxSize - config.minSize);
        sphere.scale.set(size, size, size);
        
        scene.add(sphere);
        
        spheres.push(sphere);
        positions.push(pos);
        velocities.push({
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
          z: (Math.random() - 0.5) * 2
        });
        sizes.push(size);
      }

      // Lights
      const ambientLight = new THREE.AmbientLight(config.ambientColor, config.ambientIntensity);
      scene.add(ambientLight);
      
      const mainLight = new THREE.DirectionalLight(0xffffff, 1);
      mainLight.position.set(5, 10, 7);
      scene.add(mainLight);
      
      const backLight = new THREE.PointLight(colorsList[0], 0.5);
      backLight.position.set(-3, 2, -5);
      scene.add(backLight);
      
      const fillLight = new THREE.PointLight(colorsList[1], 0.3);
      fillLight.position.set(4, 3, 2);
      scene.add(fillLight);

      // Animation variables
      let mouseX = 0, mouseY = 0;
      let targetRotationX = 0, targetRotationY = 0;
      
      // Mouse move effect
      if (config.followCursor) {
        canvasEl.addEventListener('mousemove', (e) => {
          const rect = canvasEl.getBoundingClientRect();
          mouseX = (e.clientX - rect.left) / rect.width - 0.5;
          mouseY = (e.clientY - rect.top) / rect.height - 0.5;
          targetRotationX = mouseY * 0.5;
          targetRotationY = mouseX * 0.5;
        });
      }

      // Animate function
      let lastTime = performance.now();
      
      const animate = () => {
        const now = performance.now();
        let delta = Math.min(0.033, (now - lastTime) / 1000);
        lastTime = now;
        
        // Update camera rotation
        camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05;
        camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.05;
        
        // Update sphere positions
        for (let i = 0; i < spheres.length; i++) {
          const sphere = spheres[i];
          const pos = positions[i];
          const vel = velocities[i];
          const size = sizes[i];
          
          // Apply gravity
          vel.y -= config.gravity * delta;
          
          // Apply friction
          vel.x *= config.friction;
          vel.y *= config.friction;
          vel.z *= config.friction;
          
          // Update position
          pos.x += vel.x * delta * 2;
          pos.y += vel.y * delta * 2;
          pos.z += vel.z * delta * 2;
          
          // Boundary collision
          const boundX = config.maxX - size;
          const boundY = config.maxY - size;
          const boundZ = config.maxZ - size;
          
          if (Math.abs(pos.x) > boundX) {
            pos.x = Math.sign(pos.x) * boundX;
            vel.x = -vel.x * config.wallBounce;
          }
          if (Math.abs(pos.y) > boundY) {
            pos.y = Math.sign(pos.y) * boundY;
            vel.y = -vel.y * config.wallBounce;
          }
          if (Math.abs(pos.z) > boundZ) {
            pos.z = Math.sign(pos.z) * boundZ;
            vel.z = -vel.z * config.wallBounce;
          }
          
          // Update sphere position
          sphere.position.set(pos.x, pos.y, pos.z);
          
          // Update light positions
          if (i === 0) {
            backLight.position.set(pos.x - 2, pos.y + 1, pos.z - 3);
          }
          if (i === Math.floor(spheres.length / 2)) {
            fillLight.position.set(pos.x + 2, pos.y - 1, pos.z + 2);
          }
        }
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      
      animate();

      // Handle resize
      const handleResize = () => {
        const width = canvasEl.parentElement?.clientWidth || window.innerWidth;
        const height = canvasEl.parentElement?.clientHeight || window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        // Adjust boundaries based on aspect
        const aspect = width / height;
        config.maxX = 6 * aspect;
        config.maxY = 4;
        config.maxZ = 3;
      };
      
      window.addEventListener('resize', handleResize);
      handleResize();

      // Return dispose function
      return {
        dispose: () => {
          window.removeEventListener('resize', handleResize);
          spheres.forEach(sphere => {
            sphere.material.dispose();
            sphere.geometry.dispose();
          });
          renderer.dispose();
        }
      };
    };

    spheresInstanceRef.current = createBallpit(canvas, { followCursor, colors });

    return () => {
      if (spheresInstanceRef.current) {
        spheresInstanceRef.current.dispose();
      }
    };
  }, [followCursor, colors]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className} 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0
      }} 
    />
  );
};

export default Ballpit;