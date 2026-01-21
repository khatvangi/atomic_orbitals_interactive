import { describe, it, expect } from 'vitest';
import { Rnl, radialDistribution, energyLevel, constants } from '@src/common/hydrogenic';

const integrateRadial = (fn: (r: number) => number, rmax: number, steps = 20000) => {
  const dr = rmax / steps;
  let sum = 0;
  for (let i = 0; i <= steps; i++) {
    const r = i * dr;
    sum += fn(r) * dr;
  }
  return sum;
};

describe('Hydrogenic basics', () => {
  it('1s most probable radius near a0/Z', () => {
    const Z = 1;
    let rMax = 0;
    let maxVal = -1;
    for (let i = 0; i <= 5000; i++) {
      const r = (10 * constants.a0 * i) / 5000;
      const p = radialDistribution(1, 0, r, Z);
      if (p > maxVal) { maxVal = p; rMax = r; }
    }
    expect(Math.abs(rMax - constants.a0 / Z) / constants.a0).toBeLessThan(0.1);
  });

  it('2p density at nucleus is zero', () => {
    const r0 = 0;
    const R = Rnl(2, 1, r0, 1);
    expect(Math.abs(R)).toBeLessThan(1e-8);
  });

  it('energy scaling ~ -Z^2/n^2', () => {
    const E1 = energyLevel(1, 1);
    const E2 = energyLevel(2, 1);
    expect(Math.abs(E2 / E1)).toBeCloseTo(4, 2);
  });
});
