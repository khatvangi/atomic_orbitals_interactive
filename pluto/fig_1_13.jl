### A Pluto.jl notebook ###
# v0.19.0

using PlutoUI
using WGLMakie
include("common/hydrogenic.jl")
using .Hydrogenic

using Meshing
include("common/grids.jl")
using .Grids

md"""# Figure 1.13
Boundary surface of s orbital (90% probability)."""

@bind n Slider(1:3, default=1)
@bind Z Slider(1:3, default=1)
@bind p Slider(0.5:0.01:0.95, default=0.9)

r0 = radial_threshold_s(n; Z=Z, p=p)

fig = Figure(resolution=(600,500))
ax = Axis3(fig[1,1])
mesh!(ax, Sphere(Point3f0(0,0,0), r0/a0), color=(0.4,0.5,0.9,0.6))
fig
