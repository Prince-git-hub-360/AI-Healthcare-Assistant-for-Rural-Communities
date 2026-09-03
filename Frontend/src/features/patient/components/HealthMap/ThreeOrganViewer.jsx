import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const ThreeOrganViewer = ({
  organId = 'cardio',
  organName = 'Heart',
  color = 0xE11D48,
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const organMeshRef = useRef(null);
  const reqIdRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 340;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 4.5);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.0;
    controls.minDistance = 2.0;
    controls.maxDistance = 7.0;
    controlsRef.current = controls;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 1.6);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // 6. 3D Organ Geometry & Sculpted Meshes
    const organGroup = new THREE.Group();
    organMeshRef.current = organGroup;

    // Holographic Orbital Rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.015, 16, 64), ringMat);
    ring1.rotation.x = Math.PI * 0.4;
    ring1.rotation.y = Math.PI * 0.15;
    organGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.012, 16, 64), ringMat);
    ring2.rotation.x = -Math.PI * 0.35;
    ring2.rotation.y = -Math.PI * 0.2;
    organGroup.add(ring2);

    // Organ-Specific 3D Geometry
    if (organId === 'cardio') {
      // Sculpted 3D Heart
      const heartMat = new THREE.MeshStandardMaterial({
        color: 0xe11d48,
        emissive: 0x9f1239,
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.15,
      });
      const ventricle = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 24), heartMat);
      ventricle.scale.set(0.95, 1.25, 0.9);
      ventricle.rotation.z = -0.25;
      organGroup.add(ventricle);

      // Aorta Arc
      const aortaMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      const aorta = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.16, 16, 32, Math.PI), aortaMat);
      aorta.position.set(0.1, 0.85, 0);
      aorta.rotation.z = Math.PI * 0.15;
      organGroup.add(aorta);

      // Vena Cava / Pulmonary Artery
      const blueVesselMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
      const vCava = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.7, 16), blueVesselMat);
      vCava.position.set(-0.35, 0.95, 0.1);
      organGroup.add(vCava);

    } else if (organId === 'neuro') {
      // 3D Brain
      const brainMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.3,
        roughness: 0.35,
        metalness: 0.1,
      });
      const leftHemi = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 24), brainMat);
      leftHemi.scale.set(0.78, 0.95, 1.2);
      leftHemi.position.set(-0.38, 0, 0);

      const rightHemi = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 24), brainMat);
      rightHemi.scale.set(0.78, 0.95, 1.2);
      rightHemi.position.set(0.38, 0, 0);

      const cerebellum = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 16), brainMat);
      cerebellum.position.set(0, -0.65, -0.45);

      organGroup.add(leftHemi, rightHemi, cerebellum);

    } else if (organId === 'pulmonary') {
      // 3D Lungs
      const lungMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x0891b2,
        emissiveIntensity: 0.3,
        roughness: 0.35,
      });
      const leftLobe = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.8, 32), lungMat);
      leftLobe.position.set(-0.75, 0, 0);
      leftLobe.rotation.z = -0.15;

      const rightLobe = new THREE.Mesh(new THREE.ConeGeometry(0.82, 1.9, 32), lungMat);
      rightLobe.position.set(0.75, 0, 0);
      rightLobe.rotation.z = 0.15;

      const tracheaMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
      const trachea = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.2, 20), tracheaMat);
      trachea.position.set(0, 0.9, 0);

      organGroup.add(leftLobe, rightLobe, trachea);

    } else if (organId === 'digestive') {
      // 3D Stomach & Duodenum
      const stomachMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.35,
        roughness: 0.35,
      });
      const gastric = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.35, 20, 32, Math.PI * 1.3), stomachMat);
      gastric.rotation.z = Math.PI * 0.35;
      organGroup.add(gastric);

    } else if (organId === 'kidneys') {
      // 3D Kidneys
      const kidneyMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.35,
        roughness: 0.3,
      });
      const leftK = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 20), kidneyMat);
      leftK.scale.set(0.65, 1.2, 0.6);
      leftK.position.set(-0.85, 0, 0);

      const rightK = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 20), kidneyMat);
      rightK.scale.set(0.65, 1.2, 0.6);
      rightK.position.set(0.85, 0, 0);

      organGroup.add(leftK, rightK);
    }

    scene.add(organGroup);

    // 7. Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Cardiac pulse
      if (organId === 'cardio' && organGroup) {
        const pulse = 1.0 + Math.sin(time * 7.0) * 0.05;
        organGroup.scale.set(pulse, pulse, pulse);
      }

      // Lung expansion
      if (organId === 'pulmonary' && organGroup) {
        const breath = 1.0 + Math.sin(time * 2.2) * 0.035;
        organGroup.scale.set(breath, breath, breath);
      }

      ring1.rotation.z = time * 0.4;
      ring2.rotation.z = -time * 0.3;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 340;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      controls.dispose();
      renderer.dispose();
    };
  }, [organId]);

  // Handle Auto-Rotate state
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  const resetCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 0.2, 4.5);
    controlsRef.current.target.set(0, 0, 0);
  }, []);

  return (
    <div className="relative w-full h-[320px] sm:h-[350px] flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-[#0B132B] to-slate-950 border border-slate-800 shadow-inner">
      
      {/* Three.js Canvas Mount */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
      />

      {/* Floating 360° Drag Rotate Badge */}
      <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 pointer-events-none">
        <span>🔄</span>
        <span>Drag to rotate in 3D</span>
      </div>

      {/* Quick Controls Bar */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-1 rounded-xl shadow-lg">
        <button
          type="button"
          onClick={resetCamera}
          className="text-[10px] font-bold text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
          title="Reset Camera"
        >
          🎯 Reset
        </button>
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${
            autoRotate ? 'bg-[#0B4F42] text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Auto-Rotation"
        >
          {autoRotate ? '⏸️' : '▶️'}
        </button>
      </div>

    </div>
  );
};

export default ThreeOrganViewer;
