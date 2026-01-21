import Plotly from 'plotly.js-dist-min';
import { psi, nodeCounts } from '../common/hydrogenic';
import { slider, dynamicSlider, rangeInput, renderFormula, updateFormula } from '../common/ui';

// dom elements
const controls = document.getElementById('controls')!;
const plot = document.getElementById('plot')!;
const extra = document.getElementById('extra')!;
const caption = document.getElementById('caption')!;

// caption from textbook
caption.innerHTML = `<strong>FIGURE 1.3</strong> The Born interpretation of the wavefunction:
its square is a probability density. There is zero probability density at a node.
The wavefunction ψ can be positive or negative, but ρ = |ψ|² is always ≥ 0.`;

// formula display
const formulaEl = renderFormula(extra, String.raw`\psi_{nlm}(r,\theta,\phi) = R_{nl}(r) \cdot Y_l^m(\theta,\phi), \quad \rho = |\psi|^2`);

// node info display
const nodeInfo = document.createElement('div');
nodeInfo.className = 'node-info';
extra.appendChild(nodeInfo);

// quantum number controls
const nSlider = slider(controls, 'n', 1, 7, 2);

const lControl = dynamicSlider(controls, {
  label: 'ℓ',
  min: 0,
  max: 6,
  value: 0,
  getMax: () => parseInt(nSlider.value, 10) - 1
});

const mControl = dynamicSlider(controls, {
  label: 'm',
  min: -6,
  max: 6,
  value: 0,
  getMin: () => -parseInt(lControl.input.value, 10),
  getMax: () => parseInt(lControl.input.value, 10)
});

const zSlider = slider(controls, 'Z', 1, 10, 1);

// axis range controls
const xRange = rangeInput(controls, 'x range (a₀)', -100, 100, -30, 30, 5);

// helper to get validated quantum numbers
const getQuantumNumbers = () => {
  const n = parseInt(nSlider.value, 10);
  let l = parseInt(lControl.input.value, 10);
  let m = parseInt(mControl.input.value, 10);
  const Z = parseInt(zSlider.value, 10);

  // clamp l and m to valid ranges
  if (l > n - 1) l = n - 1;
  if (l < 0) l = 0;
  if (Math.abs(m) > l) m = Math.sign(m) * l;

  return { n, l, m, Z };
};

// main compute function
const compute = () => {
  // update dynamic slider ranges
  lControl.update();
  mControl.update();

  const { n, l, m, Z } = getQuantumNumbers();

  // get axis range
  const xMin = parseFloat(xRange.minInput.value);
  const xMax = parseFloat(xRange.maxInput.value);
  const numPoints = 500;

  // compute ψ and ρ along x-axis (radial slice through equatorial plane)
  const xs: number[] = [];
  const psiVals: number[] = [];
  const rhoVals: number[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + (xMax - xMin) * (i / numPoints);
    const r = Math.abs(x);
    const theta = Math.PI / 2; // equatorial plane
    const phi = x >= 0 ? 0 : Math.PI; // sign of x determines phi

    if (r < 1e-10) {
      // at origin
      xs.push(x);
      psiVals.push(0);
      rhoVals.push(0);
    } else {
      const p = psi(n, l, m, r, theta, phi, Z);
      const psiReal = p.re; // real part (we're in real space along x)
      const rho = p.re * p.re + p.im * p.im;
      xs.push(x);
      psiVals.push(psiReal);
      rhoVals.push(rho);
    }
  }

  // find approximate node positions (where ψ crosses zero)
  const nodes: number[] = [];
  for (let i = 1; i < psiVals.length; i++) {
    if (psiVals[i - 1] * psiVals[i] < 0) {
      // linear interpolation to find zero crossing
      const x0 = xs[i - 1];
      const x1 = xs[i];
      const y0 = psiVals[i - 1];
      const y1 = psiVals[i];
      const xNode = x0 - y0 * (x1 - x0) / (y1 - y0);
      nodes.push(xNode);
    }
  }

  // compute theoretical node counts
  const counts = nodeCounts(n, l);

  // update node info
  nodeInfo.innerHTML = `
    <span class="node-label">Nodes:</span>
    <span>total = <strong>${counts.total}</strong></span>
    <span>radial = <strong>${counts.radial}</strong></span>
    <span>angular = <strong>${counts.angular}</strong></span>
    ${nodes.length > 0 ? `<span>visible in slice: <strong>${nodes.length}</strong></span>` : ''}
  `;

  // update formula to show current quantum numbers
  updateFormula(formulaEl, String.raw`\psi_{${n},${l},${m}}(r,\theta,\phi) = R_{${n}${l}}(r) \cdot Y_{${l}}^{${m}}(\theta,\phi), \quad \rho = |\psi|^2`);

  // find max values for scaling
  const maxPsi = Math.max(...psiVals.map(Math.abs));
  const maxRho = Math.max(...rhoVals);

  // create traces
  const traces: Plotly.Data[] = [
    {
      x: xs,
      y: psiVals,
      name: 'ψ (wavefunction)',
      mode: 'lines',
      line: { color: '#2c3e50', width: 2 },
      hovertemplate: 'x = %{x:.2f} a₀<br>ψ = %{y:.4f}<extra></extra>'
    },
    {
      x: xs,
      y: rhoVals,
      name: 'ρ = |ψ|² (probability density)',
      mode: 'lines',
      line: { color: '#e74c3c', width: 2 },
      yaxis: 'y2',
      hovertemplate: 'x = %{x:.2f} a₀<br>ρ = %{y:.4f}<extra></extra>'
    }
  ];

  // add node markers
  if (nodes.length > 0) {
    traces.push({
      x: nodes,
      y: nodes.map(() => 0),
      name: 'nodes (ψ = 0)',
      mode: 'markers',
      marker: { color: '#9b59b6', size: 10, symbol: 'diamond' },
      hovertemplate: 'Node at x = %{x:.2f} a₀<extra></extra>'
    });
  }

  // layout with dual y-axes
  const layout: Partial<Plotly.Layout> = {
    margin: { l: 60, r: 60, t: 30, b: 50 },
    xaxis: {
      title: { text: 'x (units of a₀)', standoff: 10 },
      range: [xMin, xMax],
      zeroline: true,
      zerolinecolor: '#bdc3c7',
      zerolinewidth: 1,
      gridcolor: '#ecf0f1'
    },
    yaxis: {
      title: { text: 'ψ (wavefunction)', font: { color: '#2c3e50' } },
      side: 'left',
      zeroline: true,
      zerolinecolor: '#bdc3c7',
      gridcolor: '#ecf0f1'
    },
    yaxis2: {
      title: { text: 'ρ = |ψ|² (density)', font: { color: '#e74c3c' } },
      side: 'right',
      overlaying: 'y',
      zeroline: false
    },
    legend: {
      orientation: 'h',
      y: -0.15,
      x: 0.5,
      xanchor: 'center'
    },
    hovermode: 'x unified',
    plot_bgcolor: '#fafafa',
    paper_bgcolor: 'white'
  };

  // config with zoom/pan enabled
  const config: Partial<Plotly.Config> = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false,
    toImageButtonOptions: {
      format: 'png',
      filename: `fig_1_3_n${n}_l${l}_m${m}_Z${Z}`,
      scale: 2
    }
  };

  Plotly.react(plot, traces, layout, config);
};

// event listeners
nSlider.addEventListener('input', () => {
  lControl.update();
  mControl.update();
  compute();
});

lControl.input.addEventListener('input', () => {
  mControl.update();
  compute();
});

mControl.input.addEventListener('input', compute);
zSlider.addEventListener('input', compute);
xRange.minInput.addEventListener('input', compute);
xRange.maxInput.addEventListener('input', compute);

// initial render
compute();
