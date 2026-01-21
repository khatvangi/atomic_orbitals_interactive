### A Pluto.jl notebook ###
# v0.19.0

using PlutoUI
using WGLMakie
include("common/hydrogenic.jl")
using .Hydrogenic

using Meshing
include("common/grids.jl")
using .Grids

md"""# Figure 1.14
Boundary surfaces of p orbitals (density isosurface)."""

@bind orb Select([:px, :py, :pz])
@bind n Slider(2:4, default=2)
@bind Z Slider(1:3, default=1)
@bind p Slider(0.5:0.01:0.95, default=0.9)

N = 60
xs, rho = density_grid_real(n, 1, orb; Z=Z, N=N, L=12a0)
rho0 = threshold_for_probability(rho, xs; p=p)

vol = reshape(rho, (N,N,N))
verts, faces = marching_cubes(vol, rho0)

fig = Figure(resolution=(600,500))
ax = Axis3(fig[1,1])
mesh!(ax, verts, faces, color=(0.9,0.6,0.3,0.6))
fig
