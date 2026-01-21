import * as THREE from 'three';
import { slider } from '../common/ui';
import { radialThresholdS } from '../common/grids';
import { constants } from '../common/hydrogenic';
import { setupScene } from '../common/marching';

const controls = document.getElementById('controls')!;
const plot = document.getElementById('plot')!;
plot.className = 'canvas3d';
const caption = document.getElementById('caption')!;
caption.textContent = 'FIGURE 1.13 S orbital boundary surface (default 90% probability).';

const nSlider = slider(controls, 'n', 1, 3, 1);
const zSlider = slider(controls, 'Z', 1, 3, 1);
const pSlider = slider(controls, 'prob', 0.5, 0.99, 0.9, 0.01);

const { scene } = setupScene(plot);
let sphere: THREE.Mesh | null = null;

const render = () => {
  const n = parseInt(nSlider.value, 10);
  const Z = parseInt(zSlider.value, 10);
  const prob = parseFloat(pSlider.value);
  const r0 = radialThresholdS(n, Z, prob);
  const radius = r0 / constants.a0; // in a0 units

  if (sphere) scene.remove(sphere);
  const geometry = new THREE.SphereGeometry(radius, 48, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0x7b6ee8, transparent: true, opacity: 0.7 });
  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
};

[nSlider, zSlider, pSlider].forEach((el) => el.addEventListener('input', render));
render();
