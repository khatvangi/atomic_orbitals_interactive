export const constants = {
  h: 6.62607015e-34,
  c: 299792458,
  me: 9.1093837015e-31,
  e: 1.602176634e-19,
  eps0: 8.8541878128e-12,
  NA: 6.02214076e23,
  a0: 5.29177210903e-11,
};

export const Rydberg = () => {
  const { h, c, me, e, eps0 } = constants;
  return (me * Math.pow(e, 4)) / (8 * Math.pow(eps0, 2) * Math.pow(h, 3) * c);
};

export const energyLevel = (Z: number, n: number) => {
  const { h, c } = constants;
  return -(h * c * Rydberg()) * (Z * Z) / (n * n); // J
};

export const laguerreL = (k: number, alpha: number, x: number) => {
  if (k === 0) return 1;
  if (k === 1) return 1 + alpha - x;
  let Lkm1 = 1;
  let Lk = 1 + alpha - x;
  for (let n = 1; n < k; n++) {
    const Lkp1 = ((2 * n + 1 + alpha - x) * Lk - (n + alpha) * Lkm1) / (n + 1);
    Lkm1 = Lk;
    Lk = Lkp1;
  }
  return Lk;
};

const factorial = (n: number) => {
  let v = 1;
  for (let i = 2; i <= n; i++) v *= i;
  return v;
};

export const Rnl = (n: number, l: number, r: number, Z = 1) => {
  const rho = (2 * Z * r) / (n * constants.a0);
  const pref = Math.pow(2 * Z / (n * constants.a0), 1.5) * Math.sqrt(factorial(n - l - 1) / (2 * n * factorial(n + l)));
  return pref * Math.exp(-rho / 2) * Math.pow(rho, l) * laguerreL(n - l - 1, 2 * l + 1, rho);
};

const legendreP = (l: number, m: number, x: number) => {
  if (m < 0) return Math.pow(-1, m) * (factorial(l - m) / factorial(l + m)) * legendreP(l, -m, x);
  let pmm = 1;
  if (m > 0) {
    let somx2 = Math.sqrt((1 - x) * (1 + x));
    let fact = 1;
    for (let i = 1; i <= m; i++) {
      pmm *= -fact * somx2;
      fact += 2;
    }
  }
  if (l === m) return pmm;
  let pmmp1 = x * (2 * m + 1) * pmm;
  if (l === m + 1) return pmmp1;
  let pll = 0;
  for (let ll = m + 2; ll <= l; ll++) {
    pll = ((2 * ll - 1) * x * pmmp1 - (ll + m - 1) * pmm) / (ll - m);
    pmm = pmmp1;
    pmmp1 = pll;
  }
  return pll;
};

export const Ylm = (l: number, m: number, theta: number, phi: number) => {
  const norm = Math.sqrt(((2 * l + 1) / (4 * Math.PI)) * (factorial(l - Math.abs(m)) / factorial(l + Math.abs(m))));
  const P = legendreP(l, Math.abs(m), Math.cos(theta));
  // return complex as [re, im]
  const re = norm * P * Math.cos(m * phi) * Math.pow(-1, m);
  const im = norm * P * Math.sin(m * phi) * Math.pow(-1, m);
  return { re, im };
};

export const YlmReal = (l: number, m: number, theta: number, phi: number) => {
  if (m === 0) return Ylm(l, 0, theta, phi).re;
  if (m > 0) return Math.sqrt(2) * Math.pow(-1, m) * Ylm(l, m, theta, phi).re;
  return Math.sqrt(2) * Math.pow(-1, m) * Ylm(l, -m, theta, phi).im;
};

export const psi = (n: number, l: number, m: number, r: number, theta: number, phi: number, Z = 1) => {
  const R = Rnl(n, l, r, Z);
  const Y = Ylm(l, m, theta, phi);
  return { re: R * Y.re, im: R * Y.im };
};

export const rho = (n: number, l: number, m: number, r: number, theta: number, phi: number, Z = 1) => {
  const p = psi(n, l, m, r, theta, phi, Z);
  return p.re * p.re + p.im * p.im;
};

export const radialDistribution = (n: number, l: number, r: number, Z = 1) => {
  const R = Rnl(n, l, r, Z);
  return r * r * R * R;
};

export const nodeCounts = (n: number, l: number) => ({ total: n - 1, radial: n - l - 1, angular: l });

export const realOrbital = (name: string, x: number, y: number, z: number) => {
  const r2 = x * x + y * y + z * z;
  if (r2 === 0) return 0;
  if (name === 'px') return x / Math.sqrt(r2);
  if (name === 'py') return y / Math.sqrt(r2);
  if (name === 'pz') return z / Math.sqrt(r2);
  if (name === 'dz2') return (3 * z * z - r2) / r2;
  if (name === 'dx2y2') return (x * x - y * y) / r2;
  if (name === 'dxy') return (x * y) / r2;
  if (name === 'dxz') return (x * z) / r2;
  if (name === 'dyz') return (y * z) / r2;
  if (name === 'fz3') return (z * (5 * z * z - 3 * r2)) / Math.pow(r2, 1.5);
  if (name === 'fxz2') return (x * (5 * z * z - r2)) / Math.pow(r2, 1.5);
  if (name === 'fyz2') return (y * (5 * z * z - r2)) / Math.pow(r2, 1.5);
  if (name === 'fxyz') return (x * y * z) / Math.pow(r2, 1.5);
  if (name === 'fzx2y2') return (z * (x * x - y * y)) / Math.pow(r2, 1.5);
  if (name === 'fxx23y2') return (x * (x * x - 3 * y * y)) / Math.pow(r2, 1.5);
  if (name === 'fy3x2y2') return (y * (3 * x * x - y * y)) / Math.pow(r2, 1.5);
  return 0;
};
