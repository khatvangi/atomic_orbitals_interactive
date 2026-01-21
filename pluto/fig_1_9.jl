### A Pluto.jl notebook ###
# v0.19.0

using PlutoUI
using WGLMakie
include("common/hydrogenic.jl")
using .Hydrogenic

md"""# Figure 1.9
Radial wavefunctions R_n1 for 2p and 3p."""

@bind Z Slider(1:3, default=1)

xs = range(0, 30; length=400)
rs = [x*a0/Z for x in xs]
R2 = [R_nl(2,1,r; Z=Z) for r in rs]
R3 = [R_nl(3,1,r; Z=Z) for r in rs]

fig = Figure(resolution=(800,400))
ax = Axis(fig[1,1], xlabel="x = Zr/a0", ylabel="R_n1")
lines!(ax, xs, R2, color=:purple, label="2p")
lines!(ax, xs, R3, color=:teal, label="3p")
axislegend(ax)
fig
