import Plotly from 'plotly.js-dist-min';
import { radialDistribution, constants } from '../common/hydrogenic';
import { slider } from '../common/ui';

const controls = document.getElementById('controls')!;
const plot = document.getElementById('plot')!;
const caption = document.getElementById('caption')!;
caption.textContent = 'FIGURE 1.12 Radial distributions for 2s and 2p.';

const zSlider = slider(controls, 'Z', 1, 5, 1);

const compute = () => {
  const Z = parseInt(zSlider.value, 10);
  const xs: number[] = [];
  const P2s: number[] = [];
  const P2p: number[] = [];
  for (let i = 0; i <= 400; i++) {
    const r = (15 * constants.a0 * i) / 400;
    xs.push((Z * r) / constants.a0);
    P2s.push(radialDistribution(2, 0, r, Z));
    P2p.push(radialDistribution(2, 1, r, Z));
  }
  Plotly.newPlot(plot, [
    { x: xs, y: P2s, mode: 'lines', name: '2s', line: { color: '#2ecc71' } },
    { x: xs, y: P2p, mode: 'lines', name: '2p', line: { color: '#9b59b6' } }
  ], {
    margin: { l: 60, r: 20, t: 20, b: 40 },
    xaxis: { title: 'x = Zr/a₀' },
    yaxis: { title: 'P(r)' },
    legend: { orientation: 'h' }
  }, { displayModeBar: false });
};

zSlider.addEventListener('input', compute);
compute();
