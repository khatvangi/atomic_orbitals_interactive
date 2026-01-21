# Atomic Orbitals Interactive (Figures 1.3–1.16)

This repo generates scientifically accurate, interactive atomic‑orbital figures. Each figure is a standalone module with formula‑driven computation (no pre‑rendered images).

Targets:
- **Pluto.jl notebooks** (preferred for course site)
- **Standalone web HTML** (optional export per figure)

## Structure
```
repo/
  README.md
  pluto/
    fig_1_3.jl
    ...
    fig_1_16.jl
    common/
      hydrogenic.jl
      grids.jl
      ui.jl
  web/
    package.json
    tsconfig.json
    vite.config.ts
    fig_1_3.html
    ...
    fig_1_16.html
    src/
      common/
        hydrogenic.ts
        grids.ts
        marching.ts
        ui.ts
      figures/
        fig_1_3.ts
        ...
        fig_1_16.ts
    public/
      styles.css
  tests/
    julia/
      runtests.jl
    web/
      vitest.config.ts
      hydrogenic.test.ts
```

## Requirements
- **Julia** (for Pluto notebooks)
  - Suggested packages: `Pluto`, `PlutoUI`, `Makie`, `WGLMakie`, `GLMakie`, `Meshing`, `SpecialFunctions`
- **Node.js 18+** (for web build)

## Pluto usage
Open each notebook in Pluto:
```
using Pluto
Pluto.run()
```
Then open `pluto/fig_1_3.jl` (etc.).

The notebooks use shared utilities from `pluto/common/`.

## Web usage
Install dependencies:
```
cd web
npm install
```
Run dev server:
```
npm run dev
```
Build static HTML:
```
npm run build
```
The build outputs **one HTML per figure** in `web/dist/fig_1_3.html` etc.

## Scientific definitions (non‑negotiables)
- Hydrogenic orbital: **ψₙₗₘ(r,θ,φ) = Rₙₗ(r) · Yₗᵐ(θ,φ)**
- Probability density: **ρ = |ψ|²**
- Radial distribution: **P(r) = r² |Rₙₗ(r)|²**
- Energy levels: **Eₙ = −(hcR) Z² / n²**
- Nodes: total **n−1**, radial **n−l−1**, angular **l**
- Boundary surfaces: **90% probability surface** by default (solve for ρ₀ s.t. ∭_{ρ≥ρ₀} ρ dτ = 0.90)

## Testing
### Julia
```
cd tests/julia
julia --project -e 'using Pkg; Pkg.activate("."); Pkg.test()'
```

### Web (Vitest)
```
cd tests/web
npm install
npm run test
```

## Notes
- 3D isosurfaces use marching cubes and are recomputed from formulae.
- Phase coloring is applied to orbital lobes (+/- sign of ψ).

## License
Internal educational use.
