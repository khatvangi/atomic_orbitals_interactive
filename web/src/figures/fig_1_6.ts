import { slider } from '../common/ui';

const controls = document.getElementById('controls')!;
const plot = document.getElementById('plot')!;
const caption = document.getElementById('caption')!;
caption.textContent = 'FIGURE 1.6 Shell/subshell classification from allowed quantum numbers.';

const nSlider = slider(controls, 'n', 1, 6, 3);

const render = () => {
  const n = parseInt(nSlider.value, 10);
  const subshells = ['s','p','d','f','g','h'];
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.innerHTML = '<thead><tr><th>ℓ</th><th>Subshell</th><th>Orbitals (2ℓ+1)</th></tr></thead>';
  const tbody = document.createElement('tbody');
  for (let l = 0; l < n; l++) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${l}</td><td>${subshells[l] ?? `l=${l}`}</td><td>${2*l+1}</td>`;
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  plot.innerHTML = '';
  plot.appendChild(table);

  const total = n * n;
  const note = document.createElement('p');
  note.textContent = `Total orbitals in shell n=${n}: n² = ${total}`;
  note.style.marginTop = '10px';
  plot.appendChild(note);
};

nSlider.addEventListener('input', render);
render();
