import Plotly from 'plotly.js-dist-min';
import { energyLevel, constants } from '../common/hydrogenic';
import { slider, checkbox } from '../common/ui';

const controls = document.getElementById('controls')!;
const plot = document.getElementById('plot')!;
const caption = document.getElementById('caption')!;
caption.textContent = 'FIGURE 1.5 Energy levels for H (Z=1) and He+ (Z=2) with E ∝ −Z²/n².';

const zToggle = checkbox(controls, 'Show Z=2', true);
const nMax = slider(controls, 'n max', 3, 10, 6);

const compute = () => {
  const nmax = parseInt(nMax.value, 10);
  const data: any[] = [];
  const series = [1];
  if (zToggle.checked) series.push(2);

  series.forEach((Z, idx) => {
    for (let n = 1; n <= nmax; n++) {
      const E = energyLevel(Z, n) / constants.e; // eV
      data.push({ x: [Z + idx * 0.15 - 0.2, Z + idx * 0.15 + 0.2], y: [E, E], name: `Z=${Z}, n=${n}` });
    }
  });

  const traces = data.map((d, i) => ({
    x: d.x,
    y: d.y,
    mode: 'lines',
    line: { width: 2 },
    name: d.name,
    showlegend: false
  }));

  Plotly.newPlot(plot, traces, {
    margin: { l: 60, r: 20, t: 20, b: 40 },
    xaxis: { title: 'Z' },
    yaxis: { title: 'Energy (eV)' }
  }, { displayModeBar: false });
};

[nMax, zToggle].forEach((el) => el.addEventListener('input', compute));
compute();
