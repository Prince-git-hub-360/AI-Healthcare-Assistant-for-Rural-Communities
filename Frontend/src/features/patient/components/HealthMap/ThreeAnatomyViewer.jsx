import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const ThreeAnatomyViewer = ({
  selectedOrganId = 'cardio',
  onSelectOrgan,
  activeCareOrganIds = [],
  viewLayer = 'all', // 'all' | 'organs' | 'skeletal'
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const organMeshesRef = useRef({});
  const bodyGroupRef = useRef(null);
  const skeletalGroupRef = useRef(null);
  const organsGroupRef = useRef(null);
  const reqIdRef = useRef(null);
  const isInteractingRef = useRef(false);

  const [autoRotate, setAutoRotate] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  // Define Organ Mesh Configurations and 3D Coordinates
  const ORGAN_DEFINITIONS = [
    {
      id: 'neuro',
      name: 'Head & Brain (Nerves)',
      color: 0x0284C7,
      position: [0, 2.75, 0],
      cameraTarget: [0, 2.75, 2.2],
    },
    {
      id: 'pulmonary',
      name: 'Lungs & Breathing',
      color: 0x06B6D4,
      position: [0, 1.6, 0.05],
      cameraTarget: [0, 1.6, 2.5],
    },
    {
      id: 'cardio',
      name: 'Heart & Circulation',
      color: 0xE11D48,
      position: [-0.15, 1.52, 0.22],
      cameraTarget: [-0.15, 1.52, 2.0],
    },
    {
      id: 'digestive',
      name: 'Stomach & Digestion',
      color: 0xD97706,
      position: [0.08, 0.95, 0.18],
      cameraTarget: [0.08, 0.95, 2.3],
    },
    {
      id: 'kidneys',
      name: 'Kidneys & Renal',
      color: 0x10B981,
      position: [0, 0.9, -0.2],
      cameraTarget: [0, 0.9, 2.3],
    },
    {
      id: 'skeletal',
      name: 'Spine & Joints',
      color: 0x94A3B8,
      position: [0, 0.2, 0],
      cameraTarget: [0, 0.2, 3.2],
    }
  ];

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 520;

    // 1. Scene & Background
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 6.2);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. OrbitControls for 360° Drag Rotation & Smooth Zoom
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 1.2, 0);
    controls.minDistance = 2.0;
    controls.maxDistance = 9.0;
    controls.maxPolarAngle = Math.PI * 0.92;
    controls.minPolarAngle = Math.PI * 0.08;
    controls.rotateSpeed = 0.75;
    controlsRef.current = controls;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.0);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf8fafc, 1.4);
    fillLight.position.set(-4, 3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    // 6. BUILD PROCEDURAL CLINICAL ANATOMICAL MODEL
    const bodyGroup = new THREE.Group();
    const organsGroup = new THREE.Group();
    const skeletalGroup = new THREE.Group();
    bodyGroupRef.current = bodyGroup;
    organsGroupRef.current = organsGroup;
    skeletalGroupRef.current = skeletalGroup;

    // ── Translucent Clinical Body Shell (Skin Layer) ──
    const skinMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.22,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.6,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Head
    const headGeom = new THREE.SphereGeometry(0.42, 32, 24);
    headGeom.scale(1, 1.18, 1.05);
    const headMesh = new THREE.Mesh(headGeom, skinMaterial);
    headMesh.position.set(0, 2.75, 0);
    bodyGroup.add(headMesh);

    // Neck
    const neckGeom = new THREE.CylinderGeometry(0.18, 0.22, 0.35, 24);
    const neckMesh = new THREE.Mesh(neckGeom, skinMaterial);
    neckMesh.position.set(0, 2.22, 0);
    bodyGroup.add(neckMesh);

    // Torso / Chest & Abdomen
    const chestGeom = new THREE.CylinderGeometry(0.55, 0.44, 1.0, 32);
    chestGeom.scale(1.22, 1, 0.72);
    const chestMesh = new THREE.Mesh(chestGeom, skinMaterial);
    chestMesh.position.set(0, 1.6, 0);
    bodyGroup.add(chestMesh);

    const abdomenGeom = new THREE.CylinderGeometry(0.44, 0.48, 0.8, 32);
    abdomenGeom.scale(1.15, 1, 0.75);
    const abdomenMesh = new THREE.Mesh(abdomenGeom, skinMaterial);
    abdomenMesh.position.set(0, 0.8, 0);
    bodyGroup.add(abdomenMesh);

    // Pelvis
    const pelvisGeom = new THREE.CylinderGeometry(0.48, 0.4, 0.45, 32);
    pelvisGeom.scale(1.18, 1, 0.78);
    const pelvisMesh = new THREE.Mesh(pelvisGeom, skinMaterial);
    pelvisMesh.position.set(0, 0.25, 0);
    bodyGroup.add(pelvisMesh);

    // Arms
    const armGeom = new THREE.CylinderGeometry(0.12, 0.09, 1.3, 16);
    const leftArm = new THREE.Mesh(armGeom, skinMaterial);
    leftArm.position.set(-0.82, 1.3, 0);
    leftArm.rotation.z = 0.12;
    bodyGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeom, skinMaterial);
    rightArm.position.set(0.82, 1.3, 0);
    rightArm.rotation.z = -0.12;
    bodyGroup.add(rightArm);

    // Forearms & Hands
    const forearmGeom = new THREE.CylinderGeometry(0.09, 0.07, 1.2, 16);
    const leftForearm = new THREE.Mesh(forearmGeom, skinMaterial);
    leftForearm.position.set(-1.0, 0.25, 0);
    bodyGroup.add(leftForearm);

    const rightForearm = new THREE.Mesh(forearmGeom, skinMaterial);
    rightForearm.position.set(1.0, 0.25, 0);
    bodyGroup.add(rightForearm);

    // Legs
    const legGeom = new THREE.CylinderGeometry(0.2, 0.14, 1.6, 20);
    const leftLeg = new THREE.Mesh(legGeom, skinMaterial);
    leftLeg.position.set(-0.32, -0.65, 0);
    bodyGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, skinMaterial);
    rightLeg.position.set(0.32, -0.65, 0);
    bodyGroup.add(rightLeg);

    // Calves & Feet
    const calfGeom = new THREE.CylinderGeometry(0.14, 0.1, 1.6, 20);
    const leftCalf = new THREE.Mesh(calfGeom, skinMaterial);
    leftCalf.position.set(-0.32, -2.1, 0);
    bodyGroup.add(leftCalf);

    const rightCalf = new THREE.Mesh(calfGeom, skinMaterial);
    rightCalf.position.set(0.32, -2.1, 0);
    bodyGroup.add(rightCalf);

    // ── Internal 3D Organ Meshes (Interactive) ──
    const organMeshes = {};

    // 1. BRAIN (Dual Hemispheres)
    const brainGroup = new THREE.Group();
    const brainMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.2,
    });
    const leftHemi = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), brainMat);
    leftHemi.scale.set(0.85, 1, 1.25);
    leftHemi.position.set(-0.1, 0, 0);
    const rightHemi = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), brainMat);
    rightHemi.scale.set(0.85, 1, 1.25);
    rightHemi.position.set(0.1, 0, 0);
    brainGroup.add(leftHemi, rightHemi);
    brainGroup.position.set(0, 2.75, 0.05);
    brainGroup.userData = { organId: 'neuro', name: 'Brain & Nerves' };
    organsGroup.add(brainGroup);
    organMeshes.neuro = brainGroup;

    // 2. LUNGS (Bilateral Pulmonary Lobes)
    const lungsGroup = new THREE.Group();
    const lungMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x0891b2,
      emissiveIntensity: 0.3,
      roughness: 0.4,
    });
    const leftLung = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.72, 24), lungMat);
    leftLung.position.set(-0.28, 1.6, 0.08);
    leftLung.rotation.z = -0.15;
    const rightLung = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.76, 24), lungMat);
    rightLung.position.set(0.28, 1.6, 0.08);
    rightLung.rotation.z = 0.15;
    lungsGroup.add(leftLung, rightLung);
    lungsGroup.userData = { organId: 'pulmonary', name: 'Lungs' };
    organsGroup.add(lungsGroup);
    organMeshes.pulmonary = lungsGroup;

    // 3. HEART (Mediastinum)
    const heartGroup = new THREE.Group();
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.6,
      roughness: 0.25,
      metalness: 0.1,
    });
    const heartMesh = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 20), heartMat);
    heartMesh.scale.set(1.05, 1.25, 0.95);
    heartMesh.rotation.z = -0.3;
    heartGroup.add(heartMesh);
    heartGroup.position.set(-0.12, 1.52, 0.2);
    heartGroup.userData = { organId: 'cardio', name: 'Heart' };
    organsGroup.add(heartGroup);
    organMeshes.cardio = heartGroup;

    // 4. STOMACH & DIGESTIVE (Gastric Cavity)
    const stomachGroup = new THREE.Group();
    const stomachMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
      roughness: 0.35,
    });
    const stomachMesh = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.11, 16, 24, Math.PI * 1.2), stomachMat);
    stomachMesh.rotation.z = Math.PI * 0.4;
    stomachGroup.add(stomachMesh);
    stomachGroup.position.set(0.08, 0.95, 0.15);
    stomachGroup.userData = { organId: 'digestive', name: 'Stomach' };
    organsGroup.add(stomachGroup);
    organMeshes.digestive = stomachGroup;

    // 5. KIDNEYS (Posterior Lumbar)
    const kidneysGroup = new THREE.Group();
    const kidneyMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x059669,
      emissiveIntensity: 0.35,
      roughness: 0.3,
    });
    const leftKidney = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), kidneyMat);
    leftKidney.scale.set(0.7, 1.2, 0.6);
    leftKidney.position.set(-0.25, 0.88, -0.15);
    const rightKidney = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), kidneyMat);
    rightKidney.scale.set(0.7, 1.2, 0.6);
    rightKidney.position.set(0.25, 0.88, -0.15);
    kidneysGroup.add(leftKidney, rightKidney);
    kidneysGroup.userData = { organId: 'kidneys', name: 'Kidneys' };
    organsGroup.add(kidneysGroup);
    organMeshes.kidneys = kidneysGroup;

    // 6. SKELETAL & SPINE (Vertebral Column & Joints)
    const spineMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      emissive: 0x64748b,
      emissiveIntensity: 0.2,
      roughness: 0.5,
    });
    const spineGeom = new THREE.CylinderGeometry(0.06, 0.08, 2.2, 16);
    const spineMesh = new THREE.Mesh(spineGeom, spineMat);
    spineMesh.position.set(0, 1.35, -0.12);
    skeletalGroup.add(spineMesh);

    // Ribcage arcs
    for (let r = 0; r < 5; r++) {
      const ribTorus = new THREE.Mesh(
        new THREE.TorusGeometry(0.42 - r * 0.03, 0.022, 8, 24, Math.PI * 1.5),
        spineMat
      );
      ribTorus.rotation.x = Math.PI * 0.5;
      ribTorus.position.set(0, 1.85 - r * 0.16, 0);
      skeletalGroup.add(ribTorus);
    }

    skeletalGroup.userData = { organId: 'skeletal', name: 'Spine & Joints' };
    organMeshes.skeletal = skeletalGroup;

    // Add all groups to scene
    scene.add(bodyGroup);
    scene.add(organsGroup);
    scene.add(skeletalGroup);
    organMeshesRef.current = organMeshes;

    // 7. Raycaster for Mesh Clicking / Touch Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event) => {
      isInteractingRef.current = false;
    };

    const handlePointerMove = () => {
      isInteractingRef.current = true;
    };

    const handlePointerUp = (event) => {
      // If the user was dragging/orbiting the camera, don't trigger mesh selection
      if (isInteractingRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveObjects = [
        ...organsGroup.children,
        ...skeletalGroup.children,
      ];
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let currentObj = intersects[0].object;
        while (currentObj && !currentObj.userData?.organId && currentObj.parent) {
          currentObj = currentObj.parent;
        }
        if (currentObj?.userData?.organId) {
          onSelectOrgan?.(currentObj.userData.organId);
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);
    domElement.addEventListener('pointermove', handlePointerMove);
    domElement.addEventListener('pointerup', handlePointerUp);

    // 8. Animation & Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle Cardiac Pulse Animation (72 bpm)
      if (organMeshes.cardio) {
        const pulse = 1.0 + Math.sin(elapsedTime * 7.5) * 0.08;
        organMeshes.cardio.scale.set(pulse, pulse, pulse);
      }

      // Gentle Lung Respiratory expansion
      if (organMeshes.pulmonary) {
        const breath = 1.0 + Math.sin(elapsedTime * 2.2) * 0.035;
        organMeshes.pulmonary.scale.set(breath, breath, breath);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth || 400;
      const newH = container.clientHeight || 520;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      domElement.removeEventListener('pointerdown', handlePointerDown);
      domElement.removeEventListener('pointermove', handlePointerMove);
      domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Visual Highlights on Selected / Active Organs
  useEffect(() => {
    const organMeshes = organMeshesRef.current;
    if (!organMeshes) return;

    Object.entries(organMeshes).forEach(([id, group]) => {
      const isSelected = selectedOrganId === id;
      const hasActiveCare = activeCareOrganIds.includes(id);

      group.traverse((child) => {
        if (child.isMesh && child.material) {
          if (isSelected) {
            child.material.emissiveIntensity = 0.9;
          } else if (hasActiveCare) {
            child.material.emissiveIntensity = 0.5;
          } else {
            child.material.emissiveIntensity = 0.18;
          }
        }
      });
    });

    // Smoothly focus camera when organ is selected
    const organDef = ORGAN_DEFINITIONS.find((o) => o.id === selectedOrganId);
    if (organDef && controlsRef.current && cameraRef.current) {
      const controls = controlsRef.current;
      const camera = cameraRef.current;

      const targetX = organDef.position[0];
      const targetY = organDef.position[1];
      const targetZ = organDef.position[2];

      controls.target.set(targetX, targetY, targetZ);
    }
  }, [selectedOrganId, activeCareOrganIds]);

  // Handle Layer Visibility Toggles
  useEffect(() => {
    if (bodyGroupRef.current) {
      bodyGroupRef.current.visible = viewLayer === 'all';
    }
    if (organsGroupRef.current) {
      organsGroupRef.current.visible = viewLayer === 'all' || viewLayer === 'organs';
    }
    if (skeletalGroupRef.current) {
      skeletalGroupRef.current.visible = viewLayer === 'all' || viewLayer === 'skeletal';
    }
  }, [viewLayer]);

  // Auto Rotate Toggle
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 1.8;
    }
  }, [autoRotate]);

  // Camera Quick View Reset Actions
  const resetCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 1.4, 6.2);
    controlsRef.current.target.set(0, 1.2, 0);
  }, []);

  const setViewAngle = useCallback((x, y, z) => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(x, y, z);
    controlsRef.current.target.set(0, 1.2, 0);
  }, []);

  return (
    <div className="relative w-full h-[500px] sm:h-[580px] bg-gradient-to-b from-slate-900 via-[#0B132B] to-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-xl select-none">
      
      {/* 3D WebGL Canvas Mount Container */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
        onMouseDown={() => setHintVisible(false)}
        onTouchStart={() => setHintVisible(false)}
      />

      {/* Floating 360° Drag Interaction Hint */}
      {hintVisible && (
        <div className="absolute top-4 left-4 z-10 bg-slate-900/85 backdrop-blur-md border border-slate-700 text-teal-300 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <span>🔄</span>
          <span>Drag with mouse / finger to rotate 360°</span>
        </div>
      )}

      {/* Top Right Quick Angle Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-800 p-1.5 rounded-2xl shadow-lg">
        <button
          type="button"
          onClick={() => setViewAngle(0, 1.4, 6.2)}
          className="text-[10px] font-black uppercase text-slate-300 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
          title="Front View"
        >
          Front
        </button>
        <button
          type="button"
          onClick={() => setViewAngle(5.8, 1.4, 0)}
          className="text-[10px] font-black uppercase text-slate-300 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
          title="Side View"
        >
          Side
        </button>
        <button
          type="button"
          onClick={() => setViewAngle(0, 1.4, -6.2)}
          className="text-[10px] font-black uppercase text-slate-300 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
          title="Back View"
        >
          Back
        </button>
      </div>

      {/* Bottom Floating 3D Tool Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-2 rounded-2xl shadow-2xl">
        
        {/* Reset Camera */}
        <button
          type="button"
          onClick={resetCamera}
          className="text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
          title="Reset Camera"
        >
          <span>🎯</span>
          <span>Reset</span>
        </button>

        <div className="h-4 w-px bg-slate-700" />

        {/* Auto Rotate Toggle */}
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            autoRotate
              ? 'bg-[#0B4F42] text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Toggle 360° Auto-Rotation"
        >
          <span>🔄</span>
          <span>{autoRotate ? 'Rotating' : 'Rotate'}</span>
        </button>

        <div className="h-4 w-px bg-slate-700" />

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-teal-400 font-bold px-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>Interactive 3D WebGL</span>
        </div>
      </div>

    </div>
  );
};

export default ThreeAnatomyViewer;
