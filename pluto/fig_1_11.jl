### A Pluto.jl notebook ###
# v0.19.0

using PlutoUI
using WGLMakie
include("common/hydrogenic.jl")
using .Hydrogenic

md"""# Figure 1.11
Radial distribution P(r) for 1s; r_max = a0/Z."""

@bind Z Slider(1:5, default=1)

xs = range(0, 8; length=400)
rs = [x*a0 for x in xs]
P = [radial_distribution(1,0,r; Z=Z) for r in rs]

rmax = a0/Z

fig = Figure(resolution=(800,400))
ax = Axis(fig[1,1], xlabel="r/a0", ylabel="P(r)")
lines!(ax, xs, P, color=:steelblue)
vline!(ax, rmax/a0, color=:orange, linestyle=:dash)
fig
