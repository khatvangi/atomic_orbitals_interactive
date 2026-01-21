import Plotly from 'plotly.js-dist-min';
import { slider } from '../common/ui';

const controls = document.getElementById('controls')!;
const plot = document.getElementById('plot')!;
const caption = document.getElementById('caption')!;
caption.textContent = 'FIGURE 1.4 Constructive and destructive interference: ψtot and |ψtot|².';

const phaseSlider = slider(controls, 'Δφ', 0, 360, 0, 1);
const shiftSlider = slider(controls, 'shift', -10, 10, 0, 1);
const ampSlider = slider(controls, 'A2/A1', 0, 2, 1, 0.1);

const compute = () => {
  const phase = (parseFloat(phaseSlider.value) * Math.PI) / 180;
  const shift = parseFloat(shiftSlider.value) / 10;
  const amp2 = parseFloat(ampSlider.value);

  const xs: number[] = [];
  const psi1: number[] = [];
  const psi2: number[] = [];
  const psit: number[] = [];
  const rho: number[] = [];

  for (let i = 0; i <= 400; i++) {
    const x = -10 + (20 * i) / 400;
    const w = 2 * Math.PI * 0.6;
    const p1 = Math.sin(w * x);
    const p2 = amp2 * Math.sin(w * (x - shift) + phase);
    const pt = p1 + p2;
    xs.push(x);
    psi1.push(p1);
    psi2.push(p2);
    psit.push(pt);
    rho.push(pt * pt);
  }

  Plotly.newPlot(plot, [
    { x: xs, y: psi1, name: 'ψ₁', mode: 'lines', line: { color: '#1f6f8b' } },
    { x: xs, y: psi2, name: 'ψ₂', mode: 'lines', line: { color: '#5a4ea3' } },
    { x: xs, y: psit, name: 'ψtot', mode: 'lines', line: { color: '#b86b0f' } },
    { x: xs, y: rho, name: '|ψtot|²', mode: 'lines', line: { color: '#2ecc71' } }
  ], {
    margin: { l: 50, r: 20, t: 20, b: 40 },
    xaxis: { title: 'x' },
    yaxis: { title: 'Amplitude / Density' },
    legend: { orientation: 'h' }
  }, { displayModeBar: false });
};

[phaseSlider, shiftSlider, ampSlider].forEach((el) => el.addEventListener('input', compute));
compute();
