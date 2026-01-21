// katex loaded from CDN in HTML (non-deferred, loads before module scripts)
declare global {
  interface Window {
    katex: { render: (latex: string, el: HTMLElement, options?: object) => void };
  }
}

// basic slider control
export const slider = (
  container: HTMLElement,
  label: string,
  min: number,
  max: number,
  value: number,
  step = 1
) => {
  const wrap = document.createElement('label');
  wrap.className = 'control';
  const text = document.createElement('span');
  text.textContent = label;
  const input = document.createElement('input');
  input.type = 'range';
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(value);
  const out = document.createElement('span');
  out.className = 'control-value';
  out.textContent = String(value);
  input.addEventListener('input', () => (out.textContent = input.value));
  wrap.appendChild(text);
  wrap.appendChild(input);
  wrap.appendChild(out);
  container.appendChild(wrap);
  return input;
};

// slider with dynamic min/max and disabled state
export interface DynamicSliderOptions {
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  getMin?: () => number;
  getMax?: () => number;
}

export const dynamicSlider = (container: HTMLElement, opts: DynamicSliderOptions) => {
  const wrap = document.createElement('label');
  wrap.className = 'control';
  const text = document.createElement('span');
  text.textContent = opts.label;
  const input = document.createElement('input');
  input.type = 'range';
  input.min = String(opts.min);
  input.max = String(opts.max);
  input.step = String(opts.step ?? 1);
  input.value = String(opts.value);
  const out = document.createElement('span');
  out.className = 'control-value';
  out.textContent = String(opts.value);

  input.addEventListener('input', () => {
    out.textContent = input.value;
  });

  wrap.appendChild(text);
  wrap.appendChild(input);
  wrap.appendChild(out);
  container.appendChild(wrap);

  // update function to call when dependencies change
  const update = () => {
    const newMin = opts.getMin ? opts.getMin() : opts.min;
    const newMax = opts.getMax ? opts.getMax() : opts.max;
    input.min = String(newMin);
    input.max = String(newMax);

    const currentVal = parseInt(input.value, 10);
    const isDisabled = newMin > newMax;
    input.disabled = isDisabled;
    wrap.classList.toggle('disabled', isDisabled);

    if (!isDisabled) {
      // clamp value to new range
      if (currentVal < newMin) {
        input.value = String(newMin);
        out.textContent = String(newMin);
      } else if (currentVal > newMax) {
        input.value = String(newMax);
        out.textContent = String(newMax);
      }
    }
  };

  return { input, update, wrap };
};

// checkbox control
export const checkbox = (container: HTMLElement, label: string, checked = true) => {
  const wrap = document.createElement('label');
  wrap.className = 'control';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = checked;
  const text = document.createElement('span');
  text.textContent = label;
  wrap.appendChild(input);
  wrap.appendChild(text);
  container.appendChild(wrap);
  return input;
};

// select dropdown control
export const select = (container: HTMLElement, label: string, options: string[], value = options[0]) => {
  const wrap = document.createElement('label');
  wrap.className = 'control';
  const text = document.createElement('span');
  text.textContent = label;
  const sel = document.createElement('select');
  options.forEach((opt) => {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    sel.appendChild(o);
  });
  sel.value = value;
  wrap.appendChild(text);
  wrap.appendChild(sel);
  container.appendChild(wrap);
  return sel;
};

// range input (two values: min and max)
export const rangeInput = (
  container: HTMLElement,
  label: string,
  absMin: number,
  absMax: number,
  currentMin: number,
  currentMax: number,
  step = 1
) => {
  const wrap = document.createElement('div');
  wrap.className = 'control-group';
  const labelEl = document.createElement('span');
  labelEl.className = 'control-group-label';
  labelEl.textContent = label;
  wrap.appendChild(labelEl);

  const minWrap = document.createElement('label');
  minWrap.className = 'control';
  const minLabel = document.createElement('span');
  minLabel.textContent = 'min';
  const minInput = document.createElement('input');
  minInput.type = 'number';
  minInput.min = String(absMin);
  minInput.max = String(absMax);
  minInput.step = String(step);
  minInput.value = String(currentMin);
  minWrap.appendChild(minLabel);
  minWrap.appendChild(minInput);

  const maxWrap = document.createElement('label');
  maxWrap.className = 'control';
  const maxLabel = document.createElement('span');
  maxLabel.textContent = 'max';
  const maxInput = document.createElement('input');
  maxInput.type = 'number';
  maxInput.min = String(absMin);
  maxInput.max = String(absMax);
  maxInput.step = String(step);
  maxInput.value = String(currentMax);
  maxWrap.appendChild(maxLabel);
  maxWrap.appendChild(maxInput);

  wrap.appendChild(minWrap);
  wrap.appendChild(maxWrap);
  container.appendChild(wrap);

  return { minInput, maxInput };
};

// render LaTeX formula using KaTeX
export const renderFormula = (container: HTMLElement, latex: string) => {
  const div = document.createElement('div');
  div.className = 'formula';
  window.katex.render(latex, div, { throwOnError: false, displayMode: true });
  container.appendChild(div);
  return div;
};

// update an existing formula element
export const updateFormula = (element: HTMLElement, latex: string) => {
  window.katex.render(latex, element, { throwOnError: false, displayMode: true });
};

// button control
export const button = (container: HTMLElement, label: string, onClick: () => void) => {
  const btn = document.createElement('button');
  btn.className = 'control-btn';
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  container.appendChild(btn);
  return btn;
};
