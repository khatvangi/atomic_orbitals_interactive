import Plotly from 'plotly.js-dist-min';
import { radialDistribution, constants } from '../common/hydrogenic';
import { slider } from '../common/ui';

const controls = document.getElementById('controls')!;
const plot = document.getElementById('plot')!;
const caption = document.getElementById('caption')!;
caption.textContent = 'FIGURE 1.11 Radial distribution P(r) for 1s; r_max = a₀/Z.';

const zSlider = slider(controls, 'Z', 1, 5, 1);

const compute = () => {
  const Z = parseInt(zSlider.value, 10);
  const xs: number[] = [];
  const P: number[] = [];
  for (let i = 0; i <= 300; i++) {
    const r = (8 * constants.a0 * i) / 300;
    xs.push(r / constants.a0);
    P.push(radialDistribution(1, 0, r, Z));
  }
  const rmax = constants.a0 / Z;
  Plotly.newPlot(plot, [
    { x: xs, y: P, mode: 'lines', name: 'P(r)', line: { color: '#1f6f8b' } },
    { x: [rmax / constants.a0, rmax / constants.a0], y: [0, Math.max(...P)], mode: 'lines', line: { dash: 'dot', color: '#e67e22' }, name: 'r_max' }
  ], {
    margin: { l: 60, r: 20, t: 20, b: 40 },
    xaxis: { title: 'r/a₀' },
    yaxis: { title: 'P(r)' },
    legend: { orientation: 'h' }
  }, { displayModeBar: false });
};

zSlider.addEventListener('input', compute);
compute();
