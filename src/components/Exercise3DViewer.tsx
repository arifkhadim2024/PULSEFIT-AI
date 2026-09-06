'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  RotateCcw, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  Eye, 
  Layers, 
  Compass, 
  Activity, 
  Sparkles,
  Sliders,
  ZoomIn,
  ZoomOut,
  Flame,
  Zap,
  Cpu
} from 'lucide-react';

interface Exercise3DViewerProps {
  exerciseName: string;
  exerciseSlug?: string;
  primaryMuscle: string;
  secondaryMuscles?: string;
  movementPattern?: string;
  equipment?: string;
  tempo?: string;
  className?: string;
  externalPlaying?: boolean;
  externalSpeed?: number;
  onAngleUpdate?: (angles: { primaryJoint: string; angle: number; secondaryJoint: string; angle2: number }) => void;
}

export type ExerciseMotionType = 
  | 'bench'
  | 'incline_bench'
  | 'decline_bench'
  | 'pushup'
  | 'dips'
  | 'chest_fly'
  | 'squat'
  | 'deadlift'
  | 'rdl'
  | 'hip_thrust'
  | 'leg_extension'
  | 'shoulder_press'
  | 'lateral_raise'
  | 'pullup'
  | 'lat_pulldown'
  | 'row'
  | 'bicep_curl'
  | 'hammer_curl'
  | 'tricep_pushdown'
  | 'plank'
  | 'leg_raise'
  | 'russian_twist'
  | 'calves';

export default function Exercise3DViewer({
  exerciseName,
  exerciseSlug,
  primaryMuscle = 'Chest',
  secondaryMuscles = '',
  movementPattern = 'Horizontal Push',
  equipment = 'Barbell',
  tempo = '3-0-1-0',
  className = '',
  externalPlaying,
  externalSpeed,
  onAngleUpdate,
}: Exercise3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalPlaying, setInternalPlaying] = useState(true);
  const [internalSpeed, setInternalSpeed] = useState<number>(1.0);
  const [cameraView, setCameraView] = useState<'perspective' | 'front' | 'side' | 'top'>('perspective');
  const [renderMode, setRenderMode] = useState<'heatmap' | 'hologram' | 'anatomical'>('heatmap');
  const [showJointAngles, setShowJointAngles] = useState(true);
  const [jointAngleData, setJointAngleData] = useState<{ primaryJoint: string; angle: number; secondaryJoint: string; angle2: number }>({
    primaryJoint: 'Elbow Flexion',
    angle: 90,
    secondaryJoint: 'Shoulder Abduction',
    angle2: 45,
  });

  const isPlaying = externalPlaying !== undefined ? externalPlaying : internalPlaying;
  const playbackSpeed = externalSpeed !== undefined ? externalSpeed : internalSpeed;

  // Scene state refs for Three.js
  const sceneState = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    rigRoot?: THREE.Group;
    equipmentGroup?: THREE.Group;
    muscleMeshes: { name: string; mesh: THREE.Mesh; baseColor: number; isPrimary: boolean; isSecondary: boolean }[];
    jointMarkers: THREE.Mesh[];
    animTime: number;
    reqId?: number;
    isDragging: boolean;
    prevMousePos: { x: number; y: number };
    sphericalCoords: { radius: number; theta: number; phi: number };
  }>({
    muscleMeshes: [],
    jointMarkers: [],
    animTime: 0,
    isDragging: false,
    prevMousePos: { x: 0, y: 0 },
    sphericalCoords: { radius: 5.5, theta: Math.PI / 4, phi: Math.PI / 3 },
  });

  // Resolve exact Motion Type matching the 22 Kaggle Dataset categories
  const motionType = useMemo<ExerciseMotionType>(() => {
    const slug = (exerciseSlug || exerciseName || '').toLowerCase();
    const p = primaryMuscle.toLowerCase();
    const pattern = movementPattern.toLowerCase();
    const eq = equipment.toLowerCase();

    // 1. Specific slug keywords from Kaggle dataset
    if (slug.includes('decline')) return 'decline_bench';
    if (slug.includes('incline')) return 'incline_bench';
    if (slug.includes('push-up') || slug.includes('pushup')) return 'pushup';
    if (slug.includes('dip')) return 'dips';
    if (slug.includes('pec-deck') || slug.includes('fly') || slug.includes('flye')) return 'chest_fly';
    if (slug.includes('bench-press') || slug.includes('chest-press')) return 'bench';
    if (slug.includes('hip-thrust') || slug.includes('glute-bridge')) return 'hip_thrust';
    if (slug.includes('romanian') || slug.includes('stiff-leg') || slug.includes('good-morning')) return 'rdl';
    if (slug.includes('deadlift')) return 'deadlift';
    if (slug.includes('leg-extension') || slug.includes('leg-curl')) return 'leg_extension';
    if (slug.includes('squat') || slug.includes('leg-press') || slug.includes('lunge')) return 'squat';
    if (slug.includes('pull-up') || slug.includes('chin-up')) return 'pullup';
    if (slug.includes('lat-pulldown') || slug.includes('pulldown')) return 'lat_pulldown';
    if (slug.includes('row')) return 'row';
    if (slug.includes('hammer-curl')) return 'hammer_curl';
    if (slug.includes('curl')) return 'bicep_curl';
    if (slug.includes('pushdown') || slug.includes('skull-crusher') || slug.includes('tricep-extension')) return 'tricep_pushdown';
    if (slug.includes('lateral-raise') || slug.includes('front-raise') || slug.includes('rear-delt')) return 'lateral_raise';
    if (slug.includes('shoulder-press') || slug.includes('overhead-press') || slug.includes('arnold') || slug.includes('military')) return 'shoulder_press';
    if (slug.includes('plank') || slug.includes('ab-wheel')) return 'plank';
    if (slug.includes('leg-raise')) return 'leg_raise';
    if (slug.includes('russian-twist') || slug.includes('woodchopper')) return 'russian_twist';
    if (slug.includes('calf') || slug.includes('calves')) return 'calves';

    // 2. Pattern and Muscle Fallbacks
    if (p.includes('chest') || pattern.includes('horizontal push')) return 'bench';
    if (p.includes('quad') || pattern.includes('squat')) return 'squat';
    if (p.includes('hamstring') || pattern.includes('hinge')) return 'rdl';
    if (p.includes('shoulder') || pattern.includes('vertical push')) return 'shoulder_press';
    if (pattern.includes('vertical pull') || p.includes('lat')) return 'lat_pulldown';
    if (pattern.includes('horizontal pull') || p.includes('back')) return 'row';
    if (p.includes('bicep')) return 'bicep_curl';
    if (p.includes('tricep')) return 'tricep_pushdown';
    if (p.includes('abs') || p.includes('core')) return 'plank';

    return 'bench';
  }, [exerciseSlug, exerciseName, primaryMuscle, movementPattern, equipment]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Create Three.js Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040810);
    scene.fog = new THREE.FogExp2(0x040810, 0.08);
    sceneState.current.scene = scene;

    // 2. Camera Setup
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    sceneState.current.camera = camera;
    updateCameraPosition();

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.replaceChildren(renderer.domElement);
    sceneState.current.renderer = renderer;

    // 4. Studio Lighting & Cyber Atmosphere
    const ambientLight = new THREE.AmbientLight(0x1a2e3b, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLightCyan = new THREE.DirectionalLight(0x06b6d4, 2.8);
    rimLightCyan.position.set(-5, 4, -4);
    scene.add(rimLightCyan);

    const fillLightEmerald = new THREE.DirectionalLight(0x10b981, 2.0);
    fillLightEmerald.position.set(0, -3, 3);
    scene.add(fillLightEmerald);

    // 5. Grid Platform with glowing ring
    const gridHelper = new THREE.GridHelper(10, 20, 0x10b981, 0x1e293b);
    gridHelper.position.y = -1.8;
    scene.add(gridHelper);

    const ringGeo = new THREE.RingGeometry(1.8, 1.85, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.79;
    scene.add(ringMesh);

    // 6. Build the 3D Anatomical Human Rig
    const rig = buildHumanAnatomicalRig(primaryMuscle, secondaryMuscles, renderMode);
    scene.add(rig.root);
    sceneState.current.rigRoot = rig.root;
    sceneState.current.muscleMeshes = rig.muscleMeshes;
    sceneState.current.jointMarkers = rig.jointMarkers;

    // 7. Build Equipment
    const eqGroup = buildEquipment(motionType, equipment);
    scene.add(eqGroup);
    sceneState.current.equipmentGroup = eqGroup;

    // 8. Animation & Render Loop
    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isPlaying) {
        sceneState.current.animTime += delta * playbackSpeed;
      }

      const t = sceneState.current.animTime;
      updateKinematics(t, motionType, rig, eqGroup);

      renderer.render(scene, camera);
      sceneState.current.reqId = requestAnimationFrame(animate);
    };

    sceneState.current.reqId = requestAnimationFrame(animate);

    // 9. Mouse / Touch Orbit Interaction
    const handleMouseDown = (e: MouseEvent) => {
      sceneState.current.isDragging = true;
      sceneState.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!sceneState.current.isDragging) return;
      const dx = e.clientX - sceneState.current.prevMousePos.x;
      const dy = e.clientY - sceneState.current.prevMousePos.y;
      sceneState.current.prevMousePos = { x: e.clientX, y: e.clientY };

      sceneState.current.sphericalCoords.theta -= dx * 0.008;
      sceneState.current.sphericalCoords.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, sceneState.current.sphericalCoords.phi - dy * 0.008)
      );

      updateCameraPosition();
    };

    const handleMouseUp = () => {
      sceneState.current.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      sceneState.current.sphericalCoords.radius = Math.max(
        2.5,
        Math.min(10, sceneState.current.sphericalCoords.radius + e.deltaY * 0.005)
      );
      updateCameraPosition();
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    // Handle Resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (sceneState.current.reqId) cancelAnimationFrame(sceneState.current.reqId);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [motionType, renderMode, primaryMuscle, secondaryMuscles, isPlaying, playbackSpeed]);

  const updateCameraPosition = () => {
    const { camera } = sceneState.current;
    if (!camera) return;
    const { radius, theta, phi } = sceneState.current.sphericalCoords;

    camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
    camera.position.y = radius * Math.cos(phi) + 0.2;
    camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
    camera.lookAt(0, 0.1, 0);
  };

  const setCameraPreset = (preset: 'perspective' | 'front' | 'side' | 'top') => {
    setCameraView(preset);
    if (preset === 'perspective') {
      sceneState.current.sphericalCoords = { radius: 5.5, theta: Math.PI / 4, phi: Math.PI / 3 };
    } else if (preset === 'front') {
      sceneState.current.sphericalCoords = { radius: 5.2, theta: 0, phi: Math.PI / 2 };
    } else if (preset === 'side') {
      sceneState.current.sphericalCoords = { radius: 5.2, theta: Math.PI / 2, phi: Math.PI / 2 };
    } else if (preset === 'top') {
      sceneState.current.sphericalCoords = { radius: 5.5, theta: 0, phi: 0.15 };
    }
    updateCameraPosition();
  };

  const handleZoom = (delta: number) => {
    sceneState.current.sphericalCoords.radius = Math.max(
      2.5,
      Math.min(10, sceneState.current.sphericalCoords.radius + delta)
    );
    updateCameraPosition();
  };

  // -------------------------------------------------------------
  // THREE.JS RIG BUILDER & ANATOMY GEOMETRY
  // -------------------------------------------------------------
  function buildHumanAnatomicalRig(primary: string, secondary: string, mode: 'heatmap' | 'hologram' | 'anatomical') {
    const root = new THREE.Group();
    const muscleMeshes: { name: string; mesh: THREE.Mesh; baseColor: number; isPrimary: boolean; isSecondary: boolean }[] = [];
    const jointMarkers: THREE.Mesh[] = [];

    const normPrimary = primary.toLowerCase();
    const normSec = secondary.toLowerCase();

    const getMuscleMaterial = (name: string, defaultColor: number = 0x334155) => {
      const isPrimary = normPrimary.includes(name.toLowerCase());
      const isSecondary = normSec.includes(name.toLowerCase());

      let color = defaultColor;
      let emissive = 0x000000;
      let emissiveIntensity = 0.0;
      let opacity = mode === 'hologram' ? 0.7 : 0.95;
      let wireframe = mode === 'hologram';

      if (isPrimary) {
        color = 0x10b981; // Vibrant Emerald EMG Peak
        emissive = 0x059669;
        emissiveIntensity = 0.8;
      } else if (isSecondary) {
        color = 0x06b6d4; // Cyan Synergist
        emissive = 0x0891b2;
        emissiveIntensity = 0.4;
      } else if (mode === 'anatomical') {
        color = 0x475569;
      }

      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive,
        emissiveIntensity,
        roughness: 0.35,
        metalness: 0.2,
        transparent: mode === 'hologram',
        opacity,
        wireframe,
      });

      return { mat, isPrimary, isSecondary };
    };

    const registerMesh = (mesh: THREE.Mesh, name: string) => {
      const { isPrimary, isSecondary } = getMuscleMaterial(name);
      muscleMeshes.push({
        name,
        mesh,
        baseColor: (mesh.material as THREE.MeshStandardMaterial).color.getHex(),
        isPrimary,
        isSecondary,
      });
      return mesh;
    };

    // --- SPINE / PELVIS BASE ---
    const pelvisGroup = new THREE.Group();
    pelvisGroup.position.y = 0;
    root.add(pelvisGroup);

    const pelvisMat = getMuscleMaterial('Glutes', 0x334155).mat;
    const pelvis = registerMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.35, 16), pelvisMat), 'Glutes');
    pelvisGroup.add(pelvis);

    // --- TORSO / CHEST / LATS ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 0.25;
    pelvisGroup.add(torsoGroup);

    // Abs / Core
    const absMat = getMuscleMaterial('Abs', 0x334155).mat;
    const absMesh = registerMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.55, 16), absMat), 'Abs');
    absMesh.position.y = 0.25;
    torsoGroup.add(absMesh);

    // Upper Torso / Chest / Back
    const chestMat = getMuscleMaterial('Chest', 0x334155).mat;
    const chestMesh = registerMesh(new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.6, 0.45), chestMat), 'Chest');
    chestMesh.position.y = 0.75;
    torsoGroup.add(chestMesh);

    // Pectoral Muscle Plates (Left & Right)
    const pecLeft = registerMesh(new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.32, 0.08), chestMat), 'Chest');
    pecLeft.position.set(-0.2, 0.78, 0.24);
    torsoGroup.add(pecLeft);

    const pecRight = registerMesh(new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.32, 0.08), chestMat), 'Chest');
    pecRight.position.set(0.2, 0.78, 0.24);
    torsoGroup.add(pecRight);

    // Lats / Upper Back Wing Plates
    const backMat = getMuscleMaterial('Back', 0x334155).mat;
    const latLeft = registerMesh(new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.5, 0.08), backMat), 'Back');
    latLeft.position.set(-0.25, 0.65, -0.24);
    latLeft.rotation.y = 0.2;
    torsoGroup.add(latLeft);

    const latRight = registerMesh(new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.5, 0.08), backMat), 'Back');
    latRight.position.set(0.25, 0.65, -0.24);
    latRight.rotation.y = -0.2;
    torsoGroup.add(latRight);

    // --- NECK & HEAD ---
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.2, 16), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    neck.position.y = 1.15;
    torsoGroup.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.y = 1.45;
    torsoGroup.add(headGroup);

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 }));
    headGroup.add(headMesh);

    // Visor
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.08, 0.15), new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 1.2 }));
    visor.position.set(0, 0.02, 0.18);
    headGroup.add(visor);

    // --- SHOULDERS & ARMS ---
    const shoulderMat = getMuscleMaterial('Shoulders', 0x334155).mat;
    const bicepMat = getMuscleMaterial('Biceps', 0x334155).mat;
    const tricepMat = getMuscleMaterial('Triceps', 0x334155).mat;
    const forearmMat = getMuscleMaterial('Forearms', 0x334155).mat;

    // Left Arm Hierarchy
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(-0.52, 0.95, 0);
    torsoGroup.add(leftShoulder);

    const leftDelt = registerMesh(new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), shoulderMat), 'Shoulders');
    leftShoulder.add(leftDelt);

    const leftUpperArm = new THREE.Group();
    leftUpperArm.position.y = -0.15;
    leftShoulder.add(leftUpperArm);

    const leftBicep = registerMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.45, 16), bicepMat), 'Biceps');
    leftBicep.position.y = -0.22;
    leftUpperArm.add(leftBicep);

    const leftElbow = new THREE.Group();
    leftElbow.position.y = -0.45;
    leftUpperArm.add(leftElbow);

    const leftForearm = registerMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.45, 16), forearmMat), 'Forearms');
    leftForearm.position.y = -0.22;
    leftElbow.add(leftForearm);

    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    leftHand.position.y = -0.48;
    leftElbow.add(leftHand);

    // Right Arm Hierarchy
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(0.52, 0.95, 0);
    torsoGroup.add(rightShoulder);

    const rightDelt = registerMesh(new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), shoulderMat), 'Shoulders');
    rightShoulder.add(rightDelt);

    const rightUpperArm = new THREE.Group();
    rightUpperArm.position.y = -0.15;
    rightShoulder.add(rightUpperArm);

    const rightBicep = registerMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.45, 16), bicepMat), 'Biceps');
    rightBicep.position.y = -0.22;
    rightUpperArm.add(rightBicep);

    const rightElbow = new THREE.Group();
    rightElbow.position.y = -0.45;
    rightUpperArm.add(rightElbow);

    const rightForearm = registerMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.45, 16), forearmMat), 'Forearms');
    rightForearm.position.y = -0.22;
    rightElbow.add(rightForearm);

    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    rightHand.position.y = -0.48;
    rightElbow.add(rightHand);

    // --- LEGS & HIPS ---
    const quadMat = getMuscleMaterial('Quadriceps', 0x334155).mat;
    const hamMat = getMuscleMaterial('Hamstrings', 0x334155).mat;
    const calfMat = getMuscleMaterial('Calves', 0x334155).mat;

    // Left Leg
    const leftHip = new THREE.Group();
    leftHip.position.set(-0.22, -0.15, 0);
    pelvisGroup.add(leftHip);

    const leftThigh = registerMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.65, 16), quadMat), 'Quadriceps');
    leftThigh.position.y = -0.32;
    leftHip.add(leftThigh);

    const leftKnee = new THREE.Group();
    leftKnee.position.y = -0.65;
    leftHip.add(leftKnee);

    const leftCalf = registerMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.09, 0.65, 16), calfMat), 'Calves');
    leftCalf.position.y = -0.32;
    leftKnee.add(leftCalf);

    const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.32), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    leftFoot.position.set(0, -0.68, 0.08);
    leftKnee.add(leftFoot);

    // Right Leg
    const rightHip = new THREE.Group();
    rightHip.position.set(0.22, -0.15, 0);
    pelvisGroup.add(rightHip);

    const rightThigh = registerMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.65, 16), quadMat), 'Quadriceps');
    rightThigh.position.y = -0.32;
    rightHip.add(rightThigh);

    const rightKnee = new THREE.Group();
    rightKnee.position.y = -0.65;
    rightHip.add(rightKnee);

    const rightCalf = registerMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.09, 0.65, 16), calfMat), 'Calves');
    rightCalf.position.y = -0.32;
    rightKnee.add(rightCalf);

    const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.32), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    rightFoot.position.set(0, -0.68, 0.08);
    rightKnee.add(rightFoot);

    return {
      root,
      pelvisGroup,
      torsoGroup,
      leftShoulder,
      leftUpperArm,
      leftElbow,
      leftHand,
      rightShoulder,
      rightUpperArm,
      rightElbow,
      rightHand,
      leftHip,
      leftKnee,
      rightHip,
      rightKnee,
      muscleMeshes,
      jointMarkers,
    };
  }

  // -------------------------------------------------------------
  // PROCEDURAL 3D EQUIPMENT BUILDER
  // -------------------------------------------------------------
  function buildEquipment(type: ExerciseMotionType, eqType: string) {
    const group = new THREE.Group();
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.15 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.7 });
    const redPlateMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.4, roughness: 0.3 });
    const benchPadMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });

    if (type === 'bench' || type === 'incline_bench' || type === 'decline_bench' || type === 'hip_thrust') {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 1.8), benchPadMat);
      bench.position.set(0, -0.35, 0);
      if (type === 'incline_bench') bench.rotation.x = -0.4;
      if (type === 'decline_bench') bench.rotation.x = 0.3;
      group.add(bench);

      const benchLegs = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4), chromeMat);
      benchLegs.position.set(0, -1.05, 0.6);
      group.add(benchLegs);

      const benchLegs2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4), chromeMat);
      benchLegs2.position.set(0, -1.05, -0.6);
      group.add(benchLegs2);

      // Barbell
      const barbell = new THREE.Group();
      barbell.name = 'dynamicBarbell';
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.2), chromeMat);
      bar.rotation.z = Math.PI / 2;
      barbell.add(bar);

      const plateL = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 32), redPlateMat);
      plateL.rotation.z = Math.PI / 2;
      plateL.position.x = -0.95;
      barbell.add(plateL);

      const plateR = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 32), redPlateMat);
      plateR.rotation.z = Math.PI / 2;
      plateR.position.x = 0.95;
      barbell.add(plateR);

      barbell.position.set(0, 0.65, 0);
      group.add(barbell);
    } else if (type === 'squat' || type === 'shoulder_press' || type === 'deadlift' || type === 'rdl' || type === 'row' || type === 'bicep_curl') {
      const barbell = new THREE.Group();
      barbell.name = 'dynamicBarbell';
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.2), chromeMat);
      bar.rotation.z = Math.PI / 2;
      barbell.add(bar);

      const plateL = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.08, 32), redPlateMat);
      plateL.rotation.z = Math.PI / 2;
      plateL.position.x = -0.95;
      barbell.add(plateL);

      const plateR = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.08, 32), redPlateMat);
      plateR.rotation.z = Math.PI / 2;
      plateR.position.x = 0.95;
      barbell.add(plateR);

      group.add(barbell);
    } else if (type === 'pullup' || type === 'lat_pulldown') {
      const pullBar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.4), chromeMat);
      pullBar.rotation.z = Math.PI / 2;
      pullBar.position.set(0, 2.1, 0);
      group.add(pullBar);
    } else if (type === 'dips') {
      const barL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2), chromeMat);
      barL.rotation.x = Math.PI / 2;
      barL.position.set(-0.6, 0.2, 0);
      const barR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2), chromeMat);
      barR.rotation.x = Math.PI / 2;
      barR.position.set(0.6, 0.2, 0);
      group.add(barL, barR);
    } else if (type === 'hammer_curl' || type === 'lateral_raise' || type === 'tricep_pushdown' || type === 'russian_twist') {
      const dbL = new THREE.Group();
      dbL.name = 'dumbbellLeft';
      const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3), chromeMat);
      const headL1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 6), rubberMat);
      headL1.position.y = 0.15;
      const headL2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 6), rubberMat);
      headL2.position.y = -0.15;
      dbL.add(handleL, headL1, headL2);
      group.add(dbL);

      const dbR = new THREE.Group();
      dbR.name = 'dumbbellRight';
      const handleR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3), chromeMat);
      const headR1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 6), rubberMat);
      headR1.position.y = 0.15;
      const headR2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 6), rubberMat);
      headR2.position.y = -0.15;
      dbR.add(handleR, headR1, headR2);
      group.add(dbR);
    }

    return group;
  }

  // -------------------------------------------------------------
  // ACCURATE 3D KINEMATIC CYCLE FOR EVERY KAGGLE EXERCISE
  // -------------------------------------------------------------
  function updateKinematics(time: number, type: ExerciseMotionType, rig: any, eqGroup: THREE.Group) {
    const cycle = (Math.sin(time * 2.2) + 1) / 2; // 0.0 (bottom/stretch) to 1.0 (lockout/contraction)
    const barbell = eqGroup.getObjectByName('dynamicBarbell');
    const dbL = eqGroup.getObjectByName('dumbbellLeft');
    const dbR = eqGroup.getObjectByName('dumbbellRight');

    // Pulse target muscle EMG excitation glow
    sceneState.current.muscleMeshes.forEach(item => {
      if (item.isPrimary) {
        const mat = item.mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.5 + cycle * 0.7;
      }
    });

    let currentAngles = { primaryJoint: 'Elbow Flexion', angle: 90, secondaryJoint: 'Shoulder Angle', angle2: 45 };

    // Reset default limbs
    rig.root.rotation.set(0, 0, 0);
    rig.root.position.set(0, 0, 0);
    rig.pelvisGroup.rotation.set(0, 0, 0);
    rig.torsoGroup.rotation.set(0, 0, 0);
    rig.leftHip.rotation.set(0, 0, 0);
    rig.rightHip.rotation.set(0, 0, 0);
    rig.leftKnee.rotation.set(0, 0, 0);
    rig.rightKnee.rotation.set(0, 0, 0);

    if (type === 'bench' || type === 'incline_bench' || type === 'decline_bench') {
      const pitch = type === 'incline_bench' ? -Math.PI / 3 : type === 'decline_bench' ? -Math.PI / 1.7 : -Math.PI / 2;
      rig.root.position.set(0, -0.05, 0);
      rig.root.rotation.set(pitch, 0, 0);

      const pressAngle = (1 - cycle) * 1.1;
      rig.leftShoulder.rotation.set(-0.3 + (1 - cycle) * 0.5, 0, -0.4 - (1 - cycle) * 0.4);
      rig.leftElbow.rotation.x = -pressAngle;
      rig.rightShoulder.rotation.set(-0.3 + (1 - cycle) * 0.5, 0, 0.4 + (1 - cycle) * 0.4);
      rig.rightElbow.rotation.x = -pressAngle;

      if (barbell) {
        barbell.position.set(0, 0.15 + cycle * 0.45, 0);
      }

      currentAngles = {
        primaryJoint: 'Elbow Flexion',
        angle: Math.round(90 + (1 - cycle) * 45),
        secondaryJoint: 'Shoulder Abduction',
        angle2: Math.round(45 + (1 - cycle) * 25),
      };
    } else if (type === 'pushup') {
      rig.root.position.set(0, -1.35 + cycle * 0.25, 0);
      rig.root.rotation.set(-Math.PI / 2, 0, 0);

      const pushAngle = (1 - cycle) * 1.3;
      rig.leftShoulder.rotation.set(0, 0, -0.5 - (1 - cycle) * 0.3);
      rig.leftElbow.rotation.x = -pushAngle;
      rig.rightShoulder.rotation.set(0, 0, 0.5 + (1 - cycle) * 0.3);
      rig.rightElbow.rotation.x = -pushAngle;

      currentAngles = {
        primaryJoint: 'Elbow Depth Angle',
        angle: Math.round(90 + (1 - cycle) * 60),
        secondaryJoint: 'Spine Alignment',
        angle2: 180,
      };
    } else if (type === 'dips') {
      const dipDepth = (1 - cycle) * 0.4;
      rig.root.position.y = 0.3 - dipDepth;
      rig.torsoGroup.rotation.x = 0.3; // forward chest lean

      const elbowDip = (1 - cycle) * 1.5;
      rig.leftShoulder.rotation.set(-0.2, 0, -0.3);
      rig.leftElbow.rotation.x = -elbowDip;
      rig.rightShoulder.rotation.set(-0.2, 0, 0.3);
      rig.rightElbow.rotation.x = -elbowDip;

      currentAngles = {
        primaryJoint: 'Elbow Flexion',
        angle: Math.round(90 + (1 - cycle) * 45),
        secondaryJoint: 'Torso Incline',
        angle2: 30,
      };
    } else if (type === 'chest_fly') {
      const flySweep = cycle * 1.2;
      rig.leftShoulder.rotation.set(0, -flySweep, -0.2);
      rig.leftElbow.rotation.x = -0.35;
      rig.rightShoulder.rotation.set(0, flySweep, 0.2);
      rig.rightElbow.rotation.x = -0.35;

      currentAngles = {
        primaryJoint: 'Pectoral Adduction',
        angle: Math.round(cycle * 90),
        secondaryJoint: 'Elbow Angle (Fixed)',
        angle2: 145,
      };
    } else if (type === 'squat') {
      const depth = (1 - cycle) * 0.75;
      rig.root.position.y = -depth * 0.9;

      const kneeBend = (1 - cycle) * 1.7;
      rig.leftHip.rotation.x = -(1 - cycle) * 1.3;
      rig.leftKnee.rotation.x = kneeBend;
      rig.rightHip.rotation.x = -(1 - cycle) * 1.3;
      rig.rightKnee.rotation.x = kneeBend;

      rig.torsoGroup.rotation.x = (1 - cycle) * 0.5;
      rig.leftShoulder.rotation.set(0.4, 0, -1.2);
      rig.leftElbow.rotation.x = -1.6;
      rig.rightShoulder.rotation.set(0.4, 0, 1.2);
      rig.rightElbow.rotation.x = -1.6;

      if (barbell) {
        barbell.position.set(0, 1.05 - depth * 0.9, -0.08);
      }

      currentAngles = {
        primaryJoint: 'Knee Flexion',
        angle: Math.round(180 - kneeBend * 57.3),
        secondaryJoint: 'Hip Hinge Depth',
        angle2: Math.round(180 - (1 - cycle) * 75),
      };
    } else if (type === 'deadlift' || type === 'rdl') {
      const hinge = (1 - cycle) * 1.2;
      rig.root.position.y = -(1 - cycle) * 0.25;

      rig.pelvisGroup.rotation.x = hinge;
      rig.leftHip.rotation.x = -hinge * 0.3;
      rig.leftKnee.rotation.x = type === 'deadlift' ? hinge * 0.5 : hinge * 0.2;
      rig.rightHip.rotation.x = -hinge * 0.3;
      rig.rightKnee.rotation.x = type === 'deadlift' ? hinge * 0.5 : hinge * 0.2;

      rig.leftShoulder.rotation.x = 0;
      rig.leftElbow.rotation.x = -0.1;
      rig.rightShoulder.rotation.x = 0;
      rig.rightElbow.rotation.x = -0.1;

      if (barbell) {
        barbell.position.set(0, -0.4 + cycle * 0.8, 0.45 - hinge * 0.2);
      }

      currentAngles = {
        primaryJoint: 'Hip Hinge Angle',
        angle: Math.round(180 - hinge * 57.3),
        secondaryJoint: 'Spine Neutrality',
        angle2: 180,
      };
    } else if (type === 'hip_thrust') {
      rig.root.position.set(0, -0.45, 0);
      rig.torsoGroup.rotation.x = -(1 - cycle) * 0.8;
      rig.pelvisGroup.position.y = (cycle - 1) * 0.35;
      rig.leftKnee.rotation.x = 1.6;
      rig.rightKnee.rotation.x = 1.6;

      if (barbell) {
        barbell.position.set(0, -0.1 + cycle * 0.35, 0.15);
      }

      currentAngles = {
        primaryJoint: 'Hip Extension',
        angle: Math.round(180 - (1 - cycle) * 60),
        secondaryJoint: 'Glute Peak Tension',
        angle2: Math.round(cycle * 100),
      };
    } else if (type === 'leg_extension') {
      const legExt = cycle * 1.5;
      rig.leftHip.rotation.x = -1.4;
      rig.rightHip.rotation.x = -1.4;
      rig.leftKnee.rotation.x = 1.5 - legExt;
      rig.rightKnee.rotation.x = 1.5 - legExt;

      currentAngles = {
        primaryJoint: 'Knee Extension',
        angle: Math.round(90 + cycle * 90),
        secondaryJoint: 'Quad Peak Squeeze',
        angle2: Math.round(cycle * 100),
      };
    } else if (type === 'shoulder_press') {
      const overhead = cycle * 2.1;
      rig.leftShoulder.rotation.set(-overhead * 0.6, 0, -0.4 - overhead * 0.6);
      rig.leftElbow.rotation.x = -(1 - cycle) * 1.6;
      rig.rightShoulder.rotation.set(-overhead * 0.6, 0, 0.4 + overhead * 0.6);
      rig.rightElbow.rotation.x = -(1 - cycle) * 1.6;

      if (barbell) {
        barbell.position.set(0, 0.9 + cycle * 0.85, 0.15);
      }

      currentAngles = {
        primaryJoint: 'Elbow Lockout',
        angle: Math.round(90 + cycle * 85),
        secondaryJoint: 'Shoulder Elevation',
        angle2: Math.round(cycle * 180),
      };
    } else if (type === 'lateral_raise') {
      const raise = cycle * 1.5;
      rig.leftShoulder.rotation.z = -raise;
      rig.rightShoulder.rotation.z = raise;
      rig.leftElbow.rotation.x = -0.2;
      rig.rightElbow.rotation.x = -0.2;

      if (dbL && dbR) {
        dbL.position.set(-0.5 - cycle * 0.5, 0.1 + cycle * 0.7, 0);
        dbR.position.set(0.5 + cycle * 0.5, 0.1 + cycle * 0.7, 0);
      }

      currentAngles = {
        primaryJoint: 'Shoulder Abduction',
        angle: Math.round(cycle * 90),
        secondaryJoint: 'Side Delt Load',
        angle2: Math.round(cycle * 100),
      };
    } else if (type === 'pullup' || type === 'lat_pulldown') {
      const pull = cycle * 1.8;
      if (type === 'pullup') rig.root.position.y = cycle * 0.65;
      rig.leftShoulder.rotation.set(0, 0, -2.4 + pull * 0.6);
      rig.leftElbow.rotation.x = -pull;
      rig.rightShoulder.rotation.set(0, 0, 2.4 - pull * 0.6);
      rig.rightElbow.rotation.x = -pull;

      currentAngles = {
        primaryJoint: 'Elbow Flexion',
        angle: Math.round(170 - pull * 50),
        secondaryJoint: 'Scapular Depression',
        angle2: Math.round(cycle * 45),
      };
    } else if (type === 'row') {
      const hinge = 0.8;
      rig.pelvisGroup.rotation.x = hinge;
      const rowPull = cycle * 1.4;
      rig.leftShoulder.rotation.x = -rowPull * 0.5;
      rig.leftElbow.rotation.x = -rowPull;
      rig.rightShoulder.rotation.x = -rowPull * 0.5;
      rig.rightElbow.rotation.x = -rowPull;

      if (barbell) {
        barbell.position.set(0, -0.2 + cycle * 0.45, 0.35);
      }

      currentAngles = {
        primaryJoint: 'Elbow Pull Angle',
        angle: Math.round(180 - rowPull * 60),
        secondaryJoint: 'Scapular Retraction',
        angle2: Math.round(cycle * 40),
      };
    } else if (type === 'bicep_curl' || type === 'hammer_curl') {
      const curl = cycle * 2.3;
      rig.leftShoulder.rotation.set(0, 0, -0.2);
      rig.leftElbow.rotation.x = -curl;
      rig.rightShoulder.rotation.set(0, 0, 0.2);
      rig.rightElbow.rotation.x = -curl;

      if (barbell && type === 'bicep_curl') {
        barbell.position.set(0, 0.2 + cycle * 0.45, 0.35 + cycle * 0.15);
      }
      if (dbL && dbR) {
        dbL.position.set(-0.52, 0.45 - (1 - cycle) * 0.4, 0.2 + cycle * 0.25);
        dbR.position.set(0.52, 0.45 - (1 - cycle) * 0.4, 0.2 + cycle * 0.25);
      }

      currentAngles = {
        primaryJoint: 'Bicep Elbow Angle',
        angle: Math.round(160 - cycle * 115),
        secondaryJoint: 'Peak Contraction',
        angle2: Math.round(cycle * 100),
      };
    } else if (type === 'tricep_pushdown') {
      const extend = cycle * 1.8;
      rig.leftShoulder.rotation.set(-0.2, 0, -0.1);
      rig.leftElbow.rotation.x = -(1.8 - extend);
      rig.rightShoulder.rotation.set(-0.2, 0, 0.1);
      rig.rightElbow.rotation.x = -(1.8 - extend);

      currentAngles = {
        primaryJoint: 'Tricep Extension',
        angle: Math.round(80 + cycle * 95),
        secondaryJoint: 'Triceps Long Head',
        angle2: Math.round(cycle * 100),
      };
    } else if (type === 'plank') {
      rig.root.position.set(0, -1.4, 0);
      rig.root.rotation.set(-Math.PI / 2, 0, 0);
      rig.leftElbow.rotation.x = -1.5;
      rig.rightElbow.rotation.x = -1.5;

      currentAngles = {
        primaryJoint: 'Core Isometric Brace',
        angle: 180,
        secondaryJoint: 'Anti-Extension Force',
        angle2: 100,
      };
    } else if (type === 'leg_raise') {
      const raise = cycle * 1.5;
      rig.leftHip.rotation.x = -raise;
      rig.rightHip.rotation.x = -raise;
      rig.leftKnee.rotation.x = 0.2;
      rig.rightKnee.rotation.x = 0.2;

      currentAngles = {
        primaryJoint: 'Hip Flexion',
        angle: Math.round(180 - raise * 57.3),
        secondaryJoint: 'Lower Rectus Abdominis',
        angle2: Math.round(cycle * 100),
      };
    } else if (type === 'russian_twist') {
      rig.root.position.set(0, -1.2, 0);
      rig.torsoGroup.rotation.x = 0.6; // 45 lean back
      const twist = Math.sin(time * 3) * 0.7;
      rig.torsoGroup.rotation.y = twist;

      currentAngles = {
        primaryJoint: 'Thoracic Rotation',
        angle: Math.round(twist * 57.3),
        secondaryJoint: 'Oblique Contraction',
        angle2: 85,
      };
    } else {
      rig.leftShoulder.rotation.x = Math.sin(time * 2) * 0.3;
      rig.rightShoulder.rotation.x = -Math.sin(time * 2) * 0.3;

      currentAngles = {
        primaryJoint: 'Motion Vector',
        angle: Math.round(75 + cycle * 30),
        secondaryJoint: 'Kinematic Flow',
        angle2: 90,
      };
    }

    setJointAngleData(currentAngles);
    if (onAngleUpdate) onAngleUpdate(currentAngles);
  }

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col ${className}`}>
      {/* 3D Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-black tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            3D Biomechanical Human Simulation
          </span>
        </div>

        {/* View Angle Presets */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
          {(['perspective', 'front', 'side', 'top'] as const).map(view => (
            <button
              key={view}
              onClick={() => setCameraPreset(view)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                cameraView === view
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {view === 'perspective' ? '3D Orbit' : view}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="relative w-full aspect-video sm:aspect-[16/10] max-h-[460px] bg-slate-950 cursor-grab active:cursor-grabbing select-none overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />

        {/* Muscle EMG Real-Time Badge HUD */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-2">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 text-xs shadow-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Primary Muscle Excitation
            </span>
            <span className="text-emerald-400 font-extrabold flex items-center gap-1.5 text-sm">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              {primaryMuscle} (High EMG)
            </span>
          </div>

          {secondaryMuscles && (
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-[11px] text-cyan-300">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Synergists</span>
              <span>{secondaryMuscles}</span>
            </div>
          )}
        </div>

        {/* Real-time Joint Angle HUD Overlay */}
        {showJointAngles && (
          <div className="absolute top-4 right-4 z-10 pointer-events-none space-y-2">
            <div className="px-3 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-right shadow-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {jointAngleData.primaryJoint}
              </span>
              <span className="text-lg font-black text-white font-mono">
                {jointAngleData.angle}°
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-right">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                {jointAngleData.secondaryJoint}
              </span>
              <span className="text-xs font-bold text-cyan-400 font-mono">
                {jointAngleData.angle2}°
              </span>
            </div>
          </div>
        )}

        {/* 3D Viewport Controls Floating Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-slate-800 shadow-2xl">
          {/* Left: Play / Pause / Speed */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInternalPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 hover:scale-105"
              title={isPlaying ? 'Pause 3D Cycle' : 'Play 3D Cycle'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <div className="flex items-center bg-slate-900 px-1.5 py-1 rounded-xl border border-slate-800">
              {[0.5, 1.0, 1.5].map(spd => (
                <button
                  key={spd}
                  onClick={() => setInternalSpeed(spd)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                    playbackSpeed === spd
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Zoom In / Out */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 px-1.5 py-1 rounded-xl border border-slate-800">
              <button
                onClick={() => handleZoom(-0.8)}
                className="p-1 rounded text-slate-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleZoom(0.8)}
                className="p-1 rounded text-slate-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Render Mode & HUD Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRenderMode(renderMode === 'heatmap' ? 'hologram' : 'heatmap')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                renderMode === 'hologram'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{renderMode === 'hologram' ? 'Hologram Mode' : 'EMG Heatmap'}</span>
            </button>

            <button
              onClick={() => setShowJointAngles(!showJointAngles)}
              className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                showJointAngles
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
              title="Toggle Joint Degrees HUD"
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 3D Guidance Bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span>💡 Click & Drag anywhere on the 3D model to rotate 360° • Scroll to zoom</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300 font-semibold">Equipment: <strong className="text-white">{equipment}</strong></span>
          <span className="text-slate-300 font-semibold">Tempo: <strong className="text-emerald-400 font-mono">{tempo}</strong></span>
        </div>
      </div>
    </div>
  );
}
