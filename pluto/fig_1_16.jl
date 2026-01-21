### A Pluto.jl notebook ###
# v0.19.0

using PlutoUI
using WGLMakie
include("common/hydrogenic.jl")
using .Hydrogenic

using Meshing
include("common/grids.jl")
using .Grids

md"""# Figure 1.16
Boundary surfaces of f orbitals (density isosurface)."""

@bind orb Select([:fz3, :fxz2, :fyz2, :fxyz, :fzx2y2, :fxx23y2, :fy3x2y2])
@bind n Slider(4:6, default=4)
@bind Z Slider(1:3, default=1)
@bind p Slider(0.5:0.01:0.95, default=0.9)

N = 60
xs, rho = density_grid_real(n, 3, orb; Z=Z, N=N, L=16a0)
rho0 = threshold_for_probability(rho, xs; p=p)

vol = reshape(rho, (N,N,N))
verts, faces = marching_cubes(vol, rho0)

fig = Figure(resolution=(600,500))
ax = Axis3(fig[1,1])
mesh!(ax, verts, faces, color=(0.7,0.5,0.8,0.6))
fig
