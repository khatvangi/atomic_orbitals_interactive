### A Pluto.jl notebook ###
# v0.19.0

using PlutoUI
using WGLMakie
include("common/hydrogenic.jl")
using .Hydrogenic

md"""# Figure 1.12
Radial distributions for 2s and 2p."""

@bind Z Slider(1:5, default=1)

xs = range(0, 15; length=400)
rs = [x*a0/Z for x in xs]
P2s = [radial_distribution(2,0,r; Z=Z) for r in rs]
P2p = [radial_distribution(2,1,r; Z=Z) for r in rs]

fig = Figure(resolution=(800,400))
ax = Axis(fig[1,1], xlabel="x = Zr/a0", ylabel="P(r)")
lines!(ax, xs, P2s, color=:green, label="2s")
lines!(ax, xs, P2p, color=:purple, label="2p")
axislegend(ax)
fig
