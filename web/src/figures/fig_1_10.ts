import Plotly from 'plotly.js-dist-min';
import { Rnl, radialDistribution, constants } from '../common/hydrogenic';
import { slider } from '../common/ui';

const controls = document.getElementById('controls')!;
const plot = document.getElementById('plot')!;
const caption = document.getElementById('caption')!;
caption.textContent = 'FIGURE 1.10 s‑orbitals showing radial nodes (roots of R_n0).';

const nSlider = slider(controls, 'n', 1, 4, 3);
const zSlider = slider(controls, 'Z', 1, 3, 1);

const findNodes = (n: number, Z: number) => {
  const nodes: number[] = [];
  let prev = Rnl(n, 0, 1e-6, Z);
  for (let i = 1; i <= 800; i++) {
    const r = (i / 800) * (20 * constants.a0);
    const v = Rnl(n, 0, r, Z);
    if (prev === 0) prev = v;
    if (prev * v < 0) nodes.push(r);
    prev = v;
  }
  return nodes;
};

const compute = () => {
  const n = parseInt(nSlider.value, 10);
  const Z = parseInt(zSlider.value, 10);
  const xs: number[] = [];
  const P: number[] = [];
  for (let i = 0; i <= 400; i++) {
    const r = (20 * constants.a0 * i) / 400;
    xs.push((Z * r) / constants.a0);
    P.push(radialDistribution(n, 0, r, Z));
  }

  const nodes = findNodes(n, Z).map((r) => (Z * r) / constants.a0);

  const traces: any[] = [
    { x: xs, y: P, mode: 'lines', name: `P(r) ${n}s`, line: { color: '#5a4ea3' } }
  ];
  nodes.forEach((x, i) => {
    traces.push({ x: [x, x], y: [0, Math.max(...P)], mode: 'lines', name: `node ${i+1}`, line: { dash: 'dot', color: '#e67e22' }, showlegend: false });
  });

  Plotly.newPlot(plot, traces, {
    margin: { l: 60, r: 20, t: 20, b: 40 },
    xaxis: { title: 'x = Zr/a₀' },
    yaxis: { title: 'P(r)' },
    legend: { orientation: 'h' }
  }, { displayModeBar: false });
};

[nSlider, zSlider].forEach((el) => el.addEventListener('input', compute));
compute();
