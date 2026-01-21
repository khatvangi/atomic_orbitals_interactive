import Plotly from 'plotly.js-dist-min';
import { slider } from '../common/ui';

const controls = document.getElementById('controls')!;
const plot = document.getElementById('plot')!;
const caption = document.getElementById('caption')!;
caption.textContent = 'FIGURE 1.7 Spherical polar coordinates: r, θ (colatitude), φ (azimuth).';

const rSlider = slider(controls, 'r', 1, 5, 3, 0.1);
const thetaSlider = slider(controls, 'θ', 0, 180, 60, 1);
const phiSlider = slider(controls, 'φ', 0, 360, 45, 1);

const compute = () => {
  const r = parseFloat(rSlider.value);
  const theta = (parseFloat(thetaSlider.value) * Math.PI) / 180;
  const phi = (parseFloat(phiSlider.value) * Math.PI) / 180;
  const x = r * Math.sin(theta) * Math.cos(phi);
  const y = r * Math.sin(theta) * Math.sin(phi);
  const z = r * Math.cos(theta);

  const axes = [
    { x: [0, r], y: [0, 0], z: [0, 0], name: 'x' },
    { x: [0, 0], y: [0, r], z: [0, 0], name: 'y' },
    { x: [0, 0], y: [0, 0], z: [0, r], name: 'z' },
  ];

  const data: any[] = axes.map((a) => ({
    type: 'scatter3d',
    mode: 'lines',
    x: a.x,
    y: a.y,
    z: a.z,
    line: { width: 4 },
    name: a.name,
    showlegend: false
  }));

  data.push({
    type: 'scatter3d',
    mode: 'markers',
    x: [x],
    y: [y],
    z: [z],
    marker: { size: 6, color: '#e67e22' },
    name: 'point'
  });

  Plotly.newPlot(plot, data, {
    margin: { l: 0, r: 0, t: 0, b: 0 },
    scene: { xaxis: { title: 'x' }, yaxis: { title: 'y' }, zaxis: { title: 'z' } }
  }, { displayModeBar: false });
};

[rSlider, thetaSlider, phiSlider].forEach((el) => el.addEventListener('input', compute));
compute();
