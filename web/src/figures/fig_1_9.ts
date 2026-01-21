import Plotly from 'plotly.js-dist-min';
import { Rnl, constants } from '../common/hydrogenic';
import { slider } from '../common/ui';

const controls = document.getElementById('controls')!;
const plot = document.getElementById('plot')!;
const caption = document.getElementById('caption')!;
caption.textContent = 'FIGURE 1.9 Radial wavefunctions R_n1 for 2p and 3p.';

const zSlider = slider(controls, 'Z', 1, 3, 1);

const compute = () => {
  const Z = parseInt(zSlider.value, 10);
  const xs: number[] = [];
  const r2: number[] = [];
  const r3: number[] = [];
  for (let i = 0; i <= 300; i++) {
    const x = (30 * i) / 300;
    const r = (x * constants.a0) / Z;
    xs.push(x);
    r2.push(Rnl(2, 1, r, Z));
    r3.push(Rnl(3, 1, r, Z));
  }
  Plotly.newPlot(plot, [
    { x: xs, y: r2, mode: 'lines', name: '2p', line: { color: '#9b59b6' } },
    { x: xs, y: r3, mode: 'lines', name: '3p', line: { color: '#16a085' } }
  ], {
    margin: { l: 60, r: 20, t: 20, b: 40 },
    xaxis: { title: 'x = Zr/a₀' },
    yaxis: { title: 'R_n1' },
    legend: { orientation: 'h' }
  }, { displayModeBar: false });
};

zSlider.addEventListener('input', compute);
compute();
