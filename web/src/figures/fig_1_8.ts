import Plotly from 'plotly.js-dist-min';
import { Rnl, constants } from '../common/hydrogenic';
import { slider, checkbox } from '../common/ui';

const controls = document.getElementById('controls')!;
const plot = document.getElementById('plot')!;
const caption = document.getElementById('caption')!;
caption.textContent = 'FIGURE 1.8 Radial wavefunctions R_n0 for 1s, 2s, 3s vs x=Zr/a₀.';

const zSlider = slider(controls, 'Z', 1, 3, 1);
const show1 = checkbox(controls, '1s', true);
const show2 = checkbox(controls, '2s', true);
const show3 = checkbox(controls, '3s', true);

const compute = () => {
  const Z = parseInt(zSlider.value, 10);
  const xs: number[] = [];
  const r1: number[] = [];
  const r2: number[] = [];
  const r3: number[] = [];
  for (let i = 0; i <= 300; i++) {
    const x = (30 * i) / 300;
    const r = (x * constants.a0) / Z;
    xs.push(x);
    r1.push(Rnl(1, 0, r, Z));
    r2.push(Rnl(2, 0, r, Z));
    r3.push(Rnl(3, 0, r, Z));
  }

  const traces: any[] = [];
  if (show1.checked) traces.push({ x: xs, y: r1, mode: 'lines', name: '1s', line: { color: '#c0392b' } });
  if (show2.checked) traces.push({ x: xs, y: r2, mode: 'lines', name: '2s', line: { color: '#2ecc71' } });
  if (show3.checked) traces.push({ x: xs, y: r3, mode: 'lines', name: '3s', line: { color: '#2980b9' } });

  Plotly.newPlot(plot, traces, {
    margin: { l: 60, r: 20, t: 20, b: 40 },
    xaxis: { title: 'x = Zr/a₀' },
    yaxis: { title: 'R_n0' },
    legend: { orientation: 'h' }
  }, { displayModeBar: false });
};

[zSlider, show1, show2, show3].forEach((el) => el.addEventListener('input', compute));
compute();
