import * as THREE from 'three';
import { select, slider } from '../common/ui';
import { Rnl, constants, realOrbital } from '../common/hydrogenic';
import { cartesianGrid, thresholdForProbability } from '../common/grids';
import { setupScene, buildIsosurface } from '../common/marching';

const controls = document.getElementById('controls')!;
const plot = document.getElementById('plot')!;
plot.className = 'canvas3d';
const caption = document.getElementById('caption')!;
caption.textContent = 'FIGURE 1.15 Boundary surfaces of d orbitals with nodal planes.';

const orbitalSel = select(controls, 'orbital', ['dxy', 'dxz', 'dyz', 'dx2y2', 'dz2'], 'dz2');
const nSlider = slider(controls, 'n', 3, 5, 3);
const zSlider = slider(controls, 'Z', 1, 3, 1);
const pSlider = slider(controls, 'prob', 0.5, 0.95, 0.9, 0.01);
const qSlider = slider(controls, 'quality', 30, 80, 50);

const { scene } = setupScene(plot);
let posMesh: THREE.Object3D | null = null;
let negMesh: THREE.Object3D | null = null;

const render = () => {
  const name = orbitalSel.value;
  const n = parseInt(nSlider.value, 10);
  const Z = parseInt(zSlider.value, 10);
  const prob = parseFloat(pSlider.value);
  const N = parseInt(qSlider.value, 10);

  const L = 14 * constants.a0;
  const xs = cartesianGrid(N, L);
  const field = new Float32Array(N * N * N);
  const density = new Float32Array(N * N * N);
  let idx = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      for (let k = 0; k < N; k++) {
        const x = xs[i], y = xs[j], z = xs[k];
        const r = Math.sqrt(x * x + y * y + z * z) + 1e-12;
        const ang = realOrbital(name, x, y, z);
        const val = Rnl(n, 2, r, Z) * ang;
        field[idx] = val;
        density[idx] = val * val;
        idx++;
      }
    }
  }

  const rho0 = thresholdForProbability(density, xs, prob);
  const iso = Math.sqrt(rho0);

  if (posMesh) scene.remove(posMesh);
  if (negMesh) scene.remove(negMesh);

  const pos = buildIsosurface(field, N, iso, 2.0 / N);
  const neg = buildIsosurface(field.map(v => -v), N, iso, 2.0 / N);
  (pos as any).material = new THREE.MeshStandardMaterial({ color: 0xff8a65, transparent: true, opacity: 0.85 });
  (neg as any).material = new THREE.MeshStandardMaterial({ color: 0x6ea8ff, transparent: true, opacity: 0.85 });
  posMesh = pos;
  negMesh = neg;
  scene.add(pos);
  scene.add(neg);
};

[orbitalSel, nSlider, zSlider, pSlider, qSlider].forEach((el) => el.addEventListener('input', render));
render();
