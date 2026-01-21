import { rho, constants } from './hydrogenic';

export const cartesianGrid = (N: number, L: number) => {
  const xs = new Float32Array(N);
  const step = (2 * L) / (N - 1);
  for (let i = 0; i < N; i++) xs[i] = -L + i * step;
  return xs;
};

export const densityGrid = (n: number, l: number, m: number, Z: number, N: number, L: number) => {
  const xs = cartesianGrid(N, L);
  const data = new Float32Array(N * N * N);
  let idx = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      for (let k = 0; k < N; k++) {
        const x = xs[i], y = xs[j], z = xs[k];
        const r = Math.sqrt(x * x + y * y + z * z);
        let theta = 0, phi = 0;
        if (r > 0) {
          theta = Math.acos(z / r);
          phi = Math.atan2(y, x);
        }
        data[idx++] = rho(n, l, m, r, theta, phi, Z);
      }
    }
  }
  return { xs, data };
};

export const thresholdForProbability = (data: Float32Array, xs: Float32Array, p = 0.9) => {
  const dx = xs[1] - xs[0];
  const dV = dx * dx * dx;
  const vals = Array.from(data).sort((a, b) => b - a);
  const total = vals.reduce((acc, v) => acc + v * dV, 0);
  let acc = 0;
  for (const v of vals) {
    acc += v * dV;
    if (acc / total >= p) return v;
  }
  return vals[vals.length - 1];
};

export const radialThresholdS = (n: number, Z: number, p = 0.9) => {
  // Numeric solve for s orbitals using radial distribution
  const rmax = 40 * constants.a0;
  const steps = 2000;
  const dr = rmax / steps;
  let total = 0;
  const vals: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const r = i * dr;
    const val = 4 * Math.PI * r * r * (Math.pow(rho(n, 0, 0, r, 0, 0, Z), 1));
    total += val * dr;
    vals.push(total);
  }
  for (let i = 0; i <= steps; i++) {
    if (vals[i] / total >= p) return i * dr;
  }
  return rmax;
};
