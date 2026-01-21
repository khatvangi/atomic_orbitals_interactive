import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';

export const buildIsosurface = (
  field: Float32Array,
  size: number,
  level: number,
  scale = 1
) => {
  const mc = new MarchingCubes(size, undefined, true, true);
  mc.isolation = level;
  mc.field = field as unknown as number[]; // MarchingCubes expects number[]
  mc.enableUvs = false;
  mc.enableColors = false;
  mc.scale.set(scale, scale, scale);
  return mc;
};

export const setupScene = (container: HTMLElement) => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#ffffff');
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(2.5, 2.5, 2.5);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1.0);
  light.position.set(3, 3, 3);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const animate = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();

  return { scene, camera, renderer };
};
